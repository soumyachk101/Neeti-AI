import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function LiveInterviewRoom() {
  return (
    <div className="h-screen bg-surface-primary text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg">Neeti AI</div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div>
            <div className="text-sm font-medium">Sarah Jenkins</div>
            <div className="text-xs text-gray-400">Frontend Engineer Interview</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm">24:32</div>
          <Button size="sm" variant="danger">End Interview</Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Video & Notes */}
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
          {/* Video Feed Placeholder */}
          <div className="aspect-video bg-surface-tertiary rounded-2xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Self View (small PIP) */}
            <div className="absolute bottom-4 right-4 w-48 aspect-video bg-gray-900 rounded-lg border border-gray-700"></div>

            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="text-gray-500 font-medium">Waiting for candidate video...</div>
          </div>

          {/* Question Panel */}
          <Card className="flex-1 min-h-[200px] flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-brand-secondary">Q3: Explain the React event loop and how useEffect's cleanup function works.</h3>
            <textarea
              className="flex-1 bg-surface-primary border border-gray-800 rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-brand-primary"
              placeholder="Take notes here..."
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="secondary">Previous Q</Button>
              <Button size="sm" variant="primary">Next Q</Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Integrity Sidebar */}
        <div className="w-80 border-l border-gray-800 bg-[#0c0c13] flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h2 className="font-bold mb-6 flex items-center justify-between">
              Integrity Panel
              <Badge severity="medium">Monitoring</Badge>
            </h2>

            {/* Trust Score Gauge */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1E1E2E" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray="283" strokeDashoffset="45" className="transition-all duration-1000" />
                </svg>
                <div className="absolute text-3xl font-bold">84</div>
              </div>
              <div className="text-sm text-gray-400 mt-2">Current Trust Score</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Integrity</span>
                <span className="font-bold text-green-400">91</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Performance</span>
                <span className="font-bold text-amber-400">73</span>
              </div>
            </div>
          </div>

          {/* Flags Log */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Flags</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1"><Badge severity="high">High</Badge></div>
                <div>
                  <div className="text-sm font-medium">Tab Switch Detected</div>
                  <div className="text-xs text-gray-500">12:14 PM</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><Badge severity="low">Low</Badge></div>
                <div>
                  <div className="text-sm font-medium">Gaze Away</div>
                  <div className="text-xs text-gray-500">12:08 PM</div>
                </div>
              </div>
              <div className="flex gap-3 opacity-50">
                <div className="mt-1"><Badge severity="low">Low</Badge></div>
                <div>
                  <div className="text-sm font-medium">Gaze Away</div>
                  <div className="text-xs text-gray-500">12:02 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
