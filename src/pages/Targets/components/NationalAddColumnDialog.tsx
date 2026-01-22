// src/pages/Targets/components/NationalAddColumnDialog.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, FolderTree, Tags, Layers3, CalendarDays, Clock, Plus } from "lucide-react";
import type { DimensionType } from "../hooks/useNationalTargetGrid";

interface NationalAddColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (type: DimensionType) => void;
}

export function NationalAddColumnDialog({
  isOpen,
  onOpenChange,
  onAddColumn,
}: NationalAddColumnDialogProps) {
  const items: Array<{
    type: DimensionType;
    label: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      type: "sku",
      label: "SKU",
      description: "Target for a specific product SKU",
      Icon: Package,
    },
    {
      type: "brand",
      label: "Brand",
      description: "Target for a specific brand (e.g. Pepsi, Aquafina)",
      Icon: Tags,
    },
    {
      type: "category",
      label: "Category",
      description: "RGB, PET, Water, Energy etc.",
      Icon: Layers3,
    },
    {
      type: "channel",
      label: "Channel",
      description: "Modern Trade, General Trade, HORECA…",
      Icon: FolderTree,
    },
    {
      type: "weekly",
      label: "Weekly Target",
      description: "Auto-calculated from row total ÷ 4",
      Icon: CalendarDays,
    },
    {
      type: "daily",
      label: "Daily Target",
      description: "Auto-calculated from row total ÷ 30",
      Icon: Clock,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Plus className="w-4 h-4 mr-1" />
          Add column
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add dimension column</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose what you want to allocate against each region. You can mix SKUs, brands,
            categories, and channels on the same grid.
          </p>

          <div className="grid gap-3">
            {items.map(({ type, label, description, Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => onAddColumn(type)}
                className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/60 transition-colors"
              >
                <span className="rounded-lg bg-muted p-2">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </span>
                <Button size="sm" variant="outline" className="text-xs">
                  Add
                </Button>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

