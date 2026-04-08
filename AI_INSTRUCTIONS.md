# Neeti AI — AI Instructions & System Prompts

**For Claude Code use — defines all AI agent behavior, prompts, and logic**

---

## 1. Overview of AI Roles in Neeti AI

| AI Component | What It Does | Technology |
|---|---|---|
| Vision Analyzer | Face detection, gaze tracking, multi-person detection | OpenCV + MediaPipe + YOLOv8 |
| Audio Analyzer | Voice activity, speaker count, confidence/hesitation | WebRTC VAD + pyannote |
| NLP Evaluator | Response quality, AI-likeness, clarity, relevance | Claude API + sentence-transformers |
| Behavior Scorer | Fuses all signals into integrity + performance scores | Custom weighted algorithm |
| Mock Interviewer | Asks questions, generates follow-ups, adapts to candidate | Claude API |
| Feedback Generator | Per-question + session-level improvement feedback | Claude API |

---

## 2. Vision Service — Detection Logic

### 2.1 Face Detection Pipeline

```python
# ai-services/vision/models/face_detector.py

import cv2
import mediapipe as mp
import numpy as np

class FaceDetector:
    def __init__(self):
        self.mp_face = mp.solutions.face_detection
        self.detector = self.mp_face.FaceDetection(
            model_selection=1,        # 1 = full range model (better for webcam)
            min_detection_confidence=0.6
        )
    
    def analyze(self, frame_base64: str) -> dict:
        # Decode frame
        img_bytes = base64.b64decode(frame_base64)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        results = self.detector.process(frame_rgb)
        
        face_count = 0
        if results.detections:
            face_count = len(results.detections)
        
        return {
            "face_present": face_count > 0,
            "face_count": face_count,
            "confidence": results.detections[0].score[0] if face_count > 0 else 0
        }
```

### 2.2 Gaze Estimation Logic

```python
# ai-services/vision/models/gaze_estimator.py

class GazeEstimator:
    """
    Uses face landmark positions to estimate gaze direction.
    Simplified approach: iris position relative to eye bounding box.
    Direction: 'center', 'left', 'right', 'up', 'down', 'away'
    """
    
    AWAY_THRESHOLD = 0.35    # If gaze is >35% off-center, flag as 'away'
    
    def estimate(self, frame_rgb, face_landmarks) -> str:
        # Get eye landmarks via MediaPipe Face Mesh
        # Calculate iris-to-eyebox ratio
        # Return direction string
        ...
        return gaze_direction  # 'center' | 'left' | 'right' | 'up' | 'down'
```

### 2.3 Flag Thresholds

```python
# Configurable thresholds
VISION_THRESHOLDS = {
    "no_face_duration_seconds": 3,      # Flag after 3s of no face
    "gaze_away_duration_seconds": 5,    # Flag after 5s of looking away
    "multiple_faces_immediate": True,   # Flag immediately on detection
    "face_confidence_min": 0.6          # Ignore detections below this
}
```

---

## 3. Audio Service — Detection Logic

### 3.1 Voice Activity Detection

```python
# ai-services/audio/models/vad.py

import webrtcvad
import struct

class VoiceActivityDetector:
    def __init__(self, aggressiveness: int = 2):
        # aggressiveness: 0 (least aggressive) to 3 (most aggressive)
        self.vad = webrtcvad.Vad(aggressiveness)
        self.frame_duration_ms = 30    # 10, 20, or 30 ms frames
        self.sample_rate = 16000
    
    def is_speech(self, audio_chunk: bytes) -> bool:
        # Convert to 16-bit PCM if needed
        # Split into 30ms frames
        # Return True if majority of frames contain speech
        ...
```

### 3.2 Speaker Diarization (Multiple Speaker Detection)

```python
# ai-services/audio/models/diarizer.py
from pyannote.audio import Pipeline

class SpeakerDiarizer:
    def __init__(self):
        self.pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=os.getenv("HF_TOKEN")
        )
    
    def count_speakers(self, audio_path: str) -> int:
        diarization = self.pipeline(audio_path)
        speakers = set()
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            speakers.add(speaker)
        return len(speakers)
    
    # Returns: 1 = single speaker (OK), 2+ = flag MULTIPLE_SPEAKERS
```

### 3.3 Confidence & Hesitation Scoring

```python
# Heuristic-based scoring from audio features
# confidence_score: 0.0 to 1.0
# hesitation_score: 0.0 to 1.0 (higher = more hesitant)

HESITATION_MARKERS = ["um", "uh", "er", "hmm", "like", "you know"]

def score_confidence(transcript: str, speech_rate: float, pause_count: int) -> float:
    """
    speech_rate: words per minute (normal: 120-180 wpm)
    pause_count: number of pauses > 1 second
    """
    base_score = 1.0
    
    # Penalize for hesitation markers
    hesitation_count = sum(transcript.lower().count(m) for m in HESITATION_MARKERS)
    base_score -= (hesitation_count * 0.05)
    
    # Penalize for very slow speech (< 80 wpm = hesitant)
    if speech_rate < 80:
        base_score -= 0.2
    
    # Penalize for excessive pauses
    base_score -= (pause_count * 0.03)
    
    return max(0.0, min(1.0, base_score))
```

---

## 4. NLP Service — Claude API Integration

### 4.1 Response Quality Evaluation

```python
# ai-services/nlp/prompts/quality_eval.txt
QUALITY_EVAL_SYSTEM_PROMPT = """
You are an expert technical interview evaluator. Your job is to assess candidate responses to interview questions.

Evaluate the response on these dimensions, each scored 0-10:
- quality: Overall quality, depth, and accuracy of the answer
- clarity: How clearly and concisely the candidate communicated
- relevance: How directly the response addressed the question
- technical_accuracy: Correctness of technical claims (if applicable)

Also provide:
- ai_likelihood: 0.0 to 1.0 score for likelihood the response was AI-generated
  (Look for: overly structured lists, unnaturally formal phrasing, perfect grammar with no hesitation markers, 
   textbook-perfect explanations without personal experience)
- weak_areas: Array of 2-3 specific weaknesses
- suggestions: Array of 2-3 actionable improvement suggestions

Respond ONLY with valid JSON in this exact format:
{
  "scores": {
    "quality": <0-10>,
    "clarity": <0-10>,
    "relevance": <0-10>,
    "technical_accuracy": <0-10>
  },
  "ai_likelihood": <0.0-1.0>,
  "weak_areas": ["...", "..."],
  "suggestions": ["...", "..."],
  "brief_feedback": "<2-3 sentence summary>"
}
"""

def evaluate_response(question: str, response: str, role: str) -> dict:
    user_prompt = f"""
Role being interviewed for: {role}

Interview Question:
{question}

Candidate's Response:
{response}

Evaluate this response.
"""
    
    result = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=QUALITY_EVAL_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}]
    )
    
    return json.loads(result.content[0].text)
```

### 4.2 Follow-up Question Generation

```python
FOLLOWUP_SYSTEM_PROMPT = """
You are an AI technical interviewer. Based on the candidate's response to an interview question, 
generate ONE natural follow-up question that:
1. Digs deeper into what they said
2. Tests their actual understanding (not just surface knowledge)
3. Is conversational, not robotic
4. Is appropriate for the {role} role at {difficulty} difficulty

If their answer was very complete and nothing meaningful to follow up on, respond with: "SKIP"

Respond with ONLY the follow-up question text, nothing else.
"""

def generate_followup(question: str, response: str, role: str, difficulty: str) -> str | None:
    result = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=200,
        system=FOLLOWUP_SYSTEM_PROMPT.format(role=role, difficulty=difficulty),
        messages=[{
            "role": "user", 
            "content": f"Question asked: {question}\n\nCandidate said: {response}"
        }]
    )
    
    text = result.content[0].text.strip()
    return None if text == "SKIP" else text
```

---

## 5. Behavior Scoring Engine

### 5.1 Trust Score Algorithm

```python
# ai-services/behavior/scorer.py

class BehaviorScorer:
    
    # Severity weights for integrity score deduction
    FLAG_WEIGHTS = {
        "NO_FACE": {"low": 2, "medium": 5, "high": 10, "critical": 20},
        "MULTIPLE_FACES": {"critical": 25},
        "GAZE_AWAY": {"low": 1, "medium": 3, "high": 7},
        "FRAME_EXIT": {"medium": 5, "high": 10},
        "TAB_SWITCH": {"high": 15, "critical": 25},
        "WINDOW_BLUR": {"medium": 8},
        "MULTIPLE_SPEAKERS": {"high": 15, "critical": 30},
        "AI_ANSWER_LIKELY": {"high": 20, "critical": 35},
    }
    
    def compute_integrity_score(self, events: list[dict]) -> float:
        """
        Starts at 100. Deductions applied per flag.
        Same flag type can deduct max 3 times (dedup).
        Returns: 0-100
        """
        score = 100.0
        flag_counts = {}
        
        for event in events:
            flag_type = event["type"]
            severity = event["severity"]
            
            # Max 3 deductions per flag type
            if flag_counts.get(flag_type, 0) >= 3:
                continue
            
            deduction = self.FLAG_WEIGHTS.get(flag_type, {}).get(severity, 0)
            score -= deduction
            flag_counts[flag_type] = flag_counts.get(flag_type, 0) + 1
        
        return max(0.0, score)
    
    def compute_performance_score(self, responses: list[dict]) -> float:
        """
        Average of NLP response scores across all questions.
        Weights: quality (40%), clarity (25%), relevance (25%), confidence (10%)
        Returns: 0-100
        """
        if not responses:
            return 0.0
        
        total = 0.0
        for r in responses:
            s = r.get("scores", {})
            weighted = (
                s.get("quality", 5) * 0.40 +
                s.get("clarity", 5) * 0.25 +
                s.get("relevance", 5) * 0.25 +
                r.get("behavioralSignals", {}).get("avgConfidence", 5) * 0.10
            )
            total += (weighted / 10) * 100  # normalize to 0-100
        
        return total / len(responses)
    
    def compute_trust_score(self, integrity: float, performance: float) -> float:
        """
        Trust = (integrity * 0.6) + (performance * 0.4)
        """
        return round((integrity * 0.6) + (performance * 0.4), 1)
    
    def get_risk_level(self, trust_score: float, events: list[dict]) -> str:
        # Critical flags override score-based risk
        critical_flags = [e for e in events if e["severity"] == "critical"]
        if len(critical_flags) >= 2:
            return "critical"
        
        if trust_score >= 80:
            return "low"
        elif trust_score >= 60:
            return "medium"
        elif trust_score >= 40:
            return "high"
        else:
            return "critical"
```

---

## 6. Mock Interview AI Agent

### 6.1 AI Interviewer System Prompt

```
MOCK_INTERVIEWER_SYSTEM_PROMPT = """
You are Neeti, an AI technical interviewer. You are conducting a mock interview 
for a {role} position at {difficulty} level.

Your personality:
- Professional but friendly and encouraging
- Genuinely curious about the candidate's thinking process
- Ask follow-up questions that reveal depth of understanding
- Don't give hints or correct the candidate during the interview
- Sound human — not robotic or perfectly formal

Interview style:
- Start with a brief welcome and set expectations
- Ask questions one at a time
- After each response, either ask a follow-up OR move to the next question
- Don't overwhelm with multiple questions at once
- End with 2-3 sentences of general encouragement (NOT detailed feedback — that comes separately)

Current interview context:
- Role: {role}
- Difficulty: {difficulty}
- Question {current_q} of {total_q}
- Previous questions asked: {previous_questions}

Respond ONLY with what you (Neeti) would say. No meta-commentary.
"""
```

### 6.2 Session-Level Feedback Generation

```python
SESSION_FEEDBACK_SYSTEM_PROMPT = """
You are an expert career coach and technical interviewer. 
Analyze this mock interview session and provide comprehensive, actionable feedback.

Structure your response as valid JSON:
{
  "overall_assessment": "<3-4 sentence summary of the candidate's performance>",
  "strengths": [
    { "area": "<strength name>", "detail": "<specific evidence from the interview>" },
    ...
  ],
  "improvement_areas": [
    { 
      "area": "<weakness name>", 
      "detail": "<what was observed>", 
      "action": "<specific, concrete improvement action>" 
    },
    ...
  ],
  "score_breakdown": {
    "technical_knowledge": <0-10>,
    "communication": <0-10>,
    "problem_solving": <0-10>,
    "confidence": <0-10>
  },
  "recommended_resources": [
    "<specific resource, topic, or practice recommendation>",
    ...
  ],
  "next_steps": "<2-3 sentence action plan for the candidate>"
}

Be specific, honest, and constructive. Reference actual responses where possible.
Do NOT be generically positive — identify real gaps.
"""

def generate_session_feedback(session_data: dict) -> dict:
    """
    session_data = {
        role, difficulty, 
        responses: [{ question, response, scores, feedback }],
        behavioral_summary: { avg_confidence, hesitation_events, gaze_away_count }
    }
    """
    user_content = f"""
Role: {session_data['role']} ({session_data['difficulty']})

Interview Q&A:
{format_qa_for_prompt(session_data['responses'])}

Behavioral observations:
- Average confidence score: {session_data['behavioral_summary']['avg_confidence']:.1f}/10
- Hesitation events detected: {session_data['behavioral_summary']['hesitation_events']}
- Gaze away events: {session_data['behavioral_summary']['gaze_away_count']}

Generate comprehensive session feedback.
"""
    
    result = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SESSION_FEEDBACK_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}]
    )
    
    return json.loads(result.content[0].text)
```

---

## 7. Report AI Summary

```python
REPORT_SUMMARY_SYSTEM_PROMPT = """
You are an AI assistant generating a professional interview integrity report for a recruiter.

Based on the session data provided, write a concise 3-4 paragraph assessment covering:
1. Overall integrity assessment (was the interview authentic?)
2. Key behavioral observations (what stood out positively or negatively?)
3. Performance summary (how did the candidate perform on substance?)
4. Recommendation context (what factors should weigh on the hiring decision?)

Tone: Professional, objective, data-driven. Avoid sensationalism. 
Be specific about what was observed, not interpretive.
Keep total length under 300 words.
"""

def generate_report_summary(report_data: dict) -> str:
    user_content = f"""
Trust Score: {report_data['trustScore']}/100
Risk Level: {report_data['riskLevel']}
Integrity Score: {report_data['integrityScore']}/100
Performance Score: {report_data['performanceScore']}/100

Flag Summary:
{format_flags(report_data['flagSummary'])}

Session Duration: {report_data['sessionDuration']} minutes
Role: {report_data['interviewRole']}
"""
    
    result = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        system=REPORT_SUMMARY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}]
    )
    
    return result.content[0].text
```

---

## 8. AI Error Handling & Fallbacks

All AI service calls must implement graceful degradation:

```python
async def safe_evaluate_response(question: str, response: str, role: str) -> dict:
    """Fallback to neutral scores if Claude API fails"""
    try:
        return await evaluate_response(question, response, role)
    except Exception as e:
        logger.error(f"NLP evaluation failed: {e}")
        return {
            "scores": {"quality": 5, "clarity": 5, "relevance": 5, "technical_accuracy": 5},
            "ai_likelihood": 0.0,
            "weak_areas": [],
            "suggestions": [],
            "brief_feedback": "Evaluation unavailable for this response.",
            "_fallback": True
        }
```

**Fallback rules:**
- Vision service failure → mark session as "monitoring_limited", don't terminate
- Audio service failure → skip speaker diarization, continue with basic VAD
- NLP service failure → use neutral scores (5/10), mark response as "unscored"
- Behavior scoring failure → don't generate report, alert recruiter
- Claude API rate limit → queue for retry with exponential backoff (max 3 retries)

---

## 9. Claude Code Implementation Notes

When implementing AI services with Claude Code:

1. **Start with mock responses** for all AI services during frontend development to avoid API costs
2. **Use Pydantic v2** for all FastAPI request/response models
3. **Cache Claude API calls** where possible (e.g., follow-up questions for same question+response hash)
4. **Log all AI inputs and outputs** (sanitized) for debugging during hackathon
5. **MediaPipe models** download on first run — ensure Docker containers have internet access
6. **pyannote models** require HuggingFace token and model download — do this in Dockerfile
7. **Test vision service** with a static test image before integrating with live video
