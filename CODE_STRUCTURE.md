# Neeti AI — Code Structure

**Full Monorepo Layout for Claude Code**

---

## 1. Root Structure

```
neeti-ai/
├── frontend/              # React + Next.js 14 app
├── backend/               # Node.js + Express API
├── ai-services/           # Python FastAPI microservices
├── docker-compose.yml     # Local dev orchestration
├── .env.example
├── .gitignore
└── README.md
```

---

## 2. Frontend Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx                # Root layout (fonts, theme, providers)
│   │   ├── page.tsx                  # Landing page
│   │   │
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── recruiter/
│   │   │   ├── layout.tsx            # Recruiter layout (sidebar nav)
│   │   │   ├── dashboard/page.tsx    # Interview list + stats
│   │   │   ├── interviews/
│   │   │   │   ├── new/page.tsx      # Create interview form
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Interview details
│   │   │   │       ├── live/page.tsx # Live interview room
│   │   │   │       └── report/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   ├── candidate/
│   │   │   ├── layout.tsx            # Candidate layout
│   │   │   ├── dashboard/page.tsx    # Practice history + stats
│   │   │   ├── practice/
│   │   │   │   ├── page.tsx          # Start new mock interview
│   │   │   │   └── [sessionId]/
│   │   │   │       ├── page.tsx      # Mock interview room
│   │   │   │       └── feedback/page.tsx
│   │   │   └── interview/
│   │   │       └── join/[token]/page.tsx  # Live interview join
│   │   │
│   │   └── admin/
│   │       └── dashboard/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # Base design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── interview/
│   │   │   ├── VideoFeed.tsx         # Candidate video with overlay
│   │   │   ├── IntegrityPanel.tsx    # Real-time flag + score sidebar
│   │   │   ├── FlagAlert.tsx         # Pop-up alert component
│   │   │   ├── FlagLog.tsx           # Scrollable flag history
│   │   │   ├── TrustScoreGauge.tsx   # Animated circular gauge
│   │   │   ├── SessionTimer.tsx
│   │   │   ├── QuestionPanel.tsx     # Recruiter question prompts
│   │   │   └── ConsentModal.tsx      # Pre-session consent
│   │   │
│   │   ├── mock/
│   │   │   ├── AIInterviewer.tsx     # AI agent avatar + question display
│   │   │   ├── CoachingOverlay.tsx   # Real-time coaching signals
│   │   │   ├── ResponseRecorder.tsx  # Audio/video response capture
│   │   │   └── ProgressBar.tsx       # Interview progress
│   │   │
│   │   ├── report/
│   │   │   ├── ReportHeader.tsx      # Trust score + risk badge
│   │   │   ├── ScoreBreakdown.tsx    # Integrity vs Performance chart
│   │   │   ├── FlagTimeline.tsx      # Chronological flag visualization
│   │   │   ├── HighlightsList.tsx
│   │   │   └── RecruiterDecision.tsx # Decision + notes form
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── InterviewTable.tsx
│   │   │   └── TrustScoreDistribution.tsx
│   │   │
│   │   └── common/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── SystemCheck.tsx       # Camera/mic/browser pre-check
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth state + actions
│   │   ├── useWebRTC.ts              # WebRTC session management
│   │   ├── useSocket.ts              # Socket.IO connection hook
│   │   ├── useProctoring.ts          # Proctoring state (flags, scores)
│   │   ├── useMediaCapture.ts        # Camera/mic access
│   │   ├── useTabVisibility.ts       # Tab switch detection
│   │   └── useMockInterview.ts       # Mock session state
│   │
│   ├── lib/
│   │   ├── api.ts                    # Axios instance + interceptors
│   │   ├── socket.ts                 # Socket.IO client setup
│   │   ├── webrtc.ts                 # WebRTC helpers
│   │   └── utils.ts                  # General utilities
│   │
│   ├── stores/
│   │   ├── auth.store.ts             # Zustand: user + tokens
│   │   ├── interview.store.ts        # Zustand: current interview state
│   │   ├── proctoring.store.ts       # Zustand: flags, live scores
│   │   └── mock.store.ts             # Zustand: mock session state
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── interview.types.ts
│   │   ├── session.types.ts
│   │   ├── report.types.ts
│   │   └── socket.types.ts
│   │
│   └── styles/
│       └── globals.css               # Tailwind base + CSS variables
│
├── public/
│   ├── fonts/
│   └── icons/
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts
│   │   ├── interview/
│   │   │   ├── interview.controller.ts
│   │   │   ├── interview.service.ts
│   │   │   ├── interview.routes.ts
│   │   │   └── interview.schema.ts
│   │   ├── session/
│   │   │   ├── session.controller.ts
│   │   │   ├── session.service.ts
│   │   │   ├── session.routes.ts
│   │   │   └── session.schema.ts
│   │   ├── mock/
│   │   │   ├── mock.controller.ts
│   │   │   ├── mock.service.ts
│   │   │   ├── mock.routes.ts
│   │   │   └── mock.schema.ts
│   │   ├── report/
│   │   │   ├── report.controller.ts
│   │   │   ├── report.service.ts
│   │   │   └── report.routes.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── user.routes.ts
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   ├── vision.service.ts
│   │   │   ├── audio.service.ts
│   │   │   ├── nlp.service.ts
│   │   │   └── behavior.service.ts
│   │   ├── orchestrator.service.ts
│   │   ├── report.generator.ts
│   │   ├── invite.service.ts
│   │   └── storage.service.ts
│   │
│   ├── socket/
│   │   ├── socket.server.ts
│   │   ├── handlers/
│   │   │   ├── interview.handler.ts
│   │   │   └── mock.handler.ts
│   │   └── emitters/
│   │       ├── proctor.emitter.ts
│   │       └── mock.emitter.ts
│   │
│   ├── jobs/
│   │   ├── queue.ts
│   │   ├── frame.processor.ts
│   │   └── audio.processor.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Interview.ts
│   │   ├── Session.ts
│   │   ├── ProctoringEvent.ts
│   │   ├── Report.ts
│   │   ├── MockSession.ts
│   │   ├── MockResponse.ts
│   │   ├── QuestionBank.ts
│   │   ├── InviteToken.ts
│   │   └── AuditLog.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── token.ts
│   │   └── logger.ts
│   │
│   ├── types/
│   │   ├── express.d.ts
│   │   └── index.ts
│   │
│   └── app.ts
│
├── index.ts
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 4. AI Services Structure

```
ai-services/
├── vision/
│   ├── main.py                       # FastAPI app
│   ├── analyzer.py                   # Core detection logic
│   ├── models/
│   │   ├── face_detector.py          # MediaPipe face detection
│   │   ├── gaze_estimator.py         # Gaze direction estimation
│   │   └── multi_person_detector.py  # YOLOv8 multi-face
│   ├── schemas.py                    # Pydantic request/response schemas
│   ├── requirements.txt
│   └── Dockerfile
│
├── audio/
│   ├── main.py
│   ├── analyzer.py
│   ├── models/
│   │   ├── vad.py                    # WebRTC VAD
│   │   ├── diarizer.py               # pyannote speaker diarization
│   │   └── confidence.py             # Confidence/hesitation scorer
│   ├── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── nlp/
│   ├── main.py
│   ├── analyzer.py
│   ├── models/
│   │   ├── quality_scorer.py         # Response quality evaluation
│   │   ├── ai_detector.py            # AI-generated answer detection
│   │   └── clarity_scorer.py         # Clarity and relevance scoring
│   ├── prompts/
│   │   ├── quality_eval.txt          # System prompt for Claude eval
│   │   └── followup_gen.txt          # Follow-up question generation
│   ├── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── behavior/
│   ├── main.py
│   ├── scorer.py                     # Final behavior scoring logic
│   ├── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
│
└── shared/
    ├── config.py                     # Shared config (env vars)
    └── utils.py                      # Shared helpers
```

---

## 5. Docker Compose (Local Dev)

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
      - NEXT_PUBLIC_WS_URL=ws://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: ./backend/.env
    depends_on:
      - mongo
      - redis
    volumes:
      - ./backend:/app

  vision-service:
    build: ./ai-services/vision
    ports:
      - "8001:8001"
    environment:
      - PORT=8001

  audio-service:
    build: ./ai-services/audio
    ports:
      - "8002:8002"

  nlp-service:
    build: ./ai-services/nlp
    ports:
      - "8003:8003"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}

  behavior-service:
    build: ./ai-services/behavior
    ports:
      - "8004:8004"
    environment:
      - VISION_URL=http://vision-service:8001
      - AUDIO_URL=http://audio-service:8002
      - NLP_URL=http://nlp-service:8003

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

---

## 6. Key File Explanations

### `useWebRTC.ts`
Manages the entire WebRTC lifecycle:
- `getUserMedia()` for camera/mic access
- `RTCPeerConnection` setup and ICE negotiation
- Frame sampling loop (every 300ms → base64 encode → emit via socket)
- Audio capture + chunking pipeline

### `useProctoring.ts`
Subscribes to Socket.IO proctoring events:
- Maintains flag array in Zustand store
- Calculates rolling live score
- Triggers toast notifications for HIGH/CRITICAL flags

### `orchestrator.service.ts`
The core backend brain:
- Receives raw events from Socket.IO handlers
- Routes to appropriate AI service
- Applies deduplication (Redis TTL keys)
- Writes to MongoDB
- Emits processed events back to frontend

### `report.generator.ts`
Called when `interview:end` event fires:
- Queries all proctoring_events for session
- Calls behavior service for final scoring
- Calls Claude API for AI-generated summary text
- Assembles and saves report document
- Optionally triggers PDF generation via Puppeteer

### `vision/analyzer.py`
Core CV pipeline:
1. Decode base64 frame to numpy array
2. Run MediaPipe Face Detection → get face count + landmarks
3. Run Gaze Estimator on detected face → direction (center/left/right/up/down)
4. If face_count > 1 → run YOLOv8 confirmation
5. Return structured result

---

## 7. Naming Conventions

| Layer | Convention |
|---|---|
| Components | PascalCase (`VideoFeed.tsx`) |
| Hooks | camelCase with `use` prefix (`useWebRTC.ts`) |
| Stores | camelCase with `.store.ts` suffix |
| Types/Interfaces | PascalCase with `Types` suffix or `I` prefix |
| API routes | kebab-case URLs (`/api/mock-sessions`) |
| DB collections | snake_case (`proctoring_events`) |
| Env vars | SCREAMING_SNAKE_CASE |
| Python files | snake_case |

---

## 8. Getting Started (Claude Code Instructions)

```bash
# 1. Clone repo
git clone https://github.com/your-org/neeti-ai
cd neeti-ai

# 2. Set up environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Fill in all required values

# 3. Start all services
docker-compose up --build

# OR run individually:

# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev

# AI Services (each in separate terminal)
cd ai-services/vision && pip install -r requirements.txt && uvicorn main:app --port 8001 --reload
cd ai-services/audio && pip install -r requirements.txt && uvicorn main:app --port 8002 --reload
cd ai-services/nlp && pip install -r requirements.txt && uvicorn main:app --port 8003 --reload
cd ai-services/behavior && pip install -r requirements.txt && uvicorn main:app --port 8004 --reload
```

---

## 9. Build Order for Claude Code

When implementing from scratch, follow this order:

1. **Database models** (MongoDB schemas)
2. **Auth module** (register, login, JWT)
3. **Interview CRUD** (create, list, get)
4. **Socket.IO server setup** (room management)
5. **Vision AI service** (face detection, gaze)
6. **Audio AI service** (VAD, speaker detection)
7. **Orchestrator** (tie WebSocket + AI services)
8. **Frontend: Auth pages** (login/register)
9. **Frontend: Live interview room** (VideoFeed, IntegrityPanel)
10. **Frontend: Proctoring hooks** (useWebRTC, useProctoring)
11. **NLP service** (response quality, AI detection)
12. **Report generator** (Trust Score algorithm)
13. **Frontend: Report page** (charts, flag timeline)
14. **Mock interview module** (question bank, AI interviewer)
15. **Frontend: Practice flow** (mock interview, feedback)
