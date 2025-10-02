import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, DollarSign, Plus } from "lucide-react";

interface AddColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (type: 'sku' | 'weekly' | 'daily', skuId?: string) => void;
}

export default function AddColumnDialog({
  isOpen,
  onOpenChange,
  onAddColumn,
}: AddColumnDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Column</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Choose the type of column you want to add
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* SKU Column */}
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onAddColumn('sku')}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">SKU Column</div>
                  <div className="text-sm text-muted-foreground">
                    Add a product column with auto-distributed targets
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            </div>
            
            
            {/* Weekly Target Column */}
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onAddColumn('weekly')}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Weekly Target</div>
                  <div className="text-sm text-muted-foreground">
                    Weekly target calculated from row total (÷ 4)
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            </div>
            
            {/* Daily Target Column */}
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onAddColumn('daily')}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Daily Target</div>
                  <div className="text-sm text-muted-foreground">
                    Daily target calculated from row total (÷ 30)
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
