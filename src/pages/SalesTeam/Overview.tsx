import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Download,
  MapPin,
  Award,
  ClipboardList
} from "lucide-react";
import {
  getOverviewMetrics,
  salesTeamTargetPeriods
} from "@/data/sales-team.mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import KpiCard from "@/components/widgets/KpiCard";
import { fmtNum } from "@/lib/format";

const periodOptions = salesTeamTargetPeriods.length
  ? salesTeamTargetPeriods
  : [new Date().toISOString().slice(0, 7).replace("-", "")];

export default function SalesTeamOverviewPage() {
  const [period, setPeriod] = useState(periodOptions[periodOptions.length - 1]);
  const metrics = useMemo(() => getOverviewMetrics(period), [period]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Sales team</p>
          <h1 className="font-display text-3xl font-semibold mt-1">People & Coverage Overview</h1>
          <p className="text-muted-foreground mt-2">Manage and track the sales team's performance and coverage.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.slice(0, 4)} / {option.slice(4)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Snapshot
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Active reps"
          value={fmtNum(metrics.totalActiveReps)}
          right={<Badge variant="outline">{metrics.coveragePct}% mapped</Badge>}
        />
        <KpiCard
          title="Supervisor coverage"
          value={`${metrics.supervisorCoveragePct}%`}
          right={<Badge variant="outline">Supervision</Badge>}
        />
        <KpiCard
          title="Avg target achievement"
          value={`${metrics.avgAchievement}%`}
          right={<span className="text-xs text-muted-foreground">Period {metrics.period}</span>}
        />
        <KpiCard
          title="Data health"
          value={metrics.coveragePct >= 90 ? "Healthy" : "Needs attention"}
          right={
            <Badge variant={metrics.coveragePct >= 90 ? "secondary" : "destructive"}>
              {metrics.coveragePct >= 90 ? "Compliant" : "Action"}
            </Badge>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Region performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.regionAchievement.map((region) => (
              <div key={region.region.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{region.region.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {region.activeReps} active reps
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={region.achievement} className="h-2 flex-1" />
                  <span className="w-12 text-sm font-semibold text-right">
                    {region.achievement}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top performers
            </CardTitle>
            <Badge variant="secondary">Top 5</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.topPerformers.map(({ rep, snapshot }, index) => (
              <div
                key={rep.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">#{index + 1}</span>
                    {rep.firstName} {rep.lastName}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {rep.regionId.replace("reg-", "").toUpperCase()} • Staff {rep.staffCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-bold",
                    snapshot.achievementPct >= 100 ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {snapshot.achievementPct}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₦{(snapshot.revenue / 1_000_000).toFixed(1)}m / ₦{(snapshot.target / 1_000_000).toFixed(1)}m
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Gaps & alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertCard
              title="Reps without distributor"
              value={`${metrics.totalActiveReps - Math.round((metrics.coveragePct / 100) * metrics.totalActiveReps)}`}
              description="Assign them before next cycle"
              status={metrics.coveragePct >= 90 ? "ok" : "warn"}
            />
            <AlertCard
              title="Reps without supervisor"
              value={`${metrics.totalActiveReps - Math.round((metrics.supervisorCoveragePct / 100) * metrics.totalActiveReps)}`}
              description="Complete supervisor mapping"
              status={metrics.supervisorCoveragePct >= 85 ? "ok" : "warn"}
            />
            <AlertCard
              title="Inactive this period"
              value="4"
              description="Review exit or reactivation"
              status="info"
            />
            <AlertCard
              title="Assignments ending soon"
              value={`${metrics.assignmentsEndingSoon.length}`}
              description="Confirm renewal or transfer"
              status={metrics.assignmentsEndingSoon.length ? "warn" : "ok"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Assignment reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.assignmentsEndingSoon.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No assignments expiring within 7 days.
              </div>
            )}
            {metrics.assignmentsEndingSoon.map(({ assignment, rep, distributor }) => (
              <div key={assignment.id} className="rounded-lg border border-border p-3">
                <div className="font-semibold">
                  {rep.firstName} {rep.lastName}
                </div>
                <p className="text-sm text-muted-foreground">
                  {distributor.name} • ends {assignment.endDate}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {assignment.assignmentType} assignment
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type AlertStatus = "ok" | "warn" | "info";

function AlertCard({
  title,
  value,
  description,
  status,
}: {
  title: string;
  value: string;
  description: string;
  status: AlertStatus;
}) {
  const statusClasses = {
    ok: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 border-emerald-100 dark:border-emerald-900/30",
    warn: "bg-amber-50 dark:bg-amber-900/10 text-amber-700 border-amber-100 dark:border-amber-900/30",
    info: "bg-blue-50 dark:bg-blue-900/10 text-blue-700 border-blue-100 dark:border-blue-900/30",
  } as const;

  return (
    <div className={cn("rounded-lg border p-4", statusClasses[status])}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
      <p className="text-xs mt-1">{description}</p>
    </div>
  );
}


