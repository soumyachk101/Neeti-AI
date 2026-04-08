import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-primary text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            N
          </div>
          Neeti AI
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Log in</Button>
          <Button variant="primary">Start Free</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-24 max-w-7xl mx-auto text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-surface-primary to-surface-primary blur-3xl"></div>
        <Badge severity="medium" className="mb-8">v2.0 Now Available</Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Interview Integrity,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            Powered by AI
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Eliminate cheating, bias, and opacity from the modern hiring process with real-time computer vision and behavioral analysis.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="primary" className="w-full sm:w-auto">Start Free Trial</Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">See Demo</Button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-8 py-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Core Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hoverable>
            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Live Proctoring Engine</h3>
            <p className="text-gray-400">Real-time face detection, gaze tracking, and tab switch monitoring during live interviews.</p>
          </Card>

          <Card hoverable>
            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Behavioral Intelligence</h3>
            <p className="text-gray-400">Analyze voice tone, response timing, and engagement levels to generate confidence scores.</p>
          </Card>

          <Card hoverable>
            <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Trust Score Generation</h3>
            <p className="text-gray-400">Get a comprehensive 0-100 score combining integrity metrics and performance data.</p>
          </Card>
        </div>
      </section>
    </main>
  );
}
