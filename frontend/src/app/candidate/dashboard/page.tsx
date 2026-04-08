import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-surface-primary text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-gray-400">Track your interview performance and practice new skills.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Sessions Completed</div>
            <div className="text-3xl font-bold">12</div>
          </Card>
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Avg Score</div>
            <div className="text-3xl font-bold text-brand-secondary">74</div>
          </Card>
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Improvement</div>
            <div className="text-3xl font-bold text-green-400">+8pts</div>
            <div className="text-xs text-gray-500 mt-1">last month</div>
          </Card>
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Weak Area</div>
            <div className="text-lg font-bold text-amber-400 truncate mt-2">System Design</div>
          </Card>
        </div>

        {/* Start New Practice CTA */}
        <Card className="bg-brand-primary/10 border-brand-primary/30 flex flex-col md:flex-row items-center justify-between p-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to practice?</h2>
            <p className="text-gray-300">Start a new mock interview with our AI agent to improve your skills.</p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <select className="bg-surface-tertiary border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5">
              <option>Frontend Engineer</option>
              <option>Backend Engineer</option>
              <option>Product Manager</option>
            </select>
            <select className="bg-surface-tertiary border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5">
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <Button variant="primary" className="whitespace-nowrap">Begin Practice</Button>
          </div>
        </Card>

        {/* Recent Sessions & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions List */}
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Recent Sessions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-tertiary rounded-xl border border-gray-800">
                <div>
                  <div className="font-medium">Frontend Engineer (React)</div>
                  <div className="text-sm text-gray-400">Oct 24 • Medium Difficulty</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-xl font-bold text-green-400">82</div>
                  <Button size="sm" variant="secondary">View Feedback</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-tertiary rounded-xl border border-gray-800">
                <div>
                  <div className="font-medium">System Design</div>
                  <div className="text-sm text-gray-400">Oct 20 • Hard Difficulty</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-xl font-bold text-amber-400">65</div>
                  <Button size="sm" variant="secondary">View Feedback</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-tertiary rounded-xl border border-gray-800">
                <div>
                  <div className="font-medium">Behavioral / Leadership</div>
                  <div className="text-sm text-gray-400">Oct 15 • Medium Difficulty</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-xl font-bold text-green-400">88</div>
                  <Button size="sm" variant="secondary">View Feedback</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Chart Placeholder */}
          <Card className="lg:col-span-1">
             <h2 className="text-xl font-bold mb-6">Progress (Last 30 Days)</h2>
             <div className="h-48 flex items-end justify-between gap-2 px-2">
                {/* Simulated bar chart */}
                <div className="w-1/6 bg-brand-primary/40 rounded-t-sm h-[60%]"></div>
                <div className="w-1/6 bg-brand-primary/50 rounded-t-sm h-[65%]"></div>
                <div className="w-1/6 bg-brand-primary/60 rounded-t-sm h-[62%]"></div>
                <div className="w-1/6 bg-brand-primary/70 rounded-t-sm h-[75%]"></div>
                <div className="w-1/6 bg-brand-primary/80 rounded-t-sm h-[72%]"></div>
                <div className="w-1/6 bg-brand-primary rounded-t-sm h-[85%]"></div>
             </div>
             <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Oct 1</span>
                <span>Oct 30</span>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
