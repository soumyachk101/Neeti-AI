# Neeti AI — System Design

**Document:** High-level and low-level system design for Claude Code implementation

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEETI AI PLATFORM                                  │
│                                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  Recruiter   │    │  Candidate   │    │    Admin     │                  │
│  │  Web App     │    │  Web App     │    │   Portal     │                  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                  │
│         │ HTTPS/WSS         │ HTTPS/WSS          │ HTTPS                    │
│         └─────────────────────────────────────────┘                         │
│                             │                                                 │
│              ┌──────────────▼──────────────┐                                │
│              │       API Gateway            │                                │
│              │   (Express + Socket.IO)      │                                │
│              └──────────────┬──────────────┘                                │
│                    ┌────────┼────────┐                                       │
│                    │        │        │                                        │
│              ┌─────▼──┐ ┌──▼───┐ ┌──▼─────┐                               │
│              │  REST  │ │  WS  │ │  Bull  │                                │
│              │  API   │ │  Hub │ │ Queue  │                                │
│              └─────┬──┘ └──┬───┘ └──┬─────┘                               │
│                    │       │        │                                         │
│              ┌─────▼───────▼────────▼──────────────┐                       │
│              │         Orchestrator Service          │                       │
│              └──┬────────┬──────────┬───────────────┘                      │
│                 │        │          │                                         │
│         ┌───────▼──┐ ┌───▼────┐ ┌──▼────┐ ┌──────────┐                   │
│         │  Vision  │ │ Audio  │ │  NLP  │ │ Behavior │                    │
│         │ Service  │ │Service │ │Service│ │ Scorer   │                    │
│         │ :8001    │ │ :8002  │ │ :8003 │ │  :8004   │                    │
│         └──────────┘ └────────┘ └───────┘ └──────────┘                    │
│                    │                │                                          │
│         ┌──────────▼────────────────▼──────┐                               │
│         │         Data Layer                │                               │
│         │  MongoDB    Redis    S3/R2        │                               │
│         └──────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Real-Time Data Pipeline

This is the most critical flow in the system. Every second during a live interview:

```
Browser (Candidate) every 300ms:
│
├── FRAME SAMPLING
│   canvas.getContext('2d').drawImage(video, ...)
│   const frameData = canvas.toDataURL('image/jpeg', 0.7)  // base64
│   socket.emit('interview:frame', { sessionId, frameData })
│
├── AUDIO CHUNKING
│   MediaRecorder API → 1500ms chunks → ArrayBuffer
│   socket.emit('interview:audio', { sessionId, audioChunk })
│
└── BROWSER EVENTS
    document.addEventListener('visibilitychange', ...)
    window.addEventListener('blur', ...)
    socket.emit('interview:event', { sessionId, type: 'TAB_SWITCH', ... })
```

```
Backend (Socket Handler → Queue → Worker → AI → DB → Socket):
│
├── Socket receives 'interview:frame'
│   → Push to frameQueue (Bull)
│   → Immediate ACK to client
│
├── frameQueue.process() Worker:
│   → HTTP POST to Vision Service: { sessionId, frameData }
│   → Vision Service returns: { face_present, face_count, gaze_direction }
│   → Orchestrator evaluates result
│   → If flag needed: create ProctoringEvent in MongoDB
│   → If flag HIGH/CRITICAL: io.to(sessionRoom).emit('proctor:flag', ...)
│   → Always: update live score in Redis, emit 'proctor:score_update'
│
└── Recruiter UI receives 'proctor:flag':
    → Toast notification appears
    → Flag added to IntegrityPanel list
    → TrustScoreGauge animates to new value
```

**Latency budget:**
```
Frame capture → socket emit:           ~5ms
Queue enqueue:                         ~2ms
Worker pickup:                         ~10ms
HTTP to Vision Service:                ~20ms
MediaPipe inference:                   ~80-150ms
Orchestrator + DB write:               ~20ms
Socket emit to recruiter:              ~10ms
UI render update:                      ~16ms (1 frame)
─────────────────────────────────────────────
Total round trip:                      ~170-230ms ✅ (well under 2s target)
```

---

## 3. WebRTC Architecture

For MVP, using direct P2P WebRTC (no TURN/SFU server needed for demo):

```
Recruiter Browser ←──── RTCPeerConnection ────→ Candidate Browser
                                │
                         Signaling via
                         Socket.IO Server
                         (offer/answer/ICE candidates)
```

**Signaling Flow:**
```
1. Recruiter joins → io.to(room).emit('peer:ready', recruiterId)
2. Candidate joins → receives 'peer:ready' 
3. Candidate creates offer → socket.emit('peer:offer', { sdp })
4. Recruiter receives offer → creates answer → socket.emit('peer:answer', { sdp })
5. Both exchange ICE candidates via 'peer:ice-candidate' events
6. P2P video established
```

**Why no TURN server for MVP:**
- Hackathon demo: both parties likely on same network or close
- TURN adds latency and infrastructure cost
- Can add Coturn server for production

---

## 4. Authentication & Session Flow

```
Register/Login Flow:
──────────────────
Client: POST /api/auth/login { email, password }
Server: 
  1. Find user in MongoDB
  2. bcrypt.compare(password, passwordHash)
  3. Generate JWT access token (15min) + refresh token (7d)
  4. Store refresh token hash in user document
  5. Set refresh token in httpOnly cookie
  6. Return { accessToken, user }
Client:
  1. Store accessToken in Zustand (memory only)
  2. Attach to all API requests: Authorization: Bearer <token>

Token Refresh Flow:
───────────────────
Client: token expires → POST /api/auth/refresh (cookie auto-sent)
Server:
  1. Read refresh token from httpOnly cookie
  2. Verify JWT signature
  3. Find user, compare stored hash
  4. Issue new access token
  5. Return { accessToken }

Socket Auth:
────────────
Client: io({ auth: { token: accessToken } })
Server middleware:
  socket.use((socket, next) => {
    const token = socket.handshake.auth.token
    const payload = verifyJWT(token)
    if (!payload) return next(new Error('Unauthorized'))
    socket.data.userId = payload.userId
    socket.data.role = payload.role
    next()
  })
```

---

## 5. Invite Link System

```
Recruiter creates invite:
──────────────────────────
1. POST /api/interviews/:id/invite { candidateEmail }
2. Server generates UUID token
3. Stores in Redis: invite:{token} → { interviewId, email } TTL: 86400s
4. Stores in MongoDB InviteToken collection (for audit)
5. Sends email via SendGrid with link:
   https://neeti.ai/candidate/interview/join/{token}

Candidate clicks link:
──────────────────────
1. Next.js page: /candidate/interview/join/[token]
2. GET /api/sessions/validate-invite/:token
   → Redis GET invite:{token}
   → If not found: "Link expired or invalid" error
   → If found: return { interviewId, role, recruiterName }
3. Candidate registers/logs in (if not already)
4. POST /api/sessions/join { inviteToken }
   → Create Session document
   → Mark token as used in Redis + MongoDB
   → Return { sessionId, interviewDetails }
5. Redirect to live interview lobby
```

---

## 6. Report Generation Design

```
Triggered by: POST /api/interviews/:id/end

Report Generation Pipeline:
────────────────────────────
1. Mark interview status: 'completed'
2. Mark session status: 'completed', set endedAt
3. Enqueue report job to Bull queue

ReportJob Worker:
─────────────────
1. Fetch all ProctoringEvents for session
2. Fetch all MockResponses (if applicable)
3. Call Behavior Service:
   POST /behavior/score { sessionId, events }
   → Returns: { integrity_score, performance_score, risk_level, flag_summary }
4. Call Claude API for AI summary text
5. Compute Trust Score: (integrity * 0.6) + (performance * 0.4)
6. Assemble Report document:
   {
     sessionId, integrityScore, performanceScore, trustScore,
     riskLevel, flagSummary, highlights, aiSummary,
     recruiterDecision: { recommendation: 'pending' }
   }
7. Save to MongoDB
8. Emit 'report:ready' via Socket.IO to recruiter
9. Optionally: generate PDF via Puppeteer → upload to S3 → store URL

Frontend:
──────────
Recruiter is on /interviews/:id/live
→ Receives 'report:ready' event
→ Auto-redirects to /interviews/:id/report
→ Smooth transition animation
```

---

## 7. Mock Interview State Machine

```
States: idle → configuring → active → completed | abandoned

Transitions:
─────────────
idle → configuring: User clicks "Start Practice"
configuring → active: User selects role + difficulty, clicks "Begin"
active → active: Questions progress (currentQuestionIndex++)
active → completed: All questions answered OR user clicks "Finish"
active → abandoned: User closes tab / network disconnect
completed → idle: User returns to dashboard

Active State Sub-states:
─────────────────────────
answering → evaluating → feedback_shown → next_question
              ↑ Claude API call happens here
              
Question Flow:
──────────────
1. GET /api/mock/:id/question → returns current question
2. Candidate answers (audio or text)
3. POST /api/mock/:id/response { transcript, audioDuration, behavioralSignals }
4. Server:
   a. Calls NLP Service: evaluate response quality
   b. Calls Claude API: generate follow-up question (or null)
   c. Saves MockResponse to MongoDB
   d. Updates MockSession scores (rolling average)
5. Response: { questionScore, feedback, followUpQuestion, nextQuestion }
6. Frontend: 
   - Show per-question score briefly (2s)
   - If followUp exists: show it as next question
   - Else: increment questionIndex, load next from bank
```

---

## 8. Scalability Design

### Current (Hackathon MVP)
```
Single Docker Compose stack:
- 1 × Frontend (Next.js)
- 1 × Backend (Express)
- 4 × AI Services (Python)
- 1 × MongoDB (Atlas M0)
- 1 × Redis (Railway plugin)

Capable of: 5-20 concurrent sessions
```

### V1 Production Target
```
Horizontal Scaling:
- Frontend: Vercel (auto-scale)
- Backend: 2-4 replicas behind load balancer (Railway / AWS ECS)
- AI Services: 2 replicas each (scale based on queue depth)
- MongoDB: Atlas M10 shared cluster
- Redis: Upstash Redis (serverless, auto-scale)
- Bull Queue: Shared Redis, multiple workers

Capable of: 100-500 concurrent sessions
```

### V2 Enterprise Target
```
- Backend: AWS ECS Fargate, 5-10 replicas
- AI Services: GPU instances for vision (AWS g4dn.xlarge)
- WebRTC: Mediasoup SFU for multi-party sessions
- MongoDB: Atlas M30 dedicated cluster + read replicas
- Redis: AWS ElastiCache cluster
- Storage: CloudFront CDN in front of S3

Capable of: 5000+ concurrent sessions
```

---

## 9. Caching Strategy

```
Redis Cache Keys & TTLs:
─────────────────────────

Session state (live):
  session:{id}:state         Hash    TTL: 2h
  session:{id}:connections   Set     TTL: 2h

Invite tokens:
  invite:{token}             String  TTL: 24h

Flag deduplication:
  dedup:{sessionId}:{type}   String  TTL: 10s

Question bank cache:
  questions:{role}:{difficulty}  String (JSON)  TTL: 1h
  (Refreshed from MongoDB hourly, cached to avoid DB reads per question)

User session (auth):
  user:{userId}:session      Hash    TTL: 15m (matches JWT expiry)

Report cache:
  report:{reportId}          String (JSON)  TTL: 30m
  (Cache rendered report to avoid re-querying all events)
```

---

## 10. Error Handling & Resilience

### Circuit Breaker Pattern (AI Services)
```typescript
// If Vision Service fails 3 times in 30s:
// → Open circuit: skip vision analysis for next 60s
// → Mark session as "monitoring_limited"
// → Continue session (don't terminate)

class AIServiceCircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  
  async call<T>(fn: () => Promise<T>): Promise<T | null> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = 'half-open'
      } else {
        return null  // Skip, don't fail the session
      }
    }
    
    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      return null
    }
  }
}
```

### Session Recovery
```
WebSocket disconnects:
- Client: auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Server: maintain session state in Redis for 10 minutes after disconnect
- On reconnect: client emits 'interview:rejoin' → server restores state
- Interview continues if reconnect within 10 minutes
- If timeout: session marked 'abandoned'
```

---

## 11. Monitoring & Observability

```
Metrics to track (Datadog / custom):
─────────────────────────────────────
- Active sessions (gauge)
- Frame processing latency (histogram)
- Audio processing latency (histogram)  
- AI flag rate per session (counter)
- WebSocket connections (gauge)
- Report generation time (histogram)
- API error rate by endpoint (counter)

Logs (Winston → Datadog):
──────────────────────────
- Session lifecycle events (start, end, abandon)
- All flag creations (type, severity, sessionId)
- AI service errors + circuit breaker trips
- Auth events (login, register, token refresh)
- Report generation success/failure

Alerts:
────────
- Session error rate > 5%: PagerDuty
- AI service circuit breaker open: Slack
- MongoDB connection pool > 80%: Slack
- API p95 latency > 1s: Slack
```

---

## 12. Security Threat Model

| Threat | Mitigation |
|---|---|
| JWT token theft | httpOnly cookies for refresh token; short-lived access tokens |
| Invite link sharing | Single-use tokens; email bound to token |
| Frame injection (fake video) | Behavioral consistency check across frames; no bypasses at demo level |
| Session hijacking | Session IDs not guessable; Redis session bound to userId |
| MongoDB injection | Mongoose schema validation + parameterized queries |
| DDoS on AI services | Rate limiting on WebSocket frame emissions (max 10fps) |
| XSS | Next.js built-in XSS protection; no dangerouslySetInnerHTML |
| CSRF | SameSite=Strict cookies; CORS whitelist |
| Mass invite spam | Rate limit: 10 invites per recruiter per hour |
