import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-surface-primary text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Interviews</h1>
            <p className="text-gray-400">Manage your active and past interview sessions.</p>
          </div>
          <Button variant="primary">Create Interview</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Total Interviews</div>
            <div className="text-3xl font-bold">142</div>
          </Card>
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Avg Trust Score</div>
            <div className="text-3xl font-bold text-green-400">84</div>
          </Card>
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">High Risk Flags</div>
            <div className="text-3xl font-bold text-red-400">12</div>
          </Card>
          <Card className="md:col-span-1" elevated>
            <div className="text-sm text-gray-400 mb-1">Pending Review</div>
            <div className="text-3xl font-bold text-amber-400">8</div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Sessions</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">All</Button>
              <Button size="sm" variant="ghost">Completed</Button>
              <Button size="sm" variant="ghost">High Risk</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-sm text-gray-400">
                  <th className="pb-3 font-medium">Candidate</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Trust Score</th>
                  <th className="pb-3 font-medium">Risk</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-800/50 hover:bg-surface-tertiary/50 transition-colors">
                  <td className="py-4 font-medium">Sarah Jenkins</td>
                  <td className="py-4 text-gray-400">Frontend Engineer</td>
                  <td className="py-4 text-gray-400">Today, 2:00 PM</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-800 flex items-center justify-center text-green-400 font-bold">
                        92
                      </div>
                    </div>
                  </td>
                  <td className="py-4"><Badge severity="low">Low Risk</Badge></td>
                  <td className="py-4 text-right">
                    <Button size="sm" variant="ghost">View Report</Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-800/50 hover:bg-surface-tertiary/50 transition-colors">
                  <td className="py-4 font-medium">Michael Chen</td>
                  <td className="py-4 text-gray-400">Backend Developer</td>
                  <td className="py-4 text-gray-400">Yesterday</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-800 flex items-center justify-center text-red-400 font-bold">
                        45
                      </div>
                    </div>
                  </td>
                  <td className="py-4"><Badge severity="critical">Critical</Badge></td>
                  <td className="py-4 text-right">
                    <Button size="sm" variant="ghost">View Report</Button>
                  </td>
                </tr>
                <tr className="border-b border-gray-800/50 hover:bg-surface-tertiary/50 transition-colors">
                  <td className="py-4 font-medium">Alex Rodriguez</td>
                  <td className="py-4 text-gray-400">Product Manager</td>
                  <td className="py-4 text-gray-400">Oct 24, 2023</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-900/30 border border-amber-800 flex items-center justify-center text-amber-400 font-bold">
                        76
                      </div>
                    </div>
                  </td>
                  <td className="py-4"><Badge severity="medium">Medium</Badge></td>
                  <td className="py-4 text-right">
                    <Button size="sm" variant="ghost">View Report</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
