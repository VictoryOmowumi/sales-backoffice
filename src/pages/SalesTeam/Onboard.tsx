import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { salesTeamDistributors, salesTeamData } from "@/data/sales-team.mock";
import {
  ORG_REGION_OPTIONS,
  SALES_ROLE_OPTIONS,
  SUPERVISOR_ROLE_IDS,
  type SalesRoleId
} from "@/config/org";

const supervisorOptions = salesTeamData.reps.filter((rep) => SUPERVISOR_ROLE_IDS.includes(rep.role));

export default function SalesTeamOnboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    staffCode: "",
    phone: "",
    email: "",
    role: "ce" as SalesRoleId,
    regionId: ORG_REGION_OPTIONS[0]?.id ?? "",
    supervisorId: "",
    distributorId: "",
    startDate: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    toast({
      title: "Rep onboarded",
      description: "Mock submit: this would create the rep and mapping once APIs land.",
    });
    navigate("/sales-team/directory");
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <Button variant="ghost" type="button" onClick={() => navigate(-1)} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className=" ml-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Onboard member</h1>
          <p className="text-muted-foreground">
            Capture single profiles or import a file for bulk onboarding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Single entry form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First name" required>
                <Input value={formState.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
              </Field>
              <Field label="Last name" required>
                <Input value={formState.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
              </Field>
              <Field label="Staff code" required>
                <Input value={formState.staffCode} onChange={(e) => handleChange("staffCode", e.target.value)} required />
              </Field>
              <Field label="Phone" required>
                <Input value={formState.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
              </Field>
              <Field label="Email">
                <Input type="email" value={formState.email} onChange={(e) => handleChange("email", e.target.value)} />
              </Field>
              <Field label="Role" required>
                <Select value={formState.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {SALES_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Region" required>
                <Select value={formState.regionId} onValueChange={(value) => handleChange("regionId", value)}>
                  <SelectTrigger><SelectValue placeholder="Choose region" /></SelectTrigger>
                  <SelectContent>
                    {ORG_REGION_OPTIONS.map((region) => (
                      <SelectItem key={region.id} value={region.id}>{region.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Supervisor">
                <Select value={formState.supervisorId} onValueChange={(value) => handleChange("supervisorId", value)}>
                  <SelectTrigger><SelectValue placeholder="Select supervisor" /></SelectTrigger>
                  <SelectContent>
                    {supervisorOptions.map((sup) => (
                      <SelectItem key={sup.id} value={sup.id}>
                        {sup.firstName} {sup.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Distributor (optional)">
                <Select value={formState.distributorId} onValueChange={(value) => handleChange("distributorId", value)}>
                  <SelectTrigger><SelectValue placeholder="Select distributor" /></SelectTrigger>
                  <SelectContent>
                    {salesTeamDistributors.map((dist) => (
                      <SelectItem key={dist.id} value={dist.id}>
                        {dist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Start date" required>
                <Input type="date" value={formState.startDate} onChange={(e) => handleChange("startDate", e.target.value)} required />
              </Field>
            </div>

            <Field label="Notes">
              <Textarea rows={4} value={formState.notes} onChange={(e) => handleChange("notes", e.target.value)} />
            </Field>

            <div className="flex justify-end">
              <Button type="submit">Create profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload CSV/XLSX with the required columns. We run a dry-run and return row-level errors before committing.
            </p>
            <div className="rounded border border-dashed border-border p-6 text-center space-y-3">
              <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or <span className="text-primary font-medium">browse</span> files
              </p>
              <p className="text-xs text-muted-foreground">
                Columns: staff_code, first_name, last_name, phone, email, role, region, supervisor_staff_code, distributor_code, start_date
              </p>
              <Button variant="secondary" type="button">
                <FileText className="h-4 w-4 mr-2" />
                Download template
              </Button>
            </div>
            <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Governance</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Validates duplicates (staff code & email)</li>
                <li>Requires start date for assignments</li>
                <li>Records uploader + batch id for audit</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
    </div>
  );
}


