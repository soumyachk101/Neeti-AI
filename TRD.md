# Neeti AI — Technical Requirements Document (TRD)

**Version:** 2.0  
**Project:** Neeti AI  
**Purpose:** AI-powered interview integrity and mock interview platform with real-time proctoring, behavioral analysis, and structured evaluation.

---

## 1. System Overview

Neeti AI delivers two core technical experiences running on a shared infrastructure:

- **Phase 1 (Recruiter-Led Live Interview):** Real-time AI proctoring pipeline that monitors video, audio, and screen signals to detect suspicious activity, while generating objective evaluation reports.
- **Phase 2 (Candidate Mock Interview):** An AI interviewer agent that conducts adaptive practice interviews, evaluates responses, and produces improvement insights.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────── Client Layer ──────────────────────────────────────┐
│          Recruiter Web App            Candidate Web App          Admin Portal              │
│          (React + Next.js)            (React + Next.js)          (React + Next.js)         │
└──────────────────┬────────────────────────────┬──────────────────────────┬────────────────┘
                   │ REST / WebSocket            │ REST / WebSocket         │ REST
                   ▼                             ▼                          ▼
┌─────────────────────────────────── API & Realtime Layer ──────────────────────────────────┐
│   Express REST API    │    Socket.IO WebSocket Hub    │    Auth Service (JWT)              │
│   Interview Orchestrator                              │    Invite Link Service             │
└──────────────────┬────────────────────────────┬───────────────────────────────────────────┘
                   │ HTTP / gRPC                 │ Redis Pub/Sub
                   ▼                             ▼
┌─────────────────────────────────── AI/ML Services Layer ──────────────────────────────────┐
│    Vision Service       Audio Service       NLP Service       Behavior Scoring Engine      │
│    (Python/FastAPI)     (Python/FastAPI)    (Python/FastAPI)  (Python/FastAPI)             │
└──────────────────┬────────────────────────────┬───────────────────────────────────────────┘
                   │                             │
                   ▼                             ▼
┌─────────────────────────────────── Data & Storage Layer ──────────────────────────────────┐
│        MongoDB Atlas          Redis Cache          S3-Compatible Object Store              │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

**Component Interaction Flow:**
1. Web clients stream AV frames + browser events to WebSocket Hub
2. Orchestrator dispatches frames/audio chunks to AI microservices
3. AI services emit scored events back to Orchestrator
4. Orchestrator writes results to MongoDB + pushes alerts to UI via Socket.IO
5. On session end, Report Generator aggregates all signals into a Trust Score report

---

## 3. Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP + Framer Motion |
| 3D / Visual | Three.js (landing page) |
| AV Capture | WebRTC (getUserMedia, RTCPeerConnection) |
| Realtime | Socket.IO client |
| State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js |
| Language | TypeScript |
| Realtime | Socket.IO |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Session State | Redis (ioredis) |
| ORM/ODM | Mongoose |
| Queue | Bull (Redis-backed) |

### AI/ML Services
| Service | Technology |
|---|---|
| Language | Python 3.11 |
| API Framework | FastAPI |
| Vision | OpenCV + MediaPipe |
| Multi-person | YOLOv8 (ultralytics) |
| Audio/VAD | WebRTC VAD + pyannote.audio |
| NLP | sentence-transformers + Transformers |
| LLM (mock) | Claude API (Anthropic) or OpenAI |

### Database & Storage
| Layer | Technology |
|---|---|
| Primary DB | MongoDB Atlas |
| Cache | Redis 7 |
| Object Storage | AWS S3 / Cloudflare R2 |
| Search | MongoDB Atlas Search (optional) |

### DevOps
| Layer | Technology |
|---|---|
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Deployment | Railway / Render / AWS |
| Monitoring | Sentry (errors) + Datadog (metrics) |
| Secrets | Environment variables + dotenv |

---

## 4. System Components Breakdown

### 4.1 Frontend — Key Responsibilities
- Authentication UI (login, register, invite link)
- Interview session UI (video feeds, prompts, timers)
- Live integrity alerts panel (real-time WebSocket events)
- Report dashboard (charts, flags, trust score)
- Candidate practice interface (AI interviewer, coaching overlay)

### 4.2 Backend — Core Services

**Auth Service**
- POST /api/auth/register — create account
- POST /api/auth/login — issue JWT
- POST /api/auth/refresh — refresh token
- GET /api/auth/me — current user

**Interview Orchestrator**
- Creates, manages, and terminates interview sessions
- Routes AV frames from frontend to AI services
- Aggregates AI events and emits to Socket.IO channel
- Triggers report generation on session end

**Proctoring Event Processor**
- Receives raw events from AI services
- Applies severity scoring and deduplication
- Writes events to MongoDB
- Emits high-severity events immediately to recruiter UI

**Report Generator**
- Triggered on session end
- Aggregates all events for session
- Runs Trust Score algorithm
- Writes structured report to MongoDB
- Optionally generates PDF via Puppeteer

### 4.3 AI/ML Microservices

**Vision Service** — `/vision/analyze`
- Input: base64-encoded frame + session_id
- Output: { face_present, face_count, gaze_direction, confidence }
- Models: MediaPipe Face Detection + Gaze Estimation

**Audio Service** — `/audio/analyze`
- Input: audio chunk (PCM/WAV) + session_id
- Output: { speech_detected, speaker_count, confidence_score, hesitation_score }
- Models: WebRTC VAD + pyannote.audio diarization

**NLP Service** — `/nlp/analyze`
- Input: transcript text + session_id + question
- Output: { quality_score, ai_likelihood, clarity_score, relevance_score }
- Models: sentence-transformers, perplexity heuristics, Claude API

**Behavior Scoring Engine** — `/behavior/score`
- Input: session_id + aggregated signals
- Output: { integrity_score, performance_score, risk_level, flag_summary }
- Logic: Weighted combination of vision + audio + NLP signals

---

## 5. Data Flow

### Phase 1 — Recruiter Live Interview

```
Recruiter creates session
        ↓
Candidate joins via invite link
        ↓
System check (camera, mic, browser) → Consent given
        ↓
WebRTC AV stream starts (candidate ↔ recruiter)
        ↓
Frontend samples frames (3fps) → sends to Vision Service
Frontend chunks audio (1.5s) → sends to Audio Service
Browser events (tab switch, focus) → WebSocket to Orchestrator
        ↓
AI Services return scored events
        ↓
Orchestrator: writes events to DB + emits alerts via Socket.IO
        ↓
Recruiter UI shows real-time integrity panel
        ↓
Session ends → Report Generator runs → Trust Score computed
        ↓
Recruiter receives structured report
```

### Phase 2 — Candidate Mock Interview

```
Candidate selects role/type
        ↓
Question bank loaded (role-specific)
        ↓
AI Interviewer asks Q1 via TTS or text
        ↓
Candidate responds (video + audio captured)
        ↓
Audio → transcript (Whisper / browser STT)
Transcript → NLP Service (quality, clarity, relevance)
AV → Vision + Audio Services (behavioral signals)
        ↓
Per-question score computed
        ↓
AI follow-up generated (LLM) or next question served
        ↓
Session ends → Aggregated feedback report generated
```

---

## 6. API Design

### REST Endpoints

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

# Interviews (Recruiter)
POST   /api/interviews                    # create interview
GET    /api/interviews                    # list (recruiter's)
GET    /api/interviews/:id
POST   /api/interviews/:id/start
POST   /api/interviews/:id/end
POST   /api/interviews/:id/invite         # send invite email
GET    /api/interviews/:id/report

# Sessions
POST   /api/sessions/:id/join             # candidate joins
GET    /api/sessions/:id/events           # flag log
POST   /api/sessions/:id/frame            # frame upload
POST   /api/sessions/:id/audio            # audio chunk upload

# Mock Interviews (Candidate)
POST   /api/mock/start                    # start mock session
GET    /api/mock/:id/question             # get next question
POST   /api/mock/:id/response             # submit answer
GET    /api/mock/:id/feedback             # post-session feedback
GET    /api/mock/history                  # past sessions

# Reports
GET    /api/reports/:id                   # full report
GET    /api/reports/:id/export            # PDF export
```

### WebSocket Events

```
# Client → Server
interview:join           { sessionId, userId, role }
interview:frame          { sessionId, frameData }
interview:audio          { sessionId, audioChunk }
interview:event          { sessionId, type, payload }  // tab switch etc

# Server → Client (Recruiter)
proctor:flag             { sessionId, type, severity, timestamp }
proctor:score_update     { sessionId, integrity_score, performance_score }
proctor:alert            { sessionId, message, level }

# Server → Client (Candidate)
mock:question            { sessionId, questionId, text, type }
mock:coaching            { sessionId, confidence, pacing, suggestion }
```

---

## 7. Security Architecture

**Authentication**
- JWT access tokens (15 min expiry) + refresh tokens (7 days)
- Tokens stored in httpOnly cookies (not localStorage)
- Role-based middleware on all protected routes

**Data Security**
- TLS 1.3 for all client-server traffic
- AES-256 encryption for PII at rest
- Signed upload URLs for media (S3 presigned URLs)
- CORS configured to allowed origins only

**Session Security**
- Invite links: time-limited (24h), single-use tokens
- Interview sessions: candidate can only access their own session
- Recruiter can only access interviews they created

**Audit**
- All recruiter actions logged to audit_logs collection
- Flag events immutable once written
- Admin-only access to raw event logs

---

## 8. Performance Requirements

| Operation | Target Latency |
|---|---|
| Auth API calls | < 100ms |
| Interview CRUD APIs | < 200ms |
| Frame upload + AI response | < 500ms |
| Audio chunk AI response | < 800ms |
| WebSocket alert delivery | < 200ms |
| Report generation | < 5 seconds |
| PDF export | < 10 seconds |

---

## 9. Scalability Considerations

- Stateless Express API: horizontally scalable behind load balancer
- AI services independently scalable via Docker replicas
- Redis pub/sub decouples WebSocket layer from AI processing
- Bull queue absorbs traffic spikes for frame/audio processing
- MongoDB Atlas auto-scaling for storage

---

## 10. Error Handling Strategy

**Frontend**
- Global error boundary in React
- Toast notifications for user-facing errors
- Retry logic for WebSocket disconnects (exponential backoff)

**Backend**
- Centralized Express error handler middleware
- All AI service calls wrapped in try/catch with fallback
- Dead letter queue for failed processing jobs

**AI Services**
- FastAPI exception handlers return structured error responses
- Graceful degradation: if vision service fails, flag as "monitoring unavailable" — don't crash session

---

## 11. Third-Party Integrations

| Service | Purpose |
|---|---|
| Anthropic Claude API | Mock interview question generation + NLP analysis |
| OpenAI Whisper | Speech-to-text transcription |
| SendGrid | Email invites and notifications |
| AWS S3 / Cloudflare R2 | Media and snapshot storage |
| Sentry | Error tracking |
| Socket.IO | WebSocket management |

---

## 12. Deployment Architecture

```
GitHub Repo
    │
    ├── GitHub Actions CI (lint, typecheck, test)
    │
    ├── Frontend → Vercel (Next.js)
    │
    ├── Backend API → Railway / Render (Node.js Docker)
    │
    ├── AI Services → Railway / Render (Python Docker ×4)
    │
    ├── MongoDB → Atlas Shared Cluster (M0 free tier for hackathon)
    │
    └── Redis → Railway plugin / Upstash
```

---

## 13. Assumptions & Limitations

- Hackathon scope: demo-grade AI accuracy; models not fine-tuned on interview data
- Requires modern browsers with WebRTC support
- AI-answer detection is heuristic-based (perplexity, pattern matching)
- Some detections will have false positives at MVP stage
- WebRTC direct P2P used (no SFU/TURN server for hackathon)
- No actual video recording stored (frames only for analysis)
