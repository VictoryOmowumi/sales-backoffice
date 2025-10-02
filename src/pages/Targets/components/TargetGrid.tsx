import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Target, Package, DollarSign } from "lucide-react";
import SKUColumnHeader from "./SKUColumnHeader";
import FilterDropdown from "./FilterDropdown";
import type { CustomerWithDetails, SKU, User } from "@/domain/targets";

interface TargetGridProps {
  selectedPeriod: string;
  selectedRegion: string;
  selectedRSM: string;
  customersWithDetails: CustomerWithDetails[];
  filteredCustomersWithDetails: CustomerWithDetails[];
  selectedColumns: Array<{
    id: string;
    type: 'sku' | 'weekly' | 'daily';
    skuId?: string;
  }>;
  skus: SKU[];
  teamMembers: { tdms: User[]; tdes: User[] };
  gridData: Record<string, number>;
  onCellChange: (customerId: string, columnId: string, value: number) => void;
  onRemoveColumn: (columnId: string) => void;
  onAddColumn: () => void;
  onSKUSelect: (columnId: string, skuId: string) => void;
  calculateRowTotal: (customerId: string) => number;
  validateCustomerTotals: (customerId: string) => string[];
  skuTargets: Record<string, number>;
  onSkuTargetChange: (skuId: string, value: number) => void;
  filters: {
    customerName: string[];
    customerCode: string[];
    tdm: string[];
    tde: string[];
    dealerType: string[];
    channel: string[];
  };
  updateFilter: (filterType: keyof TargetGridProps['filters'], values: string[]) => void;
  getFilterOptions: (filterType: keyof TargetGridProps['filters']) => string[];
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      <Separator className="mt-3" />
    </div>
  );
}

export default function TargetGrid({
  selectedPeriod,
  selectedRegion,
  selectedRSM,
  customersWithDetails,
  filteredCustomersWithDetails,
  selectedColumns,
  skus,
  teamMembers,
  gridData,
  onCellChange,
  onRemoveColumn,
  onAddColumn,
  onSKUSelect,
  calculateRowTotal,
  validateCustomerTotals,
  skuTargets,
  onSkuTargetChange,
  filters,
  updateFilter,
  getFilterOptions,
}: TargetGridProps) {
  // Show appropriate empty state based on progress
  if (!selectedPeriod) {
    return (
      <Card className="p-6">
        <Header 
          title="Target Grid" 
          subtitle="Enter target values for each customer and SKU combination. Use copy/paste for bulk operations." 
        />
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Step 1: Select Time Period</h3>
            <p className="text-muted-foreground">
              Please select a time period to begin setting targets.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!selectedRegion) {
    return (
      <Card className="p-6">
        <Header 
          title="Target Grid" 
          subtitle="Enter target values for each customer and SKU combination. Use copy/paste for bulk operations." 
        />
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Step 2: Select Region</h3>
            <p className="text-muted-foreground">
              Please select a region to continue.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!selectedRSM) {
    return (
      <Card className="p-6">
        <Header 
          title="Target Grid" 
          subtitle="Enter target values for each customer and SKU combination. Use copy/paste for bulk operations." 
        />
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Step 3: Select RSM</h3>
            <p className="text-muted-foreground">
              Please select an RSM to load the customer hierarchy.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (customersWithDetails.length === 0) {
    return (
      <Card className="p-6">
        <Header 
          title="Target Grid" 
          subtitle="Enter target values for each customer and SKU combination. Use copy/paste for bulk operations." 
        />
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Customers Found</h3>
            <p className="text-muted-foreground">
              No customers found for the selected RSM. Please try a different selection.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6  overflow-x-auto">
      <Header 
        title="Target Grid" 
        subtitle="Enter target values for each customer and SKU combination. Use copy/paste for bulk operations." 
      />
      
      <div className=" overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-500">
            <tr className="border-b">
              <th className="text-left p-2 font-medium bg-muted/50 backdrop-filter:blur-md sticky left-0 z-10 min-w-[150px]">
                <div className="flex items-center gap-2">
                  <span>Customer Name</span>
                  <FilterDropdown
                    title=""
                    options={getFilterOptions('customerName')}
                    selectedValues={filters.customerName}
                    onSelectionChange={(values) => updateFilter('customerName', values)}
                  />
                </div>
              </th>
              <th className="text-left p-2 font-medium bg-muted/50 backdrop-filter:blur-md sticky left-[150px] z-10 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <span>Customer Code</span>
                  <FilterDropdown
                    title=""
                    options={getFilterOptions('customerCode')}
                    selectedValues={filters.customerCode}
                    onSelectionChange={(values) => updateFilter('customerCode', values)}
                  />
                </div>
              </th>
              <th className="text-left p-2 font-medium bg-muted/50 backdrop-filter:blur-md sticky left-[250px] z-10 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <span>TDM</span>
                  <FilterDropdown
                    title=""
                    options={getFilterOptions('tdm')}
                    selectedValues={filters.tdm}
                    onSelectionChange={(values) => updateFilter('tdm', values)}
                  />
                </div>
              </th>
              <th className="text-left p-2 font-medium bg-muted/50 backdrop-filter:blur-md sticky left-[350px] z-10 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <span>TDE</span>
                  <FilterDropdown
                    title=""
                    options={getFilterOptions('tde')}
                    selectedValues={filters.tde}
                    onSelectionChange={(values) => updateFilter('tde', values)}
                  />
                </div>
              </th>
              <th className="text-left p-2 font-medium bg-muted/50 backdrop-filter:blur-md sticky left-[450px] z-10 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <span>Dealer Type</span>
                  <FilterDropdown
                    title=""
                    options={getFilterOptions('dealerType')}
                    selectedValues={filters.dealerType}
                    onSelectionChange={(values) => updateFilter('dealerType', values)}
                  />
                </div>
              </th>
              <th className="text-left p-2 font-medium bg-muted/50 backdrop-filter:blur-md sticky left-[570px] z-10 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <span>Channel</span>
                  <FilterDropdown
                    title=""
                    options={getFilterOptions('channel')}
                    selectedValues={filters.channel}
                    onSelectionChange={(values) => updateFilter('channel', values)}
                  />
                </div>
              </th>
              {selectedColumns.map(column => {
                if (column.type === 'sku') {
                  const selectedSKU = column.skuId ? skus.find(s => s.id === column.skuId) : undefined;
                  return (
                    <th key={column.id} className="text-center p-2 font-medium bg-muted/50 min-w-[120px] relative">
                      <SKUColumnHeader
                        columnId={column.id}
                        availableSKUs={skus}
                        selectedSKU={selectedSKU}
                        allColumns={selectedColumns}
                        onSKUSelect={onSKUSelect}
                        onRemove={onRemoveColumn}
                      />
                    </th>
                  );
                } else {
                  const columnNames: Record<string, string> = {
                    weekly: 'Weekly Target',
                    daily: 'Daily Target'
                  };
                  const columnIcons: Record<string, React.ComponentType<{ className?: string }>> = {
                    weekly: Package,
                    daily: DollarSign
                  };
                  const Icon = columnIcons[column.type];
                  
                  const displayName = columnNames[column.type];
                  
                  return (
                    <th key={column.id} className="text-center p-2 font-medium bg-muted/50 min-w-[120px] relative">
                      <div className="flex flex-col items-center">
                        <Icon className="w-4 h-4 mb-1" />
                        <div className="font-medium text-xs">{displayName}</div>
                        <div className="text-xs text-secondary-foreground">Auto-calculated</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-muted-foreground hover:text-red-500"
                        onClick={() => onRemoveColumn(column.id)}
                      >
                        ×
                      </Button>
                    </th>
                  );
                }
              })}
              <th className="text-center p-2 font-medium bg-muted/50 min-w-[120px]">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={onAddColumn}
                >
                  + Add Column
                </Button>
              </th>
            </tr>
            {/* Target Input Row */}
            <tr className="border-b bg-blue-50/50">
              <td className="p-2 sticky left-0 z-10 bg-blue-50/50 font-medium text-blue-900" colSpan={6}>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>SKU Targets</span>
                </div>
              </td>
              {selectedColumns.map(column => {
                if (column.type === 'sku' && column.skuId) {
                  const skuTarget = skuTargets[column.skuId] || 0;
                  return (
                    <td key={column.id} className="p-1">
                      <div className="flex items-center justify-center">
                        <Input
                          type="number"
                          value={skuTarget}
                          onChange={(e) => onSkuTargetChange(column.skuId!, Number(e.target.value))}
                          className="w-20 h-8 text-center font-medium bg-white border-blue-300 focus:border-blue-500"
                          min="0"
                          step="1"
                          placeholder="0"
                        />
                      </div>
                    </td>
                  );
                } else {
                  return (
                    <td key={column.id} className="p-2 text-center ">
                      <div className="text-xs text-secondary-foreground">Auto-calculated</div>
                    </td>
                  );
                }
              })}
              <td className="p-2 text-center font-medium text-blue-900">
                {selectedColumns
                  .filter(col => col.type === 'sku' && col.skuId)
                  .reduce((sum, col) => sum + (skuTargets[col.skuId!] || 0), 0)}
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredCustomersWithDetails.map((customer) => {
              // Find TDM and TDE for this customer
              const assignedRep = customer.assignedRep;
              const tdm = teamMembers.tdms.find(tdm => 
                assignedRep?.manager_id === tdm.id
              );
              const tde = teamMembers.tdes.find(tde => 
                assignedRep?.manager_id === tde.id
              );
              
              return (
                <tr key={customer.id} className="border-b hover:bg-muted/30">
                  <td className="p-2 sticky left-0 z-10 bg-background">
                    <div className="font-medium">{customer.name}</div>
                  </td>
                  <td className="p-2 sticky left-[150px] z-10 bg-background">
                    <div className="text-sm">{customer.code}</div>
                  </td>
                  <td className="p-2 sticky left-[250px] z-10 bg-background">
                    <div className="text-sm">{tdm?.name || '-'}</div>
                  </td>
                  <td className="p-2 sticky left-[350px] z-10 bg-background">
                    <div className="text-sm">{tde?.name || '-'}</div>
                  </td>
                  <td className="p-2 sticky left-[450px] z-10 bg-background">
                    <div className="text-sm">{customer.dealerType.name}</div>
                  </td>
                  <td className="p-2 sticky left-[570px] z-10 bg-background">
                    <div className="text-sm">{customer.channel.name}</div>
                  </td>
                  {selectedColumns.map(column => {
                    const value = gridData[`${customer.id}-${column.id}`] || 0;
                    const validationErrors = validateCustomerTotals(customer.id);
                    const hasError = validationErrors.length > 0;
                    
                    return (
                      <td key={column.id} className="p-1">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => onCellChange(customer.id, column.id, Number(e.target.value))}
                            className={`w-20 h-8 text-center ${hasError ? 'border-red-500' : ''} ${
                              column.type === 'weekly' || column.type === 'daily' 
                                ? 'bg-muted/30 cursor-not-allowed' 
                                : ''
                            }`}
                            min="0"
                            step="1"
                            readOnly={column.type === 'weekly' || column.type === 'daily'}
                            title={column.type === 'weekly' || column.type === 'daily' ? 'Auto-calculated from SKU totals' : ''}
                          />
                          {hasError && (
                            <div className="text-xs text-red-500" title={validationErrors.join(', ')}>
                              ⚠️
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-2 text-center">
                    {selectedColumns.length === 0 ? (
                      <div className="text-xs text-muted-foreground">Add columns to see totals</div>
                    ) : (
                      <div className="font-medium">
                        {calculateRowTotal(customer.id)}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 bg-muted/50">
              <td className="p-2 font-bold sticky left-0 z-10 bg-muted/50" colSpan={6}>
                Grand Total
              </td>
              {selectedColumns.map(column => {
                const total = filteredCustomersWithDetails.reduce((sum, customer) => 
                  sum + (gridData[`${customer.id}-${column.id}`] || 0), 0
                );
                return (
                  <td key={column.id} className="p-2 text-center font-bold">
                    {total}
                  </td>
                );
              })}
              <td className="p-2 text-center font-bold">
                {selectedColumns
                  .filter(col => col.type === 'sku' && col.skuId)
                  .reduce((sum, col) => 
                    sum + filteredCustomersWithDetails.reduce((customerSum, customer) => 
                      customerSum + (gridData[`${customer.id}-${col.id}`] || 0), 0
                    ), 0
                  )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
