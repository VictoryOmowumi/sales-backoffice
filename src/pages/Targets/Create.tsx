import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProgressiveFilters from "./components/ProgressiveFilters";
import SummaryStats from "./components/SummaryStats";
import AddColumnDialog from "./components/AddColumnDialog";
import TargetGrid from "./components/TargetGrid";
import ActionButtons from "./components/ActionButtons";
import RemoveColumnDialog from "./components/RemoveColumnDialog";
import { useTargetGrid } from "./hooks/useTargetGrid";
import { pricePerCase } from "@/data/targets.mock";

export default function CreateTargets() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    // State
    selectedPeriod,
    selectedRegion,
    selectedRSM,
    selectedColumns,
    gridData,
    isAddColumnOpen,
    
    // Data
    regions,
    periods,
    availableRSMs,
    customersWithDetails,
    teamMembers,
    availableSKUs,
    totalCases,
    totalValue,
    
    // Actions
    setSelectedPeriod,
    handleRegionChange,
    handleRSMChange,
    handleAddColumn,
    handleRemoveColumn,
    handleCellChange,
    handleSKUSelect,
    setIsAddColumnOpen,
    
    // Validation
    calculateRowTotal,
    validateCustomerTotals,
    
    // Configuration
    
    // Column removal confirmation
    columnToRemove,
    setColumnToRemove,
    performColumnRemoval,
    
    // SKU target management
    skuTargets,
    handleSkuTargetChange,
    
    // Regional target validation
    regionalTarget,
    setRegionalTarget,
    calculateTotalSkuTargets,
    validateRegionalTarget,
    
    // Excel-like filters
    filteredCustomersWithDetails,
    filters,
    updateFilter,
    getFilterOptions,
  } = useTargetGrid();

  const handleSaveDraft = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "No columns to save",
        description: "Please add at least one column before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare draft data - only include filtered customers
      const filteredGridData = Object.keys(gridData).reduce((acc, key) => {
        const customerId = key.split('-')[0];
        if (filteredCustomersWithDetails.some(c => c.id === customerId)) {
          acc[key] = gridData[key];
        }
        return acc;
      }, {} as Record<string, number>);

      const filteredTotalCases = selectedColumns
        .filter(col => col.type === 'sku' && col.skuId)
        .reduce((sum, col) => 
          sum + filteredCustomersWithDetails.reduce((customerSum, customer) => 
            customerSum + (gridData[`${customer.id}-${col.id}`] || 0), 0
          ), 0
        );

      const filteredTotalValue = selectedColumns
        .filter(col => col.type === 'sku' && col.skuId)
        .reduce((sum, col) => 
          sum + filteredCustomersWithDetails.reduce((customerSum, customer) => {
            const value = gridData[`${customer.id}-${col.id}`] || 0;
            const sku = availableSKUs.find(s => s.id === col.skuId);
            return customerSum + (value * (sku ? pricePerCase(sku) : 0));
          }, 0)
        , 0);

      const draftData = {
        period: periods.find(p => p.id === selectedPeriod),
        region: regions.find(r => r.id === selectedRegion),
        rsm: availableRSMs.find(r => r.id === selectedRSM),
        columns: selectedColumns,
        gridData: filteredGridData,
        regionalTarget,
        skuTargets,
        totalCases: filteredTotalCases,
        totalValue: filteredTotalValue,
        customerCount: filteredCustomersWithDetails.length,
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would save to the backend
      console.log("Draft saved:", draftData);
      
      toast({
        title: "Draft saved successfully!",
        description: `Targets saved for ${regions.find(r => r.id === selectedRegion)?.name} region.`,
      });
    } catch {
      toast({
        title: "Failed to save draft",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "No columns to submit",
        description: "Please add at least one column before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Check for validation errors
    const hasErrors = customersWithDetails.some(customer => {
      const errors = validateCustomerTotals(customer.id);
      return errors.length > 0;
    });

    if (hasErrors) {
      toast({
        title: "Validation errors found",
        description: "Please fix the validation errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Check regional target validation
    const regionalValidation = validateRegionalTarget();
    if (!regionalValidation.isValid) {
      toast({
        title: "Regional target mismatch",
        description: regionalValidation.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare submission data - only include filtered customers
      const filteredGridData = Object.keys(gridData).reduce((acc, key) => {
        const customerId = key.split('-')[0];
        if (filteredCustomersWithDetails.some(c => c.id === customerId)) {
          acc[key] = gridData[key];
        }
        return acc;
      }, {} as Record<string, number>);

      const filteredTotalCases = selectedColumns
        .filter(col => col.type === 'sku' && col.skuId)
        .reduce((sum, col) => 
          sum + filteredCustomersWithDetails.reduce((customerSum, customer) => 
            customerSum + (gridData[`${customer.id}-${col.id}`] || 0), 0
          ), 0
        );

      const filteredTotalValue = selectedColumns
        .filter(col => col.type === 'sku' && col.skuId)
        .reduce((sum, col) => 
          sum + filteredCustomersWithDetails.reduce((customerSum, customer) => {
            const value = gridData[`${customer.id}-${col.id}`] || 0;
            const sku = availableSKUs.find(s => s.id === col.skuId);
            return customerSum + (value * (sku ? pricePerCase(sku) : 0));
          }, 0)
        , 0);

      const submissionData = {
        period: periods.find(p => p.id === selectedPeriod),
        region: regions.find(r => r.id === selectedRegion),
        rsm: availableRSMs.find(r => r.id === selectedRSM),
        columns: selectedColumns,
        gridData: filteredGridData,
        regionalTarget,
        skuTargets,
        totalCases: filteredTotalCases,
        totalValue: filteredTotalValue,
        customerCount: filteredCustomersWithDetails.length,
        submittedAt: new Date().toISOString(),
        status: "submitted",
      };

      // In a real app, this would submit to the backend
      console.log("Submitted for approval:", submissionData);
      
      toast({
        title: "Submitted for approval!",
        description: `Targets submitted for ${regions.find(r => r.id === selectedRegion)?.name} region. Awaiting manager approval.`,
      });
    } catch {
      toast({
        title: "Failed to submit",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Create Targets</h1>
          <p className="text-muted-foreground mt-1">
            Set new targets using the Excel-like grid interface
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}

      {/* Progressive Filters */}
      <ProgressiveFilters
        selectedPeriod={selectedPeriod}
        selectedRegion={selectedRegion}
        selectedRSM={selectedRSM}
        regions={regions}
        periods={periods}
        availableRSMs={availableRSMs}
        onPeriodChange={setSelectedPeriod}
        onRegionChange={handleRegionChange}
        onRSMChange={handleRSMChange}
      />

      {/* Summary Stats */}
      <SummaryStats
        totalCases={totalCases}
        totalValue={totalValue}
        customerCount={customersWithDetails.length}
        skuCount={availableSKUs.length}
        regionalTarget={regionalTarget}
        setRegionalTarget={setRegionalTarget}
        totalSkuTargets={calculateTotalSkuTargets()}
        regionalValidation={validateRegionalTarget()}
      />

      {/* Add Column Dialog */}
      <AddColumnDialog
        isOpen={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        onAddColumn={handleAddColumn}
      />

      {/* Remove Column Confirmation Dialog */}
      <RemoveColumnDialog
        isOpen={!!columnToRemove}
        onOpenChange={(open) => !open && setColumnToRemove(null)}
        onConfirm={() => columnToRemove && performColumnRemoval(columnToRemove)}
        columnType={selectedColumns.find(c => c.id === columnToRemove)?.type || 'sku'}
        hasAssociatedColumns={selectedColumns.some(c => c.type === 'weekly' || c.type === 'daily')}
      />

      {/* Target Grid */}
      <TargetGrid
        selectedPeriod={selectedPeriod}
        selectedRegion={selectedRegion}
        selectedRSM={selectedRSM}
        customersWithDetails={customersWithDetails}
        filteredCustomersWithDetails={filteredCustomersWithDetails}
        selectedColumns={selectedColumns}
        skus={availableSKUs}
        teamMembers={teamMembers}
        gridData={gridData}
        onCellChange={handleCellChange}
        onRemoveColumn={handleRemoveColumn}
        onAddColumn={() => setIsAddColumnOpen(true)}
        onSKUSelect={handleSKUSelect}
        calculateRowTotal={calculateRowTotal}
        validateCustomerTotals={validateCustomerTotals}
        skuTargets={skuTargets}
        onSkuTargetChange={handleSkuTargetChange}
        filters={filters}
        updateFilter={updateFilter}
        getFilterOptions={getFilterOptions}
      />

      {/* Action Buttons */}
      <ActionButtons
        selectedPeriod={selectedPeriod}
        selectedRegion={selectedRegion}
        customerCount={customersWithDetails.length}
        columnCount={selectedColumns.length}
        periods={periods}
        regions={regions}
        onSaveDraft={handleSaveDraft}
        onSubmitForApproval={handleSubmitForApproval}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
