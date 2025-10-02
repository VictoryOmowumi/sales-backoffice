import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { SKU } from "@/domain/targets";

interface SKUColumnHeaderProps {
  columnId: string;
  availableSKUs: SKU[];
  selectedSKU?: SKU;
  allColumns: Array<{ id: string; type: string; skuId?: string }>;
  onSKUSelect: (columnId: string, skuId: string) => void;
  onRemove: (columnId: string) => void;
}

export default function SKUColumnHeader({
  columnId,
  availableSKUs,
  selectedSKU,
  allColumns,
  onSKUSelect,
  onRemove,
}: SKUColumnHeaderProps) {
  // Get selected SKU IDs from all columns (except current one)
  const selectedSKUIds = allColumns
    .filter(col => col.id !== columnId && col.type === 'sku' && col.skuId)
    .map(col => col.skuId!);
  
  // Filter out already selected SKUs (except the current one)
  const filteredSKUs = availableSKUs.filter(sku => 
    !selectedSKUIds.includes(sku.id) || sku.id === selectedSKU?.id
  );

  if (selectedSKU) {
    return (
      <div className="text-center  h-full ">
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground line-clamp-1">{selectedSKU.name}</div>
          <div className="text-xs text-muted-foreground ">{selectedSKU.code}</div>
          <div className="text-xs text-blue-600 font-medium">Auto-distributed</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 -right-1 h-4 w-4 p-0 text-muted-foreground hover:text-red-500"
          onClick={() => onRemove(columnId)}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center p-2 font-medium bg-muted/50 min-w-[120px] relative">
      <Select onValueChange={(skuId) => onSKUSelect(columnId, skuId)}>
        <SelectTrigger className="w-full h-8 text-xs border-dashed border-2 border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors">
          <SelectValue placeholder="Select SKU" />
        </SelectTrigger>
        <SelectContent>
          {filteredSKUs.map(sku => (
            <SelectItem key={sku.id} value={sku.id}>
              <div className="flex flex-col items-start">
                <div className="font-medium text-sm line-clamp-1">{sku.name}</div>
                <div className="text-xs text-muted-foreground">{sku.code}</div>
                <div className="text-xs text-muted-foreground">
                  {sku.category} • {sku.size_ml}ml • {sku.pack_type}
                </div>
              </div>
            </SelectItem>
          ))}
          {filteredSKUs.length === 0 && (
            <SelectItem value="no-skus" disabled>
              No SKUs available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-muted-foreground hover:text-red-500"
        onClick={() => onRemove(columnId)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
