# Neeti AI — UI/UX System Design

**Design Philosophy:** Dark, editorial, data-rich. Every element earns its place.

---

## 1. Design Principles

**Clarity under pressure** — The live interview room is a high-stakes environment. UI must communicate critical information instantly without cognitive overload.

**Trust through transparency** — Scores and flags should feel like objective data, not accusations. Visual language should be clinical, not alarming.

**Progressive disclosure** — Show only what's needed at each moment. Complexity lives one layer deep.

**Performance-first** — No heavy animations during active sessions. Animation budget goes to landing page and transitions.

---

## 2. Color System

```css
:root {
  /* Base */
  --bg-primary: #0A0A0F;         /* Near-black background */
  --bg-secondary: #111118;       /* Card backgrounds */
  --bg-tertiary: #1A1A24;        /* Elevated surfaces */
  --bg-overlay: #0D0D14CC;       /* Modal overlays */
  
  /* Borders */
  --border-subtle: #1E1E2E;      /* Default borders */
  --border-medium: #2D2D42;      /* Active/hover borders */
  --border-strong: #4A4A6A;      /* Focused borders */
  
  /* Brand */
  --brand-primary: #6C63FF;      /* Primary purple */
  --brand-secondary: #8B83FF;    /* Lighter purple */
  --brand-glow: #6C63FF33;       /* Glow effect */
  
  /* Text */
  --text-primary: #F0F0FF;       /* Main text */
  --text-secondary: #A0A0C0;     /* Secondary text */
  --text-muted: #606080;         /* Placeholder/disabled */
  
  /* Semantic — Trust Score & Flags */
  --trust-high: #22C55E;         /* Score 80-100: Green */
  --trust-medium: #F59E0B;       /* Score 60-79: Amber */
  --trust-low: #EF4444;          /* Score 0-59: Red */
  
  /* Severity Colors */
  --severity-low: #64748B;       /* Slate */
  --severity-medium: #F59E0B;    /* Amber */
  --severity-high: #EF4444;      /* Red */
  --severity-critical: #DC2626;  /* Dark red with pulse animation */
  
  /* Data Visualization */
  --chart-1: #6C63FF;
  --chart-2: #22C55E;
  --chart-3: #F59E0B;
  --chart-4: #3B82F6;
  --chart-5: #EC4899;
}
```

---

## 3. Typography

```css
/* Font Stack */
--font-display: 'Inter', system-ui, sans-serif;    /* Headings, UI labels */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;  /* Code, scores, data */

/* Scale */
--text-xs: 0.75rem;     /* 12px — labels, badges */
--text-sm: 0.875rem;    /* 14px — secondary text */
--text-base: 1rem;      /* 16px — body text */
--text-lg: 1.125rem;    /* 18px — subheadings */
--text-xl: 1.25rem;     /* 20px — section headings */
--text-2xl: 1.5rem;     /* 24px — page headings */
--text-3xl: 1.875rem;   /* 30px — hero text */
--text-4xl: 2.25rem;    /* 36px — landing hero */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 4. Component Library

### 4.1 TrustScoreGauge

The centerpiece of the live interview UI. Shows integrity score as an animated arc gauge.

```tsx
// components/interview/TrustScoreGauge.tsx

interface TrustScoreGaugeProps {
  score: number           // 0-100
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean      // Animate on value change
  showLabel?: boolean
}

// Visual spec:
// - SVG arc gauge, 240° sweep
// - Color: green (80-100), amber (60-79), red (0-59)
// - Score number in center: --font-mono, bold
// - Label below: "Trust Score" in --text-secondary
// - Subtle glow ring matching score color
// - Smooth transition: 600ms ease on score change
```

**Tailwind classes used:**
```
bg-[#111118] rounded-2xl p-6 border border-[#1E1E2E]
text-4xl font-bold font-mono text-center
```

---

### 4.2 FlagAlert (Toast Notification)

```tsx
// components/interview/FlagAlert.tsx

interface FlagAlertProps {
  type: FlagType
  severity: Severity
  timestamp: Date
  onDismiss: () => void
}

// Visual spec:
// Position: top-right corner, stack downward
// Width: 320px
// Animation: slide in from right (300ms), auto-dismiss after 5s for LOW, persist for HIGH/CRITICAL
// 
// Severity styling:
//   LOW      → left border: --severity-low (slate)
//   MEDIUM   → left border: --severity-medium (amber)
//   HIGH     → left border: --severity-high (red)
//   CRITICAL → left border: --severity-critical + pulse animation on border
//
// Contents:
//   - Flag type icon (SVG)
//   - Flag label (e.g., "Multiple Faces Detected")
//   - Timestamp (relative: "Just now")
//   - Severity badge
//   - Dismiss button (×)
```

---

### 4.3 IntegrityPanel (Sidebar)

```
┌─────────────────────────┐
│  TRUST SCORE            │
│  [Gauge Component]      │
│                         │
│  INTEGRITY    87        │
│  PERFORMANCE  72        │
│                         │
│  ─ LIVE FLAGS ─         │
│  ○ No Face    14:32     │
│  ● Tab Switch 14:28     │
│  ● Gaze Away  14:19     │
│                         │
│  VIEW FULL LOG →        │
└─────────────────────────┘
```

- Fixed sidebar on right, 280px wide
- Scrollable flag log (max 5 visible, scroll for more)
- Flags sorted by recency
- Severity dot: color-coded (●)
- Score numbers: `--font-mono`

---

### 4.4 VideoFeed

```tsx
// components/interview/VideoFeed.tsx

// Visual spec:
// - 16:9 aspect ratio container
// - Rounded corners: 12px
// - Subtle border: 1px --border-subtle
// - 
// Overlays (non-intrusive):
//   - Bottom-left: candidate name badge (semi-transparent pill)
//   - Top-right: tiny indicator dots for face (green) and gaze (amber/green)
//   - NO text over the video itself — overlay UI lives outside the feed
// 
// States:
//   - Connecting: skeleton pulse with camera icon centered
//   - No permission: warning state with instructions
//   - Active: clean video with minimal overlays
```

---

### 4.5 CoachingOverlay (Mock Interview)

Real-time coaching signals shown to candidate during practice:

```
┌──────────────────────────────────────────┐
│  Confidence  ████████░░  8.2             │
│  Pacing      ██████░░░░  6.1  ← Slow     │
│  Clarity     █████████░  9.0             │
└──────────────────────────────────────────┘
```

- Collapsible panel (candidate can hide it)
- Updates every 3 seconds (debounced, not distracting)
- Progress bars with color coding (green/amber/red)
- Brief contextual hint when score is low (e.g., "Try to speak a bit faster")

---

### 4.6 Button System

```tsx
// Variants
<Button variant="primary">       // --brand-primary bg, white text
<Button variant="secondary">     // --bg-tertiary bg, --text-primary, border
<Button variant="ghost">         // transparent, --text-secondary, hover bg
<Button variant="danger">        // red bg, for destructive actions
<Button variant="success">       // green, for confirm/submit

// Sizes
<Button size="sm">   // h-8, text-sm, px-3
<Button size="md">   // h-10, text-base, px-4   (default)
<Button size="lg">   // h-12, text-lg, px-6

// States
<Button loading>     // spinner icon replaces text, disabled
<Button disabled>    // muted colors, cursor-not-allowed
```

---

### 4.7 Card Component

```tsx
// Base card: bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6
// Hover card: add hover:border-[#2D2D42] transition-colors
// Elevated card: bg-[#1A1A24] for nested cards
// Stats card: has prominent metric number + label + optional trend
```

---

### 4.8 Badge / Severity Badge

```tsx
// Severity badges
<Badge severity="low">      // bg-slate/20, text-slate, border-slate/30
<Badge severity="medium">   // bg-amber/20, text-amber, border-amber/30
<Badge severity="high">     // bg-red/20, text-red, border-red/30
<Badge severity="critical"> // bg-red/30, text-red, border-red, animate-pulse

// Risk level badges (same colors, different labels)
<Badge risk="low">Low Risk</Badge>
<Badge risk="medium">Medium Risk</Badge>
<Badge risk="high">High Risk</Badge>
<Badge risk="critical">Critical</Badge>
```

---

## 5. Page-by-Page Layout Specs

### 5.1 Landing Page

```
├── Navbar (logo left, nav links center, CTA right)
│
├── Hero Section
│   ├── Tag line: "Interview Integrity, Powered by AI"
│   ├── Sub: value prop 2 lines
│   ├── CTA: [Start Free] [See Demo]
│   └── 3D Globe / Abstract visualization (Three.js)
│
├── Problem → Solution Section
│   └── Before/After comparison cards
│
├── Feature Grid (3×2)
│   └── Each: icon + title + 2-line description
│
├── How It Works (3 steps)
│
├── Social Proof / Stats Bar
│
└── Footer
```

**Hero visual:** Dark background, floating abstract particles or network graph (Three.js). Purple accent glows. No stock photos.

---

### 5.2 Live Interview Room (Recruiter View)

```
┌──────────────────────────────────────────────┬──────────────────┐
│                                              │  INTEGRITY PANEL │
│  ┌──────────────────────────────────────┐   │                  │
│  │                                      │   │  Trust Score     │
│  │        CANDIDATE VIDEO FEED         │   │  [Gauge: 84]     │
│  │                                      │   │                  │
│  └──────────────────────────────────────┘   │  Integrity: 91   │
│                                              │  Performance: 73 │
│  ┌───────────────────────────────────────┐  │                  │
│  │  Question Panel                       │  │  ─ FLAGS ─       │
│  │  Q3: "Explain the event loop..."      │  │  ● Tab Switch    │
│  │  [Notes field]                        │  │  ○ Gaze Away     │
│  └───────────────────────────────────────┘  │                  │
│                                              │  [End Session]   │
│  [Timer: 24:32]    [Mute] [End Interview]   │                  │
└──────────────────────────────────────────────┴──────────────────┘
```

**Layout:** 2-column. Left: 75% (video + question panel). Right: 25% (integrity sidebar).

---

### 5.3 Report Page

```
├── Header Card
│   ├── Candidate name + role
│   ├── Interview date + duration
│   └── Trust Score (large, color-coded) + Risk Badge
│
├── Score Breakdown Row (3 cards)
│   ├── Integrity Score: 91/100 (green)
│   ├── Performance Score: 73/100 (amber)
│   └── Flags Triggered: 4 (Medium avg severity)
│
├── Flag Timeline (horizontal scrollable)
│   └── Each flag: dot on timeline + type + timestamp
│
├── Detailed Flag Log (table)
│   └── Type | Severity | Time | Details
│
├── AI-Generated Summary (prose block)
│
├── Recruiter Decision Panel
│   ├── [Advance] [Hold] [Reject] toggle
│   └── Notes textarea
│
└── Export PDF button
```

---

### 5.4 Candidate Dashboard

```
├── Header: "Welcome back, [Name]"
│
├── Stats Row (4 cards)
│   ├── Sessions Completed: 12
│   ├── Avg Score: 74
│   ├── Improvement: +8pts last month
│   └── Weak Area: "System Design"
│
├── Start New Practice CTA (prominent card)
│   └── [Select Role] → [Select Difficulty] → [Begin]
│
├── Recent Sessions (list)
│   └── Role | Score | Date | [View Feedback]
│
└── Progress Chart (line chart, last 30 days)
```

---

### 5.5 Mock Interview Room

```
┌──────────────────────────────────────────────────────────┐
│  Neeti AI Interview            Question 3/8   [24:30]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  🤖  Neeti AI                                    │   │
│  │                                                  │   │
│  │  "Interesting. You mentioned hooks — can you     │   │
│  │   walk me through how useEffect's cleanup        │   │
│  │   function works?"                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──── Your Response ─────────────────────────────┐     │
│  │  [Video of candidate]                          │     │
│  │                                                │     │
│  │  🔴 Recording...                               │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌── Coaching ────────────────────────────────────┐     │
│  │  Confidence: ████████░░  8.1                   │     │
│  │  Pacing:     ██████░░░░  6.2  ↓ Slow down      │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  [Skip Question]                    [Submit Answer]      │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Animation Guidelines

**Landing page** — Full animation budget. GSAP ScrollTrigger for reveal animations. Three.js for hero.

**Interview room** — Animation restrained. Only:
- Flag alert slide-in (300ms ease-out)
- Trust score gauge smooth update (600ms)
- Coaching bar updates (400ms ease)
- No continuous animations during active session

**Transitions** — Page transitions: 200ms fade. No slide transitions (disorienting in app context).

**Loading states** — Skeleton screens (pulsing). Never blank white flash.

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Candidate practice only; live interview not supported on mobile |
| Tablet | 768–1024px | Limited recruiter dashboard; no live interview room |
| Desktop | 1024–1440px | Full functionality |
| Wide | > 1440px | Max content width: 1440px, centered |

---

## 8. Key UX Flows

### Pre-Session System Check
```
1. Camera permission → show preview thumbnail
2. Mic permission → show audio level visualizer
3. Browser check → confirm WebRTC support
4. Consent modal → explicit confirm required
5. Only then: [Join Interview] button activates
```

### Flag Alert UX
```
LOW flag    → Quiet toast, bottom-right, 5s auto-dismiss
MEDIUM flag → Visible toast, top-right, 8s auto-dismiss, logged
HIGH flag   → Bold toast, top-right, persists until dismissed, sound ping
CRITICAL    → Full-width alert bar at top of screen, pulses, must be dismissed
```

### Report Generation Loading
```
After interview ends:
1. "Generating your report..." full-screen overlay
2. Progress steps: "Analyzing flags..." → "Calculating scores..." → "Writing summary..."
3. 3–8 second wait
4. Smooth transition to report page
```

---

## 9. Accessibility

- All interactive elements: min 44×44px touch target
- Color is never the sole differentiator (always paired with icon/text/shape)
- Focus rings visible (--brand-primary outline)
- Screen reader labels on all icon-only buttons
- Reduced motion: respect `prefers-reduced-motion` — skip GSAP animations
- Form error messages: visually and programmatically associated

---

## 10. Design Tokens (Tailwind config)

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6C63FF',
          secondary: '#8B83FF',
        },
        surface: {
          primary: '#0A0A0F',
          secondary: '#111118',
          tertiary: '#1A1A24',
        },
        severity: {
          low: '#64748B',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      }
    }
  }
}
```
