// src/pages/Targets/components/DimensionColumnHeader.tsx

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { SKU } from "@/domain/targets";
import type { TargetDimensionColumn } from "../hooks/useNationalTargetGrid";
import { ORG_CHANNEL_OPTIONS } from "@/config/org";
import { targetsData } from "@/data/targets.mock";

interface DimensionColumnHeaderProps {
  column: TargetDimensionColumn;
  allColumns: TargetDimensionColumn[];
  onSelect: (columnId: string, refId: string, label?: string) => void;
  onRemove: (columnId: string) => void;
}

export function DimensionColumnHeader({
  column,
  allColumns,
  onSelect,
  onRemove,
}: DimensionColumnHeaderProps) {
  const skus = targetsData.skus;
  const brands = Array.from(new Set(skus.map(s => s.brand)));
  const categories = Array.from(new Set(skus.map(s => s.category)));
  const channels = ORG_CHANNEL_OPTIONS;

  // Get selected refIds from other columns of the same type (to prevent duplicates)
  const selectedRefIds = allColumns
    .filter(c => c.id !== column.id && c.type === column.type && c.refId)
    .map(c => c.refId!);

  // Get options based on column type
  const getOptions = (): Array<{ id: string; label: string; subtitle?: string }> => {
    switch (column.type) {
      case 'sku':
        return skus
          .filter(sku => !selectedRefIds.includes(sku.id))
          .map(sku => ({
            id: sku.id,
            label: sku.name,
            subtitle: `${sku.code} • ${sku.category} • ${sku.size_ml}ml`,
          }));
      case 'brand':
        return brands
          .filter(brand => !selectedRefIds.includes(brand))
          .map(brand => ({ id: brand, label: brand }));
      case 'category':
        return categories
          .filter(cat => !selectedRefIds.includes(cat))
          .map(cat => ({ id: cat, label: cat }));
      case 'channel':
        return channels
          .filter(ch => !selectedRefIds.includes(ch))
          .map(ch => ({ id: ch, label: ch }));
      default:
        return [];
    }
  };

  const options = getOptions();
  const selectedOption = options.find(opt => opt.id === column.refId);

  // Get display label for selected option
  const getDisplayLabel = (): string => {
    if (!column.refId) return '';
    
    switch (column.type) {
      case 'sku':
        const sku = skus.find(s => s.id === column.refId);
        return sku ? `${sku.name} (${sku.code})` : '';
      case 'brand':
      case 'category':
      case 'channel':
        return column.refId;
      default:
        return '';
    }
  };

  // For weekly/daily, show as calculated
  if (column.type === 'weekly' || column.type === 'daily') {
    return (
      <div className="text-center p-2 font-medium bg-muted/50 min-w-[120px] relative">
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">
            {column.type === 'weekly' ? 'Weekly Target' : 'Daily Target'}
          </div>
          <div className="text-xs text-blue-600 font-medium">Auto-calculated</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-muted-foreground hover:text-red-500"
          onClick={() => onRemove(column.id)}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  // For dimension columns that need selection
  if (selectedOption) {
    return (
      <div className="text-center h-full relative">
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground line-clamp-1">
            {getDisplayLabel()}
          </div>
          <div className="text-xs text-blue-600 font-medium">Auto-distributed</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 -right-1 h-4 w-4 p-0 text-muted-foreground hover:text-red-500"
          onClick={() => onRemove(column.id)}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center p-2 font-medium bg-muted/50 min-w-[120px] relative">
      <Select
        onValueChange={(refId) => {
          const option = options.find(opt => opt.id === refId);
          onSelect(column.id, refId, option?.label);
        }}
        value={column.refId || undefined}
      >
        <SelectTrigger className="w-full h-8 text-xs border-dashed border-2 border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors">
          <SelectValue placeholder={`Select ${column.type}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.id} value={opt.id}>
              <div className="flex flex-col items-start">
                <div className="font-medium text-sm line-clamp-1">{opt.label}</div>
                {opt.subtitle && (
                  <div className="text-xs text-muted-foreground">{opt.subtitle}</div>
                )}
              </div>
            </SelectItem>
          ))}
          {options.length === 0 && (
            <SelectItem value="no-options" disabled>
              No options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-muted-foreground hover:text-red-500"
        onClick={() => onRemove(column.id)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

