import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  UserPlus,
  Users,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Replace,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { filterDirectory } from "@/data/sales-team.mock";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ORG_REGION_OPTIONS,
  SALES_ROLE_OPTIONS,
  SALES_ROLE_LABEL,
  type OrgRegionId,
  type SalesRoleId
} from "@/config/org";
import type { RepStatus } from "@/domain/sales-team";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export default function SalesTeamDirectoryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<"all" | OrgRegionId>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | SalesRoleId>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | RepStatus>("active");

  const entries = useMemo(
    () =>
      filterDirectory({
        query: search,
        regionId: regionFilter === "all" ? undefined : regionFilter,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    [search, regionFilter, roleFilter, statusFilter]
  );

  const handleAssignDistributor = (repId: string) => {
    toast({
      title: "Assignment initiated",
      description: "Launch the Mappings page to complete distributor assignment.",
    });
    navigate("/sales-team/mappings", { state: { repId } });
  };

  const handleChangeSupervisor = (repId: string) => {
    toast({
      title: "Supervisor update",
      description: "Open profile > supervision tab to complete this change.",
    });
    navigate(`/sales-team/reps/${repId}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold mt-1">Team Directory</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Search, filter and manage reps, supervisors and managers in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/sales-team/mappings")}>
            <Replace className="h-4 w-4 mr-2" />
            Manage mappings
          </Button>
          <Button size="sm" onClick={() => navigate("/sales-team/onboard")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Onboard member
          </Button>
        </div>
      </header>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, staff code, phone..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value as "all" | OrgRegionId)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {ORG_REGION_OPTIONS.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as "all" | SalesRoleId)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {SALES_ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | RepStatus)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Users className="h-4 w-4" />
            {entries.length} team members
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TooltipProvider>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium p-4">Member</th>
                    <th className="text-left font-medium p-4">Role</th>
                    <th className="text-left font-medium p-4">Region / Distributor</th>
                    <th className="text-left font-medium p-4">Supervisor</th>
                    <th className="text-left font-medium p-4">Contact</th>
                    <th className="text-left font-medium p-4">Status</th>
                    <th className="text-left font-medium p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const { rep, region, currentAssignment, supervisor } = entry;
                    const fullName = `${rep.firstName} ${rep.lastName}`;
                    const roleMeta = SALES_ROLE_OPTIONS.find((role) => role.id === rep.role);
                    const supervisorRoleLabel = supervisor ? SALES_ROLE_LABEL[supervisor.role] : undefined;

                    return (
                      <tr key={rep.id} className="border-b hover:bg-muted/40 transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{fullName}</div>
                          <div className="text-xs text-muted-foreground">{rep.staffCode}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit">
                              {roleMeta?.code ?? rep.role.toUpperCase()}
                            </Badge>
                           
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{region?.name ?? "–"}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {currentAssignment ? currentAssignment.distributor.name : "No distributor"}
                          </p>
                        </td>
                        <td className="p-4">
                          {supervisor ? (
                            <>
                              <div className="text-sm font-medium">
                                {supervisor.firstName} {supervisor.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">{supervisorRoleLabel}</div>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Not assigned</span>
                          )}
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{rep.phone}</span>
                          </div>
                          {rep.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate text-sm">{rep.email}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              "capitalize",
                              rep.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {rep.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => navigate(`/sales-team/reps/${rep.id}`)}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                  <span className="sr-only">View profile</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View profile</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleAssignDistributor(rep.id)}
                                >
                                  <ShieldCheck className="h-4 w-4" />
                                  <span className="sr-only">Assign distributor</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Assign distributor</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleChangeSupervisor(rep.id)}
                                >
                                  <UserCheck className="h-4 w-4" />
                                  <span className="sr-only">Change supervisor</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Change supervisor</TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}

