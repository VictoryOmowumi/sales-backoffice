import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Shuffle,
  ShieldCheck,
  AlertTriangle,
  History,
  MapPin
} from "lucide-react";
import {
  filterDirectory,
  salesTeamDistributors,
  salesTeamAssignmentHistory
} from "@/data/sales-team.mock";
import { useToast } from "@/hooks/use-toast";

export default function SalesTeamMappingsPage() {
  const { toast } = useToast();
  const [selectedRepIds, setSelectedRepIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    distributorId: "",
    startDate: "",
    assignmentType: "primary",
    reason: "",
  });

  const directory = useMemo(
    () => filterDirectory({ status: "active" }).filter((entry) => entry.currentAssignment),
    []
  );

  const recentMutations = useMemo(
    () =>
      salesTeamAssignmentHistory
        .filter((item) => item.endDate)
        .slice(-8)
        .reverse(),
    []
  );

  const toggleRep = (repId: string) => {
    setSelectedRepIds((prev) =>
      prev.includes(repId) ? prev.filter((id) => id !== repId) : [...prev, repId]
    );
  };

  const handleBulkSubmit = () => {
    toast({
      title: "Bulk transfer queued",
      description: `${selectedRepIds.length} rep(s) will move to ${
        salesTeamDistributors.find((dist) => dist.id === formState.distributorId)?.name ?? "new distributor"
      }`,
    });
    setDialogOpen(false);
    setSelectedRepIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold mt-1">Distributor & supervision mappings</h1>
          <p className="text-muted-foreground">
            Manage and track the distributor and supervision mappings for the sales team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={selectedRepIds.length === 0} onClick={() => setDialogOpen(true)}>
            <Shuffle className="h-4 w-4 mr-2" />
            Transfer {selectedRepIds.length || ""} reps
          </Button>
          <Button variant="secondary">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Export current mappings
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Current coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-sm text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={selectedRepIds.length === directory.length}
                      onCheckedChange={(checked) =>
                        setSelectedRepIds(checked ? directory.map((entry) => entry.rep.id) : [])
                      }
                    />
                  </th>
                  <th className="text-left font-medium p-3">Rep</th>
                  <th className="text-left font-medium p-3">Distributor</th>
                  <th className="text-left font-medium p-3">Start date</th>
                  <th className="text-left font-medium p-3">Type</th>
                  <th className="text-left font-medium p-3">Region</th>
                </tr>
              </thead>
              <tbody>
                {directory.map((entry) => (
                  <tr key={entry.rep.id} className="border-b hover:bg-muted/40 transition-colors">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedRepIds.includes(entry.rep.id)}
                        onCheckedChange={() => toggleRep(entry.rep.id)}
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{entry.rep.firstName} {entry.rep.lastName}</p>
                      <p className="text-xs text-muted-foreground">{entry.rep.staffCode}</p>
                    </td>
                    <td className="p-3">
                      {entry.currentAssignment?.distributor.name}
                      <p className="text-xs text-muted-foreground">{entry.currentAssignment?.distributor.code}</p>
                    </td>
                    <td className="p-3 text-sm">
                      {entry.currentAssignment ? new Date(entry.currentAssignment.startDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {entry.currentAssignment?.assignmentType}
                      </Badge>
                    </td>
                    <td className="p-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {entry.region?.name ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Guardrails
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Only one open assignment per rep (primary or secondary). We auto-close the previous row.</p>
            <p>• Transfers capture reason + actor for audit (see history).</p>
            <p>• Supervisors cannot be outside the rep’s region unless admin overrides.</p>
            <p>• End-dated assignments remain for historical targeting & rewards.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMutations.map((mutation) => (
              <div key={mutation.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{mutation.repId}</p>
                  <span className="text-xs text-muted-foreground">
                    Ended {mutation.endDate}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {mutation.distributorId} ({mutation.assignmentType})
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bulk transfer</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Selected reps: {selectedRepIds.length}. We will end existing assignments and start a new row with the date below.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Distributor</Label>
              <Select value={formState.distributorId} onValueChange={(value) => setFormState((prev) => ({ ...prev, distributorId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select distributor" />
                </SelectTrigger>
                <SelectContent>
                  {salesTeamDistributors.map((dist) => (
                    <SelectItem key={dist.id} value={dist.id}>
                      {dist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignment type</Label>
                <Select value={formState.assignmentType} onValueChange={(value) => setFormState((prev) => ({ ...prev, assignmentType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input type="date" value={formState.startDate} onChange={(e) => setFormState((prev) => ({ ...prev, startDate: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason / reference</Label>
              <Input value={formState.reason} onChange={(e) => setFormState((prev) => ({ ...prev, reason: e.target.value }))} placeholder="e.g. territory rebalance, distributor upgrade" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkSubmit} disabled={!formState.distributorId || !formState.startDate}>
              Confirm transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


