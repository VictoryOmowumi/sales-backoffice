import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface RemoveColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  columnType: 'sku' | 'weekly' | 'daily';
  hasAssociatedColumns: boolean;
}

export default function RemoveColumnDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  columnType,
  hasAssociatedColumns,
}: RemoveColumnDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getColumnTypeName = () => {
    switch (columnType) {
      case 'sku': return 'SKU Column';
      case 'weekly': return 'Weekly Target Column';
      case 'daily': return 'Daily Target Column';
      default: return 'Column';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Remove {getColumnTypeName()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasAssociatedColumns && columnType === 'sku' ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Removing this SKU column will also remove all associated Weekly and Daily target columns.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800 font-medium">
                  ⚠️ This action will delete all target data for:
                </p>
                <ul className="text-sm text-orange-700 mt-2 space-y-1">
                  <li>• The SKU column</li>
                  <li>• All Weekly target columns</li>
                  <li>• All Daily target columns</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Are you sure you want to continue?
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to remove this {getColumnTypeName().toLowerCase()}?
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  This will delete all target data for this column. This action cannot be undone.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Remove Column{hasAssociatedColumns && columnType === 'sku' ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
