import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function MockInterviewRoom() {
  return (
    <div className="min-h-screen bg-surface-primary text-white p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-surface-tertiary px-6 py-4 rounded-2xl border border-gray-800">
          <div className="font-bold text-lg text-brand-secondary">Neeti AI Interview</div>
          <div className="text-gray-400">Question 3/8</div>
          <div className="font-mono text-xl font-bold">24:30</div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Interviewer View */}
          <Card className="flex flex-col h-[400px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-xl">
                🤖
              </div>
              <div className="font-bold">Neeti AI</div>
            </div>

            <div className="flex-1 bg-surface-primary rounded-xl border border-gray-800 p-6 flex items-center justify-center relative overflow-hidden">
                {/* Abstract AI visualizer */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent opacity-50 animate-pulse-slow"></div>

                <p className="text-xl font-medium text-center relative z-10 leading-relaxed">
                  "Interesting. You mentioned hooks — can you walk me through how useEffect's cleanup function works?"
                </p>
            </div>
          </Card>

          {/* Candidate View & Coaching */}
          <div className="flex flex-col gap-6 h-[400px]">
            {/* Candidate Video */}
            <Card className="flex-1 relative overflow-hidden p-0 border-0">
               <div className="absolute inset-0 bg-gray-900">
                  {/* Placeholder for actual video feed */}
               </div>
               <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Recording...</span>
               </div>
            </Card>

            {/* Coaching Overlay */}
            <Card className="shrink-0 bg-surface-tertiary">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Live Coaching</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Confidence</span>
                    <span className="font-bold text-green-400">8.1</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '81%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Pacing</span>
                    <span className="font-bold text-amber-400 flex items-center gap-2">
                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                       </svg>
                       6.2
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  <p className="text-xs text-amber-400/80 mt-1">Try to speak a bit slower.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center pt-4">
          <Button variant="ghost" className="text-gray-400">Skip Question</Button>
          <Button variant="primary" size="lg" className="w-48">Submit Answer</Button>
        </div>
      </div>
    </div>
  );
}
