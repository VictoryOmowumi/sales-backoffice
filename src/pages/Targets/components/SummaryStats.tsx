import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmtMoney, fmtNum } from "@/lib/format";
import { Target, DollarSign, Users, Package, AlertCircle } from "lucide-react";

interface SummaryStatsProps {
  totalCases: number;
  totalValue: number;
  customerCount: number;
  skuCount: number;
  regionalTarget: number;
  setRegionalTarget: (value: number) => void;
  totalSkuTargets: number;
  regionalValidation: { isValid: boolean; message: string };
}

export default function SummaryStats({
  totalCases,
  totalValue,
  customerCount,
  skuCount,
  regionalTarget,
  setRegionalTarget,
  totalSkuTargets,
  regionalValidation,
}: SummaryStatsProps) {
  return (
    <div className="space-y-4">
      {/* Regional Target Input */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="regional-target" className="text-sm font-medium">
              Regional Target (Cases)
            </Label>
            <Input
              id="regional-target"
              type="number"
              value={regionalTarget}
              onChange={(e) => setRegionalTarget(Number(e.target.value))}
              className="mt-1"
              min="0"
              step="1"
            />
          </div>
          <div className="flex-1">
            <Label className="text-sm font-medium">
              SKU Targets Total
            </Label>
            <div className={`mt-1 text-2xl font-bold ${regionalValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {fmtNum(totalSkuTargets)}
            </div>
          </div>
          {!regionalValidation.isValid && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{regionalValidation.message}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{fmtNum(totalCases)}</div>
            <div className="text-sm text-muted-foreground">Total Cases</div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{fmtMoney(totalValue)}</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{customerCount}</div>
            <div className="text-sm text-muted-foreground">Customers</div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{skuCount}</div>
            <div className="text-sm text-muted-foreground">SKUs</div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
