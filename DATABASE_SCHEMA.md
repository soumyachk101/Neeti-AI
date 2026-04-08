# Neeti AI — Database Schema

**Database:** MongoDB Atlas  
**ODM:** Mongoose  
**Cache Layer:** Redis 7

---

## 1. Collections Overview

| Collection | Purpose |
|---|---|
| `users` | All platform users (recruiter, candidate, admin) |
| `interviews` | Recruiter-created interview sessions |
| `sessions` | Candidate's participation in an interview |
| `proctoring_events` | Real-time flags/alerts during a session |
| `reports` | Final evaluation report per session |
| `mock_sessions` | Candidate practice interview instances |
| `mock_responses` | Per-question responses in a mock session |
| `question_banks` | Role-based question sets for mock interviews |
| `invite_tokens` | Temporary invite link tokens |
| `audit_logs` | Admin-level action trail |

---

## 2. Schema Definitions

### 2.1 Users

```typescript
// models/User.ts
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['recruiter', 'candidate', 'admin'], 
    required: true 
  },
  
  // Recruiter-specific
  company: { type: String },
  
  // Candidate-specific
  resumeUrl: { type: String },
  targetRole: { type: String },
  
  // Auth
  refreshToken: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  
  // Meta
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
}, { timestamps: true })

// Indexes
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ role: 1 })
```

---

### 2.2 Interviews

```typescript
// models/Interview.ts
const InterviewSchema = new Schema({
  recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  title: { type: String, required: true },
  role: { type: String, required: true },          // e.g. "Senior Frontend Engineer"
  jobDescription: { type: String },
  
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  scheduledAt: { type: Date },
  startedAt: { type: Date },
  endedAt: { type: Date },
  
  settings: {
    recordingEnabled: { type: Boolean, default: false },
    proctorEnabled: { type: Boolean, default: true },
    maxDuration: { type: Number, default: 60 },    // minutes
  },
  
  invitedCandidates: [{
    email: String,
    inviteToken: String,
    sentAt: Date,
    status: { type: String, enum: ['pending', 'joined', 'completed'] }
  }]
  
}, { timestamps: true })

InterviewSchema.index({ recruiterId: 1 })
InterviewSchema.index({ status: 1 })
InterviewSchema.index({ scheduledAt: -1 })
```

---

### 2.3 Sessions

```typescript
// models/Session.ts
const SessionSchema = new Schema({
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'abandoned'],
    default: 'waiting'
  },
  
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number },                      // seconds
  
  // Consent
  consentGiven: { type: Boolean, default: false },
  consentGivenAt: { type: Date },
  
  // System check results
  systemCheck: {
    cameraOk: { type: Boolean },
    micOk: { type: Boolean },
    browserOk: { type: Boolean },
    checkedAt: { type: Date }
  },
  
  // Live scores (updated in realtime)
  liveIntegrityScore: { type: Number, default: 100 },
  livePerformanceScore: { type: Number, default: 0 },
  
  // Recruiter notes
  recruiterNotes: { type: String }
  
}, { timestamps: true })

SessionSchema.index({ interviewId: 1 })
SessionSchema.index({ candidateId: 1 })
SessionSchema.index({ status: 1 })
```

---

### 2.4 Proctoring Events

```typescript
// models/ProctoringEvent.ts

// Flag type definitions
type FlagType = 
  | 'NO_FACE'           // Face not detected
  | 'MULTIPLE_FACES'    // More than one face
  | 'GAZE_AWAY'         // Looking away from screen
  | 'FRAME_EXIT'        // Candidate left camera frame
  | 'TAB_SWITCH'        // Browser tab switched
  | 'WINDOW_BLUR'       // Browser window lost focus
  | 'MULTIPLE_SPEAKERS' // More than one voice detected
  | 'LOW_CONFIDENCE'    // Confidence score dropped sharply
  | 'HIGH_HESITATION'   // Significant hesitation in response
  | 'AI_ANSWER_LIKELY'  // Response flagged as AI-generated

type Severity = 'low' | 'medium' | 'high' | 'critical'

const ProctoringEventSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  
  type: { type: String, enum: FlagTypes, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  
  // Contextual data
  payload: { type: Schema.Types.Mixed },
  // e.g. for MULTIPLE_FACES: { face_count: 2, confidence: 0.91 }
  // e.g. for AI_ANSWER_LIKELY: { ai_score: 0.87, question: 'explain recursion' }
  
  timestamp: { type: Date, default: Date.now },
  
  // For deduplication (don't spam same flag every frame)
  dedupKey: { type: String },                      // type + 10s window
  
}, { timestamps: false })

ProctoringEventSchema.index({ sessionId: 1 })
ProctoringEventSchema.index({ sessionId: 1, type: 1 })
ProctoringEventSchema.index({ sessionId: 1, timestamp: -1 })
ProctoringEventSchema.index({ dedupKey: 1, timestamp: -1 })
```

---

### 2.5 Reports

```typescript
// models/Report.ts
const ReportSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true, unique: true },
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Core scores
  integrityScore: { type: Number, min: 0, max: 100, required: true },
  performanceScore: { type: Number, min: 0, max: 100, required: true },
  trustScore: { type: Number, min: 0, max: 100, required: true },
  
  // Risk assessment
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  
  // Flag summary
  flagSummary: [{
    type: { type: String },
    severity: { type: String },
    count: { type: Number },
    firstOccurrence: { type: Date },
    lastOccurrence: { type: Date }
  }],
  
  // Notable moments (timestamped)
  highlights: [{
    timestamp: { type: Date },
    type: { type: String },
    description: { type: String },
    severity: { type: String }
  }],
  
  // AI-generated summary text
  aiSummary: { type: String },
  
  // Recruiter decision
  recruiterDecision: {
    recommendation: { type: String, enum: ['advance', 'reject', 'hold', 'pending'], default: 'pending' },
    notes: { type: String },
    decidedAt: { type: Date }
  },
  
  generatedAt: { type: Date, default: Date.now },
  pdfUrl: { type: String }                        // S3 URL of PDF export
  
}, { timestamps: true })

ReportSchema.index({ sessionId: 1 }, { unique: true })
ReportSchema.index({ interviewId: 1 })
ReportSchema.index({ candidateId: 1 })
```

---

### 2.6 Mock Sessions

```typescript
// models/MockSession.ts
const MockSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  type: { type: String, enum: ['technical', 'behavioral', 'hr', 'mixed'], required: true },
  role: { type: String, required: true },          // e.g. "Frontend Developer"
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'QuestionBank' }],
  currentQuestionIndex: { type: Number, default: 0 },
  
  // Session scores
  overallScore: { type: Number },
  confidenceScore: { type: Number },
  clarityScore: { type: Number },
  relevanceScore: { type: Number },
  
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  duration: { type: Number }                       // seconds
  
}, { timestamps: true })

MockSessionSchema.index({ userId: 1 })
MockSessionSchema.index({ userId: 1, createdAt: -1 })
```

---

### 2.7 Mock Responses

```typescript
// models/MockResponse.ts
const MockResponseSchema = new Schema({
  mockSessionId: { type: Schema.Types.ObjectId, ref: 'MockSession', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  questionId: { type: Schema.Types.ObjectId, ref: 'QuestionBank' },
  questionText: { type: String, required: true },
  
  // Candidate's answer
  responseText: { type: String },
  responseAudioUrl: { type: String },              // S3 URL (if recorded)
  responseDuration: { type: Number },              // seconds
  
  // AI evaluation
  scores: {
    quality: { type: Number, min: 0, max: 10 },
    clarity: { type: Number, min: 0, max: 10 },
    relevance: { type: Number, min: 0, max: 10 },
    confidence: { type: Number, min: 0, max: 10 },
    aiLikelihood: { type: Number, min: 0, max: 1 }  // 0 = human, 1 = AI
  },
  
  // Behavioral signals during response
  behavioralSignals: {
    hesitationCount: { type: Number, default: 0 },
    avgConfidence: { type: Number },
    gazeAway: { type: Boolean, default: false }
  },
  
  // Feedback
  feedback: { type: String },                      // AI-generated per-question feedback
  weakAreas: [{ type: String }],
  suggestions: [{ type: String }],
  
  answeredAt: { type: Date, default: Date.now }
  
}, { timestamps: true })

MockResponseSchema.index({ mockSessionId: 1 })
MockResponseSchema.index({ userId: 1 })
```

---

### 2.8 Question Banks

```typescript
// models/QuestionBank.ts
const QuestionBankSchema = new Schema({
  role: { type: String, required: true },           // "frontend", "backend", "pm", "hr"
  category: { type: String, enum: ['technical', 'behavioral', 'situational', 'hr'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  
  questionText: { type: String, required: true },
  expectedKeyPoints: [{ type: String }],           // Ideal answer components
  followUpQuestions: [{ type: String }],            // AI can use these
  
  tags: [{ type: String }],                         // e.g. ["react", "hooks", "state"]
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

QuestionBankSchema.index({ role: 1, difficulty: 1 })
QuestionBankSchema.index({ tags: 1 })
```

---

### 2.9 Invite Tokens

```typescript
// models/InviteToken.ts
// NOTE: Also stored in Redis (TTL-based). MongoDB copy for audit trail.
const InviteTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  candidateEmail: { type: String, required: true },
  
  status: { type: String, enum: ['pending', 'used', 'expired'], default: 'pending' },
  
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date }
}, { timestamps: true })

InviteTokenSchema.index({ token: 1 }, { unique: true })
InviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL index
```

---

### 2.10 Audit Logs

```typescript
// models/AuditLog.ts
const AuditLogSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  actorRole: { type: String, required: true },
  
  action: { type: String, required: true },
  // e.g. 'INTERVIEW_CREATED', 'INTERVIEW_ENDED', 'REPORT_VIEWED', 'USER_BANNED'
  
  resourceType: { type: String },
  resourceId: { type: Schema.Types.ObjectId },
  
  metadata: { type: Schema.Types.Mixed },
  
  ip: { type: String },
  userAgent: { type: String },
  
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false })

AuditLogSchema.index({ actorId: 1, timestamp: -1 })
AuditLogSchema.index({ action: 1 })
```

---

## 3. Redis Data Structures

### Session State (Live)
```
Key: session:{sessionId}:state
Type: Hash
Fields:
  status          → "active"
  startedAt       → ISO timestamp
  liveScore       → "87"
  flagCount       → "3"
TTL: 2 hours
```

### Active Connections
```
Key: session:{sessionId}:connections
Type: Set
Members: socketId:userId:role
TTL: 2 hours
```

### Invite Tokens
```
Key: invite:{token}
Type: String (JSON)
Value: { interviewId, candidateEmail, createdAt }
TTL: 86400 (24 hours)
```

### Deduplication Window (Flag Dedup)
```
Key: dedup:{sessionId}:{flagType}
Type: String
Value: "1"
TTL: 10 seconds
```
Purpose: Prevent flooding recruiter with same flag every frame

### Mock Session State
```
Key: mock:{sessionId}:current
Type: Hash
Fields:
  questionIndex   → "2"
  questionId      → ObjectId string
  askedAt         → ISO timestamp
TTL: 4 hours
```

---

## 4. Relationships Map

```
User (recruiter) ──1:N──> Interview
Interview ──1:N──> Session
Session ──1:1──> Report
Session ──1:N──> ProctoringEvent
Interview ──1:N──> InviteToken

User (candidate) ──1:N──> Session
User (candidate) ──1:N──> MockSession
MockSession ──1:N──> MockResponse
QuestionBank ──N:M──> MockSession (via questionIds array)
```

---

## 5. Data Retention Policy

| Collection | Retention |
|---|---|
| proctoring_events | 90 days post-session |
| sessions | 1 year |
| reports | 2 years |
| mock_sessions | 1 year |
| mock_responses | 1 year |
| audit_logs | 5 years |
| invite_tokens | 30 days after expiry |
| Redis keys | Per TTL (see above) |
