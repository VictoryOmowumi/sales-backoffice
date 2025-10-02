import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  History,
  Target,
  Users,
  TrendingUp,
  Calendar,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { fmtMoney, fmtNum } from "@/lib/format";

export default function Targets() {
  // Mock data for targets overview
  const activeTargets = [
    {
      id: "1",
      period: "2025-01",
      region: "Abuja",
      rsm: "Abuja RSM",
      totalCases: 15000,
      totalValue: 45000000,
      status: "active",
      achievement: 87.3,
      customers: 45
    },
    {
      id: "2", 
      period: "2025-01",
      region: "Kano",
      rsm: "Kano RSM",
      totalCases: 12000,
      totalValue: 36000000,
      status: "active",
      achievement: 92.1,
      customers: 38
    },
    {
      id: "3",
      period: "2025-01", 
      region: "Lagos",
      rsm: "Lagos RSM",
      totalCases: 18000,
      totalValue: 54000000,
      status: "active",
      achievement: 78.9,
      customers: 52
    }
  ];

  const quickStats = [
    { label: "Active Targets", value: "3", icon: CheckCircle, color: "text-green-600" },
    { label: "Total Value", value: fmtMoney(135000000), icon: Target, color: "text-blue-600" },
    { label: "Avg Achievement", value: "86.1%", icon: TrendingUp, color: "text-orange-600" },
    { label: "Total Customers", value: "135", icon: Users, color: "text-purple-600" },
  ];

  const statusCounts = [
    { label: "Drafts", count: 3, color: "bg-yellow-500" },
    { label: "Awaiting Approval", count: 2, color: "bg-orange-500" },
    { label: "Active", count: 3, color: "bg-green-500" },
    { label: "Completed", count: 12, color: "bg-gray-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Targets Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor active targets, performance, and target management activities
          </p>
        </div>
        <Link to="/targets/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Targets
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusCounts.map((status, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
              <div>
                <div className="text-2xl font-bold">{status.count}</div>
                <div className="text-sm text-muted-foreground">{status.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Targets Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Active Targets</h3>
          <Link to="/targets/history">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Period</th>
                <th className="text-left p-3 font-medium">Region</th>
                <th className="text-left p-3 font-medium">RSM</th>
                <th className="text-right p-3 font-medium">Total Cases</th>
                <th className="text-right p-3 font-medium">Total Value</th>
                <th className="text-right p-3 font-medium">Customers</th>
                <th className="text-right p-3 font-medium">Achievement</th>
                <th className="text-center p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeTargets.map((target) => (
                <tr key={target.id} className="border-b hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {target.period}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {target.region}
                    </div>
                  </td>
                  <td className="p-3">{target.rsm}</td>
                  <td className="p-3 text-right font-medium">{fmtNum(target.totalCases)}</td>
                  <td className="p-3 text-right font-medium">{fmtMoney(target.totalValue)}</td>
                  <td className="p-3 text-right">{target.customers}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${target.achievement}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{target.achievement}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/targets/create">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Create New Targets</h3>
                <p className="text-sm text-muted-foreground">Set targets for new periods</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/targets/drafts">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500 text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Draft Targets</h3>
                <p className="text-sm text-muted-foreground">Review and edit saved drafts</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/targets/awaiting-approval">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500 text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pending Approval</h3>
                <p className="text-sm text-muted-foreground">Targets awaiting manager approval</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
