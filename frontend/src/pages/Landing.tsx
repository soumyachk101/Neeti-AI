import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TechnicalBlueprint } from '../components/TechnicalBlueprint';
import { StatusIndicator } from '../components/StatusIndicator';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  Terminal,
  FileCheck,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  Shield,
  Cpu,
  Zap,
  Globe,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';

const AGENTS = [
  { name: 'Coding Agent', status: 'active' as const },
  { name: 'Speech Agent', status: 'active' as const },
  { name: 'Vision Agent', status: 'active' as const },
  { name: 'Reasoning Agent', status: 'active' as const },
  { name: 'Evaluation Agent', status: 'idle' as const },
];

const CAPABILITIES = [
  {
    icon: Terminal,
    title: 'Real-time Execution',
    desc: 'Immediate code compilation and execution across 50+ languages via Judge0 integration.',
    tag: 'EXEC_001',
  },
  {
    icon: Shield,
    title: 'Multi-Agent Analysis',
    desc: 'Specialized agents evaluate code quality, reasoning, communication, and depth.',
    tag: 'EVAL_002',
  },
  {
    icon: FileCheck,
    title: 'Evidence Collection',
    desc: 'Comprehensive session recording with code snapshots, audio, and behavioral metrics.',
    tag: 'LOG_003',
  },
  {
    icon: Fingerprint,
    title: 'Secure Protocol',
    desc: 'End-to-end encryption, authenticated access, and compliance-ready audit trails.',
    tag: 'SEC_004',
  },
];

const PHASES = [
  {
    num: '01',
    title: 'Session Initialization',
    desc: 'Configure evaluation parameters, define assessment criteria, and generate secure session credentials.',
    tag: 'INIT_SESSION',
  },
  {
    num: '02',
    title: 'Live Evaluation',
    desc: 'Real-time code execution, automated testing, and concurrent analysis by specialized AI agents.',
    tag: 'CONDUCT_EVAL',
  },
  {
    num: '03',
    title: 'Verdict Generation',
    desc: 'Comprehensive report compilation with evidence-backed assessments and quantified performance metrics.',
    tag: 'GEN_VERDICT',
  },
];

const TECH_STACK = [
  { icon: Cpu, label: 'FastAPI + Python 3.11' },
  { icon: Zap, label: 'React 19 + TypeScript' },
  { icon: Globe, label: 'LiveKit WebRTC' },
  { icon: Shield, label: 'Supabase Auth' },
];

// Typewriter hook
function useTypewriter(text: string, speed = 50, delay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

export const Landing = () => {
  const { displayed: typedText, done: typingDone } = useTypewriter(
    'Evidence-based hiring decisions powered by five autonomous AI agents.',
    30,
    800
  );

  return (
    <div className="min-h-screen bg-neeti-bg relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.012]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(194,112,42,.4) 1px,transparent 1px), linear-gradient(90deg,rgba(194,112,42,.4) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(194,112,42,.06),transparent)]" />

      <div className="ambient-orb ambient-orb-bronze w-[600px] h-[600px] top-[-10%] right-[-5%] z-0 opacity-70" />
      <div className="ambient-orb ambient-orb-blue w-[500px] h-[500px] bottom-[10%] left-[-8%] z-0 opacity-50" />
      <div className="ambient-orb ambient-orb-warm w-[400px] h-[400px] top-[40%] right-[15%] z-0 opacity-40" />

      {/* Floating particles */}
      <div className="floating-particles z-0">
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>

      <div className="relative z-10">
        <header className="glass-header sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <Logo size="md" showWordmark showTagline linkTo="/" />

            <div className="flex items-center gap-3">
              <Link
                to="/about"
                className="hidden sm:inline-block text-sm text-ink-secondary hover:text-ink-primary transition-colors"
              >
                About
              </Link>
              <Link
                to="/faq"
                className="hidden sm:inline-block text-sm text-ink-secondary hover:text-ink-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 border border-neeti-border hover:border-bronze/50 bg-neeti-elevated text-ink-primary text-sm font-medium rounded-md transition-all duration-200 hover:shadow-glow"
              >
                Access System
              </Link>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-bronze/25 bg-bronze/[0.08] backdrop-blur-md rounded-full stagger-1">
                <Shield className="w-3.5 h-3.5 text-bronze" />
                <span className="text-xs font-mono text-bronze tracking-wider">
                  TECHNICAL ASSESSMENT v2.1
                </span>
              </div>

              <h2 className="text-5xl lg:text-[3.5rem] xl:text-6xl font-display font-bold text-ink-primary leading-[1.08] tracking-tight stagger-2">
                Evidence-Based
                <br />
                <span className="text-gradient-bronze">Technical Judgment</span>
              </h2>

              <div className="stagger-3">
                <p className="text-lg text-ink-secondary leading-relaxed max-w-xl h-[3.5rem]">
                  {typedText}
                  {!typingDone && <span className="typewriter-cursor" />}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 stagger-4">
                <Link to="/register" className="group">
                  <button className="btn-shimmer w-full sm:w-auto px-8 py-3.5 bg-bronze hover:bg-bronze-light text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-strong active:scale-[0.97]">
                    Initiate Evaluation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full sm:w-auto px-8 py-3.5 border border-neeti-border hover:border-bronze/40 bg-neeti-surface text-ink-primary font-medium rounded-md transition-all duration-200">
                    System Login
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2 text-sm text-ink-tertiary stagger-5">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-bronze" strokeWidth={2} />
                  Multi-agent analysis
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-bronze" strokeWidth={2} />
                  Real-time execution
                </span>
                <span className="hidden sm:inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-bronze" strokeWidth={2} />
                  Evidence-backed
                </span>
              </div>
            </div>

            <div className="hidden lg:block space-y-6 stagger-6">
              <TechnicalBlueprint showScanLine />

              <div className="glass-medium p-5 space-y-3">
                <p className="text-[10px] font-mono text-ink-ghost tracking-[0.2em] uppercase mb-3">
                  Agent Status
                </p>
                {AGENTS.map((a, i) => (
                  <div key={a.name} className={`flex items-center justify-between stagger-${Math.min(i + 3, 8)}`}>
                    <span className="text-sm font-mono text-ink-secondary">{a.name}</span>
                    <StatusIndicator
                      status={a.status}
                      label={a.status === 'active' ? 'READY' : 'STANDBY'}
                      showPulse={a.status === 'active'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack trust bar */}
        <ScrollReveal variant="fade-in" duration={800}>
          <section className="border-y border-white/[0.04] bg-white/[0.01] py-6">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-14">
              <span className="text-[10px] font-mono text-ink-ghost tracking-[0.2em] uppercase">Built with</span>
              {TECH_STACK.map((tech) => (
                <div key={tech.label} className="flex items-center gap-2 text-sm text-ink-tertiary">
                  <tech.icon className="w-4 h-4 text-bronze/60" strokeWidth={1.5} />
                  <span className="font-mono text-xs">{tech.label}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <section className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm py-24">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal variant="fade-up">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-display font-bold text-ink-primary mb-3">
                  Evaluation Infrastructure
                </h3>
                <p className="text-ink-secondary max-w-2xl mx-auto">
                  A comprehensive technical assessment framework built on measurable
                  criteria and automated analysis.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CAPABILITIES.map((cap, i) => (
                <ScrollReveal key={cap.tag} variant="fade-up" delay={i * 100}>
                  <div
                    className="glass-subtle p-7 group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-5 relative inline-flex items-center justify-center w-12 h-12 rounded-md bg-bronze/[0.07] group-hover:bg-bronze/[0.12] transition-colors">
                      <cap.icon className="w-6 h-6 text-bronze" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-base font-display font-semibold text-ink-primary mb-2">
                      {cap.title}
                    </h4>
                    <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                      {cap.desc}
                    </p>
                    <span className="text-[10px] font-mono text-ink-ghost tracking-[0.15em]">
                      MODULE: {cap.tag}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <ScrollReveal variant="fade-up">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-display font-bold text-ink-primary mb-3">
                Assessment Protocol
              </h3>
              <p className="text-ink-secondary max-w-2xl mx-auto">
                A rigorous three-phase evaluation process designed for technical
                integrity and comprehensive judgment.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12">
            {PHASES.map((phase, i) => (
              <ScrollReveal key={phase.num} variant="fade-up" delay={i * 150}>
                <div className="relative pl-10 group">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-neeti-border group-last:hidden" />

                  <div className="absolute left-0 top-0 w-9 h-9 flex items-center justify-center border border-bronze/30 bg-neeti-surface rounded-md text-base font-mono font-bold text-bronze">
                    {phase.num}
                  </div>

                  <div className="pt-1">
                    <h4 className="text-lg font-display font-semibold text-ink-primary mb-3">
                      {phase.title}
                    </h4>
                    <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                      {phase.desc}
                    </p>
                    <span className="text-[10px] font-mono text-ink-ghost tracking-[0.15em]">
                      PROTOCOL: {phase.tag}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <ScrollReveal variant="scale">
          <section className="max-w-7xl mx-auto px-6 pb-24">
            <div className="glass-bronze p-10 md:p-14 text-center space-y-6">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-ink-primary">
                Ready to Transform Your Hiring?
              </h3>
              <p className="text-ink-secondary max-w-xl mx-auto">
                Join the new era of evidence-based technical evaluation. Fair, transparent, and powered by AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link to="/register">
                  <button className="btn-shimmer px-10 py-4 bg-bronze hover:bg-bronze-light text-white font-semibold rounded-md transition-all duration-200 flex items-center gap-2 shadow-glow hover:shadow-glow-strong active:scale-[0.97] text-base">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/about" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4">
                  Learn more about the platform
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <Footer />
      </div>
    </div>
  );
};
