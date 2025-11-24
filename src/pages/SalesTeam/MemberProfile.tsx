import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Target,
  Activity,
  ShieldCheck,
  Award,
  Building,
  Users,
} from "lucide-react";
import { getRepProfileData } from "@/data/sales-team.mock";
import { fmtMoney, fmtNum } from "@/lib/format";
import { SALES_ROLE_LABEL } from "@/config/org";

export default function SalesTeamMemberProfilePage() {
  const { repId } = useParams<{ repId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("summary");

  const data = useMemo(() => (repId ? getRepProfileData(repId) : undefined), [repId]);

  if (!repId) {
    return null;
  }

  if (!data) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-muted-foreground">No sales rep found.</p>
        <Button variant="ghost" onClick={() => navigate("/sales-team/directory")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to directory
        </Button>
      </div>
    );
  }

  const { rep, region, currentAssignment, currentSupervisor, historyAssignments, historySupervision, snapshots } = data;
  const latestSnapshot = snapshots[snapshots.length - 1];
  const roleLabel = SALES_ROLE_LABEL[rep.role] ?? rep.role;

  const handleDeactivate = () => {
    toast({
      title: "Deactivate member",
      description: "In production this would end current assignments automatically.",
    });
  };

  const handleAssign = () => navigate("/sales-team/mappings", { state: { repId: rep.id } });

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to directory
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight flex items-center gap-2">
              {rep.firstName} {rep.lastName} —
            <p className="text-muted-foreground">{rep.staffCode}</p>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline">{roleLabel}</Badge>
              <Badge className="capitalize">{rep.status}</Badge>
              <Badge variant="secondary">{region?.name ?? "Unassigned"}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleAssign}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Manage assignments
            </Button>
            <Button variant="destructive" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Region
                </div>
                <p className="font-semibold">{region?.name ?? "—"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Hired
                </div>
                <p className="font-semibold">
                  {new Date(rep.hiredAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p className="font-semibold">{rep.phone}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="font-semibold">{rep.email ?? "Not provided"}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs uppercase text-muted-foreground">Current distributor</p>
                <p className="font-semibold text-lg">
                  {currentAssignment?.distributor.name ?? "Not assigned"}
                </p>
                {currentAssignment && (
                  <p className="text-xs text-muted-foreground">
                    {currentAssignment.assignmentType} • since {new Date(currentAssignment.startDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs uppercase text-muted-foreground">Supervisor</p>
                <p className="font-semibold text-lg">
                  {currentSupervisor
                    ? `${currentSupervisor.supervisor.firstName} ${currentSupervisor.supervisor.lastName}`
                    : "Not assigned"}
                </p>
                {currentSupervisor && (
                  <p className="text-xs text-muted-foreground">
                    Since {new Date(currentSupervisor.startDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Period performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestSnapshot ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Achievement</p>
                  <p className="text-3xl font-bold">{latestSnapshot.achievementPct}%</p>
                  <p className="text-xs text-muted-foreground">
                    {latestSnapshot.period.slice(0, 4)} / {latestSnapshot.period.slice(4)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <KpiValue label="Revenue" value={fmtMoney(latestSnapshot.revenue)} />
                  <KpiValue label="Target" value={fmtMoney(latestSnapshot.target)} />
                  <KpiValue label="Orders" value={fmtNum(latestSnapshot.orders)} />
                  <KpiValue label="Volume" value={`${fmtNum(latestSnapshot.volume)} cs`} />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No KPI data captured.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4 bg-background w-full rounded-lg border border-border p-2">
        <TabsList className="w-full h-10">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryMetric label="Coverage status" value={currentAssignment ? "Mapped" : "Missing"} />
              <SummaryMetric
                label="Supervisor"
                value={currentSupervisor ? "Assigned" : "Missing"}
              />
              <SummaryMetric label="Tenure" value={`${new Date().getFullYear() - new Date(rep.hiredAt).getFullYear()} yrs`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Distributor assignment history
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="font-medium p-2">Distributor</th>
                    <th className="font-medium p-2">Type</th>
                    <th className="font-medium p-2">Start</th>
                    <th className="font-medium p-2">End</th>
                    <th className="font-medium p-2">Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {historyAssignments.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/70">
                      <td className="p-2">
                        {entry.distributor?.name ?? entry.distributorId}
                        <p className="text-xs text-muted-foreground">{entry.distributor?.code}</p>
                      </td>
                      <td className="p-2 capitalize">{entry.assignmentType}</td>
                      <td className="p-2">{entry.startDate}</td>
                      <td className="p-2">{entry.endDate ?? "Current"}</td>
                      <td className="p-2">{entry.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supervision">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Supervision history
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="font-medium p-2">Supervisor</th>
                    <th className="font-medium p-2">Start</th>
                    <th className="font-medium p-2">End</th>
                  </tr>
                </thead>
                <tbody>
                  {historySupervision.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/70">
                      <td className="p-2">
                        {entry.supervisor
                          ? `${entry.supervisor.firstName} ${entry.supervisor.lastName}`
                          : entry.supervisorId}
                      </td>
                      <td className="p-2">{entry.startDate}</td>
                      <td className="p-2">{entry.endDate ?? "Current"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Hook this tab to orders, coverage or CRM signals when APIs land.</p>
              <p>For now this is a placeholder to show where the audit timeline will live.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}


