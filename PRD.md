# Neeti AI — Product Requirements Document (PRD)

**Version:** 2.0  
**Status:** Active Development  
**Last Updated:** April 2026  
**Project Type:** Hackathon MVP → SaaS Product

---

## 1. Executive Summary

Neeti AI is an **AI-powered interview integrity and preparation platform** that eliminates cheating, bias, and opacity from the modern hiring process. By fusing real-time computer vision, audio intelligence, and NLP-based behavioral analysis, Neeti AI gives recruiters verifiable trust signals and gives candidates a fair, feedback-rich interview experience.

The platform operates across two tightly coupled phases:
- **Phase 1 — Recruiter Platform:** Live interview rooms with AI proctoring, behavioral scoring, and instant integrity alerts.
- **Phase 2 — Candidate Practice Platform:** AI-driven mock interviews with coaching signals and improvement feedback.

---

## 2. Problem Statement

The modern hiring pipeline is fundamentally broken across four vectors:

| Problem | Impact |
|---|---|
| Cheating & proxy interviews in remote settings | Unqualified candidates enter pipelines; company resources wasted |
| Gut-feel evaluations without behavioral data | Biased, inconsistent shortlisting; deserving talent missed |
| Zero transparency for candidates | Poor candidate experience; employer brand damage |
| No standardized integrity layer | Trust collapse between recruiters and remote candidates |

---

## 3. Goals & Success Criteria

**Primary Goals**
- Ensure interview authenticity through AI-assisted monitoring and risk flagging
- Increase evaluation fairness with structured, data-driven reports
- Improve candidate readiness through realistic mock interviews
- Ship a polished, demo-ready hackathon MVP

**MVP Success Metrics**
- Integrity flag detection latency: < 2 seconds
- Trust score generated per interview: 100% coverage
- Candidate mock session completion rate: > 70%
- Face/gaze detection accuracy: > 85% on standard webcam

---

## 4. Target Users & Personas

### Persona 1 — Recruiter / Hiring Manager
- Conducts 10–30 remote interviews/week
- Pain: Can't verify candidate authenticity; reports are manual
- Key Need: Real-time alerts + post-interview report with trust score

### Persona 2 — HR Team / Talent Ops
- Manages hiring pipeline at scale (50+ requisitions)
- Pain: No audit trail; inconsistent evaluations across interviewers
- Key Need: Dashboard-level analytics; audit logs

### Persona 3 — Candidate / Student
- Preparing for placements or job interviews
- Pain: No realistic practice environment with feedback
- Key Need: Safe mock interview with real, actionable feedback

### Persona 4 — Institution / Campus Placement Cell
- Manages placement drives for 100–1000+ students
- Pain: Manual invigilation doesn't scale
- Key Need: Batch session management + per-student integrity reports

---

## 5. Core Feature Suite

### Phase 1 — Recruiter Platform

**5.1 Live Interview Room**
- WebRTC-based video/audio session between recruiter and candidate
- Side-by-side view: candidate feed + AI signals panel
- Session timer, question prompts, recruiter notes
- One-click session start/end with auto-report generation

**5.2 Real-Time Proctoring Engine**
- Face detection: presence, identity consistency
- Gaze tracking: is the candidate looking at the screen?
- Multi-person detection: someone else visible?
- Frame exit detection: candidate left camera frame
- Tab/screen switch detection via browser Visibility API

**5.3 Behavioral Intelligence Module**
- Voice tone analysis (confident, hesitant, stressed)
- Response timing & hesitation detection
- Engagement level scoring
- Real-time confidence score overlay for recruiter

**5.4 Integrity Flagging System**
- Automated flag creation with timestamp, type, severity
- Live alert pop-up on recruiter dashboard
- Flag log accessible during and after session
- Severity tiers: Low / Medium / High / Critical

**5.5 Structured Evaluation Report**
- Auto-generated post-interview report (web + PDF export)
- Trust Score (0–100): weighted integrity + behavioral metrics
- Timestamped highlight log of flagged moments
- Recruiter editable notes + final recommendation field

**5.6 Recruiter Dashboard**
- All interviews list with status, date, candidate name
- Trust score distribution across candidates
- Quick filters: high-risk, completed, pending
- Interview creation and candidate invite flow

---

### Phase 2 — Candidate Practice Platform

**5.7 AI Mock Interview**
- Role-based question sets (SWE, PM, Data, Design, General HR)
- AI interviewer with contextual follow-up questions
- Real-time coaching signals: confidence, clarity, pacing
- Strict monitoring mode (mirrors real interview conditions)

**5.8 Post-Session Feedback**
- Per-question score breakdown
- Identified weak areas (technical, communication, confidence)
- Actionable improvement suggestions
- Trend comparison vs previous sessions

**5.9 Practice Analytics Dashboard**
- Session history with scores
- Weak area heatmap
- Recommended drills and practice exercises
- Progress tracking over time

---

## 6. User Flows

### Recruiter Flow
```
Login → Dashboard → Create Interview → Set Role/JD →
Invite Candidate (email link) → Activate AI Agent →
Live Interview Begins → Real-time Alerts Visible →
End Session → Auto-Report Generated → Review & Decide
```

### Candidate — Live Interview Flow
```
Receive Invite Link → Login / Register → System Check
(camera, mic, browser) → Join Interview Room →
Interview Proceeds (monitored) → Session Ends →
Candidate sees basic feedback summary
```

### Candidate — Practice Flow
```
Login → Select Role / Skill → Start Mock Interview →
AI Asks Questions → Candidate Responds →
Real-Time Coaching Visible → Session Ends →
Detailed Feedback Report → Dashboard Updated
```

---

## 7. Functional Requirements

**Authentication & Access**
- Email/password + OAuth (Google) login
- Role-based access: Recruiter, Candidate, Admin
- JWT-based session management
- Secure invite link generation for candidates

**Interview Session**
- WebRTC peer-to-peer or SFU-based AV
- Parallel WebSocket stream for AI signals
- Frame sampling (2–5 fps) for vision tasks
- Audio chunking (1–2 sec windows) for speech analysis
- Tab visibility API for switch detection

**Proctoring & Analysis**
- Face detection on every sampled frame
- Gaze estimation (looking away = flag)
- Multiple face detection trigger
- Speech activity detection + speaker diarization
- Response NLP analysis (quality, AI-likeness score)

**Reporting**
- Auto-generate report on session end
- Trust score calculation (weighted algorithm)
- Exportable PDF report
- Persistent storage, retrievable from dashboard

**Mock Interview**
- Predefined question banks per role
- LLM-based follow-up question generation
- Response evaluation: NLP quality + behavioral signals
- Feedback generation per response + session summary

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Alert latency | < 2 seconds end-to-end |
| Vision inference | < 250ms per frame |
| Audio inference | < 500ms per chunk |
| API response time (p95) | < 300ms |
| Concurrent sessions (MVP) | 20+ |
| Uptime | 99% during interview windows |
| Data encryption | TLS in transit, AES-256 at rest |
| Browser support | Chrome 90+, Firefox 90+, Edge 90+ |

---

## 9. UI/UX Requirements

- Dark-first design system throughout
- Real-time signal overlays must be non-intrusive (sidebar panel)
- Alert notifications: toast + persistent flag log
- Mobile: responsive for candidate practice (not live interview)
- Loading states for all AI inference operations
- Consent modal before any monitoring begins

---

## 10. Privacy & Compliance

- Explicit candidate consent before session starts
- Recording toggle: opt-in only
- Auto-delete after configurable retention period
- GDPR-compatible data handling
- PII fields encrypted at rest (name, email, resume URL)

---

## 11. Pages / Screen Inventory

| Page | Access |
|---|---|
| Landing / Marketing | Public |
| Login / Register | Public |
| Recruiter Dashboard | Recruiter |
| Create Interview | Recruiter |
| Live Interview Room | Recruiter + Candidate |
| Post-Interview Report | Recruiter |
| Candidate Dashboard | Candidate |
| Practice Interview | Candidate |
| Mock Feedback Report | Candidate |
| Admin Analytics | Admin |

---

## 12. Out of Scope (Hackathon MVP)

- Mobile native apps
- ATS integrations (LinkedIn, Naukri, Greenhouse)
- Video recording storage and playback
- Multilingual interview support
- Custom enterprise SSO

---

## 13. Future Roadmap

| Feature | Phase |
|---|---|
| Adaptive AI question generation per profile | v1.1 |
| Emotion + stress detection | v1.2 |
| Job portal integrations | v1.3 |
| Multi-language support | v1.4 |
| Enterprise compliance + bias audit | v2.0 |

---

## 14. Assumptions & Constraints

- MVP is web-only, browser-based
- Candidate must have working webcam and microphone
- AI detection models are lightweight for real-time use
- AI-generated answer detection is heuristic-based at MVP stage
- Hackathon timeline does not allow full production hardening
