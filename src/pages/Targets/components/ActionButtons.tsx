import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Send } from "lucide-react";
import type { Period, Region } from "@/domain/targets";

interface ActionButtonsProps {
  selectedPeriod: string;
  selectedRegion: string;
  customerCount: number;
  columnCount: number;
  periods: Period[];
  regions: Region[];
  onSaveDraft: () => void;
  onSubmitForApproval: () => void;
  isSaving: boolean;
  isSubmitting: boolean;
}

export default function ActionButtons({
  selectedPeriod,
  selectedRegion,
  customerCount,
  columnCount,
  periods,
  regions,
  onSaveDraft,
  onSubmitForApproval,
  isSaving,
  isSubmitting,
}: ActionButtonsProps) {
  if (!selectedPeriod || !selectedRegion) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {customerCount} Customers
        </Badge>
        <Badge variant="outline">
          {columnCount} Columns Selected
        </Badge>
        {selectedPeriod && (
          <Badge variant="outline">
            {periods.find(p => p.id === selectedPeriod)?.label}
          </Badge>
        )}
        {selectedRegion && (
          <Badge variant="outline">
            {regions.find(r => r.id === selectedRegion)?.name}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          disabled={columnCount === 0 || isSaving || isSubmitting} 
          onClick={onSaveDraft}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>
        <Button 
          disabled={columnCount === 0 || !selectedPeriod || isSaving || isSubmitting} 
          onClick={onSubmitForApproval}
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </div>
    </div>
  );
}
