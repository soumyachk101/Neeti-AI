import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-surface-primary text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" className="-ml-4">&larr; Back to Dashboard</Button>
          <Button variant="secondary">Export PDF</Button>
        </div>

        {/* Top Overview Card */}
        <Card className="flex flex-col md:flex-row items-center justify-between gap-8 p-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sarah Jenkins</h1>
            <p className="text-lg text-gray-400 mb-4">Frontend Engineer Interview</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Oct 24, 2023</span>
              <span>•</span>
              <span>45 minutes</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-green-400 mb-2">84</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Trust Score</div>
            <Badge risk="low">Low Risk</Badge>
          </div>
        </Card>

        {/* Score Breakdown Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card elevated>
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">Integrity Score</div>
            <div className="text-3xl font-bold text-green-400 mb-2">91/100</div>
            <p className="text-sm text-gray-500">High behavioral consistency.</p>
          </Card>
          <Card elevated>
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">Performance Score</div>
            <div className="text-3xl font-bold text-amber-400 mb-2">73/100</div>
            <p className="text-sm text-gray-500">Good technical knowledge.</p>
          </Card>
          <Card elevated>
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">Flags Triggered</div>
            <div className="text-3xl font-bold text-red-400 mb-2">4</div>
            <p className="text-sm text-gray-500">Avg severity: Medium</p>
          </Card>
        </div>

        {/* AI Summary */}
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Assessment Summary
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <p className="mb-4">
              The interview was conducted with high overall integrity. The candidate maintained good eye contact and stayed within the frame for the majority of the session. A single tab switch was detected during the coding portion, but the duration was brief (4 seconds) and did not correlate with a significant shift in response quality.
            </p>
            <p>
              Performance-wise, the candidate demonstrated solid understanding of React fundamentals and state management. However, there was noticeable hesitation and lower confidence scores during the system design questions. Overall recommendation is positive based on the trust score of 84.
            </p>
          </div>
        </Card>

        {/* Detailed Flags Table */}
        <Card>
          <h2 className="text-xl font-bold mb-6">Flag Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Severity</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 text-gray-400">14:12:05</td>
                  <td className="py-4"><Badge severity="high">High</Badge></td>
                  <td className="py-4 font-medium">Tab Switch</td>
                  <td className="py-4 text-gray-400">Candidate switched to another browser tab for 4 seconds.</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 text-gray-400">14:08:22</td>
                  <td className="py-4"><Badge severity="low">Low</Badge></td>
                  <td className="py-4 font-medium">Gaze Away</td>
                  <td className="py-4 text-gray-400">Looking off-screen right.</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 text-gray-400">14:02:10</td>
                  <td className="py-4"><Badge severity="medium">Medium</Badge></td>
                  <td className="py-4 font-medium">Frame Exit</td>
                  <td className="py-4 text-gray-400">Face not detected in frame for 2 seconds.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recruiter Decision */}
        <Card className="bg-surface-tertiary border-brand-primary/30">
          <h2 className="text-xl font-bold mb-6">Recruiter Decision</h2>
          <div className="flex gap-4 mb-6">
            <Button className="flex-1" variant="success">Advance Candidate</Button>
            <Button className="flex-1" variant="secondary">Hold for Review</Button>
            <Button className="flex-1" variant="danger">Reject</Button>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Final Notes</label>
            <textarea
              className="w-full bg-surface-primary border border-gray-700 rounded-lg p-4 text-sm resize-none focus:outline-none focus:border-brand-primary h-24"
              placeholder="Add your final assessment notes here..."
            ></textarea>
          </div>
        </Card>
      </div>
    </div>
  );
}
