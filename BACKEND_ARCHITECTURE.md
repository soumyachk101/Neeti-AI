# Neeti AI — Backend Architecture

**Stack:** Node.js + Express + TypeScript + Socket.IO + Redis + MongoDB

---

## 1. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts               # MongoDB connection
│   │   ├── redis.ts            # Redis client
│   │   └── env.ts              # Environment validation (Zod)
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── role.middleware.ts  # Role-based access (recruiter/candidate/admin)
│   │   ├── error.middleware.ts # Global error handler
│   │   └── validate.middleware.ts # Request body validation (Zod)
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts  # Zod schemas
│   │   │
│   │   ├── interview/
│   │   │   ├── interview.controller.ts
│   │   │   ├── interview.service.ts
│   │   │   ├── interview.routes.ts
│   │   │   └── interview.schema.ts
│   │   │
│   │   ├── session/
│   │   │   ├── session.controller.ts
│   │   │   ├── session.service.ts
│   │   │   ├── session.routes.ts
│   │   │   └── session.schema.ts
│   │   │
│   │   ├── mock/
│   │   │   ├── mock.controller.ts
│   │   │   ├── mock.service.ts
│   │   │   ├── mock.routes.ts
│   │   │   └── mock.schema.ts
│   │   │
│   │   ├── report/
│   │   │   ├── report.controller.ts
│   │   │   ├── report.service.ts
│   │   │   └── report.routes.ts
│   │   │
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── user.routes.ts
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   ├── vision.service.ts     # HTTP client → Python Vision API
│   │   │   ├── audio.service.ts      # HTTP client → Python Audio API
│   │   │   ├── nlp.service.ts        # HTTP client → Python NLP API
│   │   │   └── behavior.service.ts   # HTTP client → Python Behavior API
│   │   │
│   │   ├── orchestrator.service.ts   # Core session orchestration logic
│   │   ├── report.generator.ts       # Trust score + report assembly
│   │   ├── invite.service.ts         # Invite link generation + email
│   │   └── storage.service.ts        # S3 / R2 upload helpers
│   │
│   ├── socket/
│   │   ├── socket.server.ts          # Socket.IO initialization
│   │   ├── handlers/
│   │   │   ├── interview.handler.ts  # interview:join, frame, audio, event
│   │   │   └── mock.handler.ts       # mock:join, response
│   │   └── emitters/
│   │       ├── proctor.emitter.ts    # proctor:flag, score_update, alert
│   │       └── mock.emitter.ts       # mock:question, coaching
│   │
│   ├── jobs/
│   │   ├── queue.ts                  # Bull queue setup
│   │   ├── frame.processor.ts        # Process vision jobs from queue
│   │   └── audio.processor.ts        # Process audio jobs from queue
│   │
│   ├── models/                       # Mongoose models (see DATABASE.md)
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── token.ts                  # Invite token generation
│   │   └── logger.ts
│   │
│   ├── types/
│   │   ├── express.d.ts              # Extend Express Request with user
│   │   └── index.ts                  # Shared types
│   │
│   └── app.ts                        # Express app setup
│
├── index.ts                          # Entry point
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 2. Module Breakdown

### Auth Module

**Responsibilities:** Register, login, JWT issuance, refresh, me endpoint

**auth.service.ts — Key Methods:**
```typescript
registerUser(data: RegisterDto): Promise<UserDoc>
loginUser(data: LoginDto): Promise<{ accessToken: string; refreshToken: string }>
refreshToken(refreshToken: string): Promise<{ accessToken: string }>
getCurrentUser(userId: string): Promise<UserDoc>
```

**Token Strategy:**
- Access token: JWT, 15 min, signed with ACCESS_JWT_SECRET
- Refresh token: JWT, 7 days, stored in httpOnly cookie
- Token payload: `{ userId, role, email }`

---

### Interview Module

**Responsibilities:** CRUD for interviews, invite generation, session lifecycle

**interview.service.ts — Key Methods:**
```typescript
createInterview(recruiterId: string, data: CreateInterviewDto): Promise<InterviewDoc>
listInterviews(recruiterId: string): Promise<InterviewDoc[]>
getInterview(id: string, recruiterId: string): Promise<InterviewDoc>
startInterview(id: string): Promise<void>
endInterview(id: string): Promise<void>
generateInviteLink(interviewId: string, candidateEmail: string): Promise<string>
```

**Invite Link Logic:**
- Generate UUID token → store in Redis with TTL 24h → encode in URL
- On candidate click: validate token → create/link candidate session → redirect to lobby

---

### Session Module

**Responsibilities:** Candidate session join, frame/audio ingestion, event logging

**session.service.ts — Key Methods:**
```typescript
joinSession(inviteToken: string, candidateId: string): Promise<SessionDoc>
logEvent(sessionId: string, event: ProctoringEvent): Promise<void>
processFrame(sessionId: string, frameData: string): Promise<void>  // enqueues to Bull
processAudio(sessionId: string, audioChunk: Buffer): Promise<void>  // enqueues to Bull
getSessionEvents(sessionId: string): Promise<ProctoringEvent[]>
```

---

### Orchestrator Service

**Core logic tying everything together during a live interview**

```typescript
// orchestrator.service.ts

async handleFrame(sessionId: string, frameData: string): Promise<void> {
  const result = await visionService.analyzeFrame(frameData, sessionId)
  
  if (!result.face_present) {
    await this.createFlag(sessionId, 'NO_FACE', 'HIGH')
  }
  if (result.face_count > 1) {
    await this.createFlag(sessionId, 'MULTIPLE_FACES', 'CRITICAL')
  }
  if (result.gaze_direction === 'away') {
    await this.createFlag(sessionId, 'GAZE_AWAY', 'MEDIUM')
  }
  
  await this.updateLiveScore(sessionId)
}

async handleAudio(sessionId: string, audioChunk: Buffer): Promise<void> {
  const result = await audioService.analyzeAudio(audioChunk, sessionId)
  
  if (result.speaker_count > 1) {
    await this.createFlag(sessionId, 'MULTIPLE_SPEAKERS', 'HIGH')
  }
  
  await this.updateLiveScore(sessionId)
}

async createFlag(sessionId: string, type: string, severity: Severity): Promise<void> {
  const flag = await ProctoringEvent.create({ sessionId, type, severity, timestamp: new Date() })
  // Emit to recruiter via Socket.IO
  proctorEmitter.emitFlag(sessionId, flag)
}

async updateLiveScore(sessionId: string): Promise<void> {
  const score = await behaviorService.computeLiveScore(sessionId)
  proctorEmitter.emitScoreUpdate(sessionId, score)
}
```

---

### Report Generator

**Triggered on session end. Assembles all signals into Trust Score + report.**

```typescript
// report.generator.ts

async generateReport(sessionId: string): Promise<ReportDoc> {
  const events = await ProctoringEvent.find({ sessionId })
  const session = await Session.findById(sessionId)
  
  const behaviorScore = await behaviorService.computeFinalScore(sessionId, events)
  
  const report = {
    sessionId,
    integrityScore: behaviorScore.integrity_score,
    performanceScore: behaviorScore.performance_score,
    trustScore: computeTrustScore(behaviorScore),
    riskLevel: behaviorScore.risk_level,
    flagSummary: summarizeFlags(events),
    highlights: extractHighlights(events),
    generatedAt: new Date()
  }
  
  return Report.create(report)
}

function computeTrustScore(scores: BehaviorScores): number {
  // Weighted formula:
  // Trust = (integrity_score * 0.6) + (performance_score * 0.4)
  return Math.round((scores.integrity_score * 0.6) + (scores.performance_score * 0.4))
}
```

---

## 3. Socket.IO Architecture

```typescript
// socket.server.ts

io.on('connection', (socket) => {
  const { userId, role } = verifySocketToken(socket.handshake.auth.token)
  
  socket.on('interview:join', (data) => interviewHandler.onJoin(socket, data))
  socket.on('interview:frame', (data) => interviewHandler.onFrame(socket, data))
  socket.on('interview:audio', (data) => interviewHandler.onAudio(socket, data))
  socket.on('interview:event', (data) => interviewHandler.onBrowserEvent(socket, data))
  
  socket.on('disconnect', () => interviewHandler.onDisconnect(socket, userId))
})
```

**Room Strategy:**
- Each interview session gets a room: `interview:{sessionId}`
- Recruiter and candidate both join the same room
- AI alerts emitted to room → recruiter UI receives them

---

## 4. Bull Queue for AI Processing

```typescript
// jobs/queue.ts
export const frameQueue = new Bull('frame-processing', { redis: redisConfig })
export const audioQueue = new Bull('audio-processing', { redis: redisConfig })

// jobs/frame.processor.ts
frameQueue.process(async (job) => {
  const { sessionId, frameData } = job.data
  await orchestratorService.handleFrame(sessionId, frameData)
})

// Concurrency: 5 workers for frames, 3 for audio
frameQueue.process(5, frameProcessor)
audioQueue.process(3, audioProcessor)
```

**Why Bull Queue?**
- Decouples WebSocket ingestion from AI processing
- Handles traffic spikes gracefully
- Provides retry logic for failed AI calls
- Dashboard visibility via Bull Board (optional)

---

## 5. Environment Variables

```env
# App
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

# Auth
ACCESS_JWT_SECRET=...
REFRESH_JWT_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI Services
VISION_SERVICE_URL=http://localhost:8001
AUDIO_SERVICE_URL=http://localhost:8002
NLP_SERVICE_URL=http://localhost:8003
BEHAVIOR_SERVICE_URL=http://localhost:8004

# Storage
S3_BUCKET=neeti-ai-media
S3_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Email
SENDGRID_API_KEY=...
SENDGRID_FROM=noreply@neeti.ai

# Anthropic (for NLP service)
ANTHROPIC_API_KEY=...

# Frontend URL (for CORS + invite links)
FRONTEND_URL=http://localhost:3000
```

---

## 6. Middleware Pipeline

```
Request
  → CORS
  → Helmet (security headers)
  → Rate Limiter (express-rate-limit)
  → JSON body parser
  → Auth Middleware (JWT verification on protected routes)
  → Role Middleware (recruiter/candidate/admin guard)
  → Route Handler
  → Validation Middleware (Zod schema check)
  → Controller
  → Service
  → Response
  → Error Handler (catch-all)
```

---

## 7. Key Dependencies

```json
{
  "dependencies": {
    "express": "^4.18",
    "socket.io": "^4.6",
    "mongoose": "^8",
    "ioredis": "^5",
    "bull": "^4",
    "jsonwebtoken": "^9",
    "bcryptjs": "^2.4",
    "zod": "^3",
    "axios": "^1",
    "uuid": "^9",
    "@sendgrid/mail": "^8",
    "puppeteer": "^21",
    "winston": "^3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/express": "^4",
    "ts-node": "^10",
    "nodemon": "^3",
    "jest": "^29"
  }
}
```
