import { useState, useMemo } from "react";
import { targetsData, buildCustomerWithDetails, pricePerCase } from "@/data/targets.mock";

export function useTargetGrid() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedRSM, setSelectedRSM] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState<Array<{
    id: string;
    type: 'sku' | 'weekly' | 'daily';
    skuId?: string;
  }>>([]);
  const [gridData, setGridData] = useState<Record<string, number>>({});
  const [isAddColumnOpen, setIsAddColumnOpen] = useState<boolean>(false);
  const [regionalTarget, setRegionalTarget] = useState(10000); // Regional target for validation
  const [columnToRemove, setColumnToRemove] = useState<string | null>(null);
  const [skuTargets, setSkuTargets] = useState<Record<string, number>>({}); // Target values for each SKU
  
  // Excel-like filters for customer columns
  const [filters, setFilters] = useState<{
    customerName: string[];
    customerCode: string[];
    tdm: string[];
    tde: string[];
    dealerType: string[];
    channel: string[];
  }>({
    customerName: [],
    customerCode: [],
    tdm: [],
    tde: [],
    dealerType: [],
    channel: [],
  });

  // Get unique values for filters
  const regions = targetsData.regions;
  const periods = targetsData.periods;
  const users = targetsData.users;
  const allRSMs = users.filter(u => u.role === "RSM");

  // Progressive filtering logic
  const availableRSMs = useMemo(() => {
    if (!selectedRegion) return [];
    return allRSMs.filter(rsm => rsm.region_id === selectedRegion);
  }, [selectedRegion, allRSMs]);

  const customersWithDetails = useMemo(() => {
    if (!selectedRSM) return [];
    const rsm = availableRSMs.find(r => r.id === selectedRSM);
    if (!rsm) return [];
    
    return targetsData.customers
      .filter(c => c.region_id === selectedRegion)
      .map(customer => buildCustomerWithDetails(customer, regions, targetsData.channels, targetsData.dealerTypes, users));
  }, [selectedRSM, selectedRegion, availableRSMs, regions, users]);

  // Get TDMs and TDEs for the selected RSM
  const teamMembers = useMemo(() => {
    if (!selectedRSM) return { tdms: [], tdes: [] };
    const rsm = availableRSMs.find(r => r.id === selectedRSM);
    if (!rsm) return { tdms: [], tdes: [] };
    
    const tdms = users.filter(u => u.role === "TDM" && u.manager_id === rsm.id);
    const tdes = users.filter(u => u.role === "TDE" && u.manager_id === rsm.id);
    
    return { tdms, tdes };
  }, [selectedRSM, availableRSMs, users]);

  // Get all SKUs for selection
  const availableSKUs = useMemo(() => {
    return targetsData.skus;
  }, []);

  // Reset functions
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedRSM("");
    setSelectedColumns([]);
    setGridData({});
  };

  const handleRSMChange = (rsmId: string) => {
    setSelectedRSM(rsmId);
    setSelectedColumns([]);
    setGridData({});
  };

  // Column management
  const handleAddColumn = (type: 'sku' | 'weekly' | 'daily', skuId?: string, parentSkuId?: string) => {
    const newColumn = {
      id: `${type}-${Date.now()}`,
      type,
      skuId,
      parentSkuId
    };
    setSelectedColumns(prev => [...prev, newColumn]);
    
    // Auto-fill weekly/daily columns with calculated values
    if (type === 'weekly' || type === 'daily') {
      const newGridData = { ...gridData };
      
      customersWithDetails.forEach(customer => {
        // Calculate row total (sum of all SKU values for this customer)
        const rowTotal = selectedColumns
          .filter(col => col.type === 'sku' && col.skuId)
          .reduce((sum, col) => sum + (gridData[`${customer.id}-${col.id}`] || 0), 0);
        
        if (rowTotal > 0) {
          if (type === 'weekly') {
            // Weekly target = Row total ÷ 4
            newGridData[`${customer.id}-${newColumn.id}`] = Math.round(rowTotal / 4);
          } else if (type === 'daily') {
            // Daily target = Row total ÷ 30
            newGridData[`${customer.id}-${newColumn.id}`] = Math.round(rowTotal / 30);
          }
        }
      });
      
      setGridData(newGridData);
    }
    
    setIsAddColumnOpen(false);
  };

  // Handle SKU selection for a column
  const handleSKUSelect = (columnId: string, skuId: string) => {
    setSelectedColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, skuId } : col
    ));

    // Auto-distribute targets when SKU is selected
    autoDistributeTargets(columnId, skuId);
  };

  // Auto-distribute targets based on customer characteristics
  const autoDistributeTargets = (columnId: string, skuId: string) => {
    if (customersWithDetails.length === 0) return;

    const newGridData = { ...gridData };
    
    // Get SKU details for distribution logic
    const sku = availableSKUs.find(s => s.id === skuId);
    if (!sku) return;

    // Get the target value for this SKU (default to 1000 if not set)
    const skuTarget = skuTargets[skuId] || 1000;
    
    // Create distribution weights based on customer characteristics
    const customerWeights = customersWithDetails.map(customer => {
      let weight = 1; // Base weight
      
      // Channel-based weighting
      switch (customer.channel.name) {
        case 'Modern Trade':
          weight *= 2.5; // Modern trade gets higher targets
          break;
        case 'General Trade':
          weight *= 1.5;
          break;
        case 'HORECA':
          weight *= 2.0;
          break;
        default:
          weight *= 1.0;
      }
      
      // Customer type weighting
      switch (customer.dealerType.name) {
        case 'Key Distributor':
          weight *= 3.0; // Key Distributors get highest targets
          break;
        case 'Wholesaler':
          weight *= 2.0;
          break;
        case 'Retailer':
          weight *= 1.0;
          break;
        default:
          weight *= 1.0;
      }
      
      return { customerId: customer.id, weight };
    });

    // Calculate total weight
    const totalWeight = customerWeights.reduce((sum, cw) => sum + cw.weight, 0);
    
    // Distribute targets proportionally for this specific SKU
    customerWeights.forEach(({ customerId, weight }) => {
      const target = Math.round((weight / totalWeight) * skuTarget);
      newGridData[`${customerId}-${columnId}`] = target;
    });
    
    setGridData(newGridData);
  };

  // Auto-distribute targets with a specific value (for immediate updates)
  const autoDistributeTargetsWithValue = (columnId: string, skuId: string, targetValue: number) => {
    if (customersWithDetails.length === 0) return;

    const newGridData = { ...gridData };
    
    // Get SKU details for distribution logic
    const sku = availableSKUs.find(s => s.id === skuId);
    if (!sku) return;

    // Create distribution weights based on customer characteristics
    const customerWeights = customersWithDetails.map(customer => {
      let weight = 1; // Base weight
      
      // Channel-based weighting
      switch (customer.channel.name) {
        case 'Modern Trade':
          weight *= 2.5; // Modern trade gets higher targets
          break;
        case 'General Trade':
          weight *= 1.5;
          break;
        case 'HORECA':
          weight *= 2.0;
          break;
        default:
          weight *= 1.0;
      }
      
      // Customer type weighting
      switch (customer.dealerType.name) {
        case 'Key Distributor':
          weight *= 3.0; // Key Distributors get highest targets
          break;
        case 'Wholesaler':
          weight *= 2.0;
          break;
        case 'Retailer':
          weight *= 1.0;
          break;
        default:
          weight *= 1.0;
      }
      
      return { customerId: customer.id, weight };
    });

    // Calculate total weight
    const totalWeight = customerWeights.reduce((sum, cw) => sum + cw.weight, 0);
    
    // Distribute targets proportionally for this specific SKU
    customerWeights.forEach(({ customerId, weight }) => {
      const target = Math.round((weight / totalWeight) * targetValue);
      newGridData[`${customerId}-${columnId}`] = target;
    });
    
    setGridData(newGridData);
  };

  // Handle SKU target changes and redistribute
  const handleSkuTargetChange = (skuId: string, value: number) => {
    setSkuTargets(prev => ({ ...prev, [skuId]: value }));
    
    // Find the SKU column and redistribute with the new value
    const skuColumn = selectedColumns.find(col => col.type === 'sku' && col.skuId === skuId);
    if (skuColumn) {
      autoDistributeTargetsWithValue(skuColumn.id, skuId, value);
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    const column = selectedColumns.find(c => c.id === columnId);
    if (!column) return;
    
    // If removing a SKU column, check if there are any weekly/daily columns
    if (column.type === 'sku') {
      const hasWeeklyDailyColumns = selectedColumns.some(c => 
        c.type === 'weekly' || c.type === 'daily'
      );
      
      if (hasWeeklyDailyColumns) {
        // Show confirmation dialog
        setColumnToRemove(columnId);
        return;
      }
    }
    
    // Proceed with removal
    performColumnRemoval(columnId);
  };

  const performColumnRemoval = (columnId: string) => {
    const column = selectedColumns.find(c => c.id === columnId);
    if (!column) return;
    
    // If removing a SKU column, also remove all weekly/daily columns
    if (column.type === 'sku') {
      const weeklyDailyColumns = selectedColumns.filter(c => 
        c.type === 'weekly' || c.type === 'daily'
      );
      
      // Remove the SKU column and all weekly/daily columns
      setSelectedColumns(prev => prev.filter(c => 
        c.id !== columnId && !weeklyDailyColumns.some(wdc => wdc.id === c.id)
      ));
      
      // Clean up grid data for all removed columns
      const newGridData = { ...gridData };
      const columnsToRemove = [columnId, ...weeklyDailyColumns.map(wdc => wdc.id)];
      
      Object.keys(newGridData).forEach(key => {
        if (columnsToRemove.some(colId => key.endsWith(`-${colId}`))) {
          delete newGridData[key];
        }
      });
      setGridData(newGridData);
    } else {
      // For weekly/daily columns, just remove the specific column
      setSelectedColumns(prev => prev.filter(c => c.id !== columnId));
      
      // Clean up grid data for this column
      const newGridData = { ...gridData };
      Object.keys(newGridData).forEach(key => {
        if (key.endsWith(`-${columnId}`)) {
          delete newGridData[key];
        }
      });
      setGridData(newGridData);
    }
    
    // Clear the confirmation state
    setColumnToRemove(null);
  };

  // Cell management
  const handleCellChange = (customerId: string, columnId: string, value: number) => {
    const key = `${customerId}-${columnId}`;
    setGridData(prev => ({
      ...prev,
      [key]: value
    }));

    // Auto-update weekly/daily columns when SKU values change
    const column = selectedColumns.find(col => col.id === columnId);
    if (column && column.type === 'sku') {
      const newGridData = { ...gridData, [key]: value };
      
      // Find all weekly and daily columns (they calculate from row total)
      const weeklyColumns = selectedColumns.filter(col => col.type === 'weekly');
      const dailyColumns = selectedColumns.filter(col => col.type === 'daily');
      
      // Recalculate weekly targets based on row total
      weeklyColumns.forEach(weeklyCol => {
        const rowTotal = selectedColumns
          .filter(col => col.type === 'sku' && col.skuId)
          .reduce((sum, col) => {
            const cellKey = `${customerId}-${col.id}`;
            return sum + (newGridData[cellKey] || 0);
          }, 0);
        
        if (rowTotal > 0) {
          newGridData[`${customerId}-${weeklyCol.id}`] = Math.round(rowTotal / 4);
        }
      });
      
      // Recalculate daily targets based on row total
      dailyColumns.forEach(dailyCol => {
        const rowTotal = selectedColumns
          .filter(col => col.type === 'sku' && col.skuId)
          .reduce((sum, col) => {
            const cellKey = `${customerId}-${col.id}`;
            return sum + (newGridData[cellKey] || 0);
          }, 0);
        
        if (rowTotal > 0) {
          newGridData[`${customerId}-${dailyCol.id}`] = Math.round(rowTotal / 30);
        }
      });
      
      setGridData(newGridData);
    }
  };

  // Calculate total of all SKU targets
  const calculateTotalSkuTargets = () => {
    return Object.values(skuTargets).reduce((sum, target) => sum + target, 0);
  };

  // Get filtered customers based on Excel-like filters
  const filteredCustomersWithDetails = useMemo(() => {
    return customersWithDetails.filter(customer => {
      // Find TDM and TDE for this customer
      const assignedRep = customer.assignedRep;
      const tdm = teamMembers.tdms.find(tdm => 
        assignedRep?.manager_id === tdm.id
      );
      const tde = teamMembers.tdes.find(tde => 
        assignedRep?.manager_id === tde.id
      );

      // Apply filters
      if (filters.customerName.length > 0 && !filters.customerName.includes(customer.name)) return false;
      if (filters.customerCode.length > 0 && !filters.customerCode.includes(customer.code)) return false;
      if (filters.tdm.length > 0 && (!tdm || !filters.tdm.includes(tdm.name))) return false;
      if (filters.tde.length > 0 && (!tde || !filters.tde.includes(tde.name))) return false;
      if (filters.dealerType.length > 0 && !filters.dealerType.includes(customer.dealerType.name)) return false;
      if (filters.channel.length > 0 && !filters.channel.includes(customer.channel.name)) return false;

      return true;
    });
  }, [customersWithDetails, teamMembers, filters]);

  // Filter management functions
  const updateFilter = (filterType: keyof typeof filters, values: string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: values }));
  };

  const clearAllFilters = () => {
    setFilters({
      customerName: [],
      customerCode: [],
      tdm: [],
      tde: [],
      dealerType: [],
      channel: [],
    });
  };

  const getFilterOptions = (filterType: keyof typeof filters) => {
    switch (filterType) {
      case 'customerName':
        return [...new Set(customersWithDetails.map(c => c.name))].sort();
      case 'customerCode':
        return [...new Set(customersWithDetails.map(c => c.code))].sort();
      case 'tdm':
        return [...new Set(teamMembers.tdms.map(t => t.name))].sort();
      case 'tde':
        return [...new Set(teamMembers.tdes.map(t => t.name))].sort();
      case 'dealerType':
        return [...new Set(customersWithDetails.map(c => c.dealerType.name))].sort();
      case 'channel':
        return [...new Set(customersWithDetails.map(c => c.channel.name))].sort();
      default:
        return [];
    }
  };

  // Validation functions
  const calculateRowTotal = (customerId: string) => {
    return selectedColumns
      .filter(col => col.type === 'sku' && col.skuId)
      .reduce((sum, col) => sum + (gridData[`${customerId}-${col.id}`] || 0), 0);
  };

  const calculateWeeklyTotal = (customerId: string) => {
    const weeklyValue = gridData[`${customerId}-weekly`] || 0;
    return weeklyValue * 4; // 4 weeks in a month
  };

  const calculateDailyTotal = (customerId: string) => {
    const dailyValue = gridData[`${customerId}-daily`] || 0;
    return dailyValue * 30; // 30 days in a month
  };

  const validateCustomerTotals = (customerId: string) => {
    const rowTotal = calculateRowTotal(customerId);
    const weeklyTotal = calculateWeeklyTotal(customerId);
    const dailyTotal = calculateDailyTotal(customerId);
    
    const errors = [];
    if (weeklyTotal > 0 && Math.abs(weeklyTotal - rowTotal) > 0.01) {
      errors.push(`Weekly total (${weeklyTotal}) doesn't match Row Total (${rowTotal})`);
    }
    if (dailyTotal > 0 && Math.abs(dailyTotal - rowTotal) > 0.01) {
      errors.push(`Daily total (${dailyTotal}) doesn't match Row Total (${rowTotal})`);
    }
    
    return errors;
  };

  // Validate regional target vs SKU targets
  const validateRegionalTarget = () => {
    const totalSkuTargets = calculateTotalSkuTargets();
    const difference = Math.abs(totalSkuTargets - regionalTarget);
    
    if (difference > 1) { // Allow 1 case difference for rounding
      return {
        isValid: false,
        message: `SKU targets (${totalSkuTargets}) don't match regional target (${regionalTarget}). Difference: ${difference} cases.`
      };
    }
    
    return { isValid: true, message: '' };
  };

  // Calculate overall totals
  const totalCases = selectedColumns
    .filter(col => col.type === 'sku' && col.skuId)
    .reduce((sum, col) => 
      sum + customersWithDetails.reduce((customerSum, customer) => 
        customerSum + (gridData[`${customer.id}-${col.id}`] || 0), 0
      ), 0
    );

  const totalValue = selectedColumns
    .filter(col => col.type === 'sku' && col.skuId)
    .reduce((sum, col) => 
      sum + customersWithDetails.reduce((customerSum, customer) => {
        const value = gridData[`${customer.id}-${col.id}`] || 0;
        const sku = targetsData.skus.find(s => s.id === col.skuId);
        return customerSum + (value * (sku ? pricePerCase(sku) : 0));
      }, 0)
    , 0);

  return {
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
    filteredCustomersWithDetails,
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
    calculateTotalSkuTargets,
    validateRegionalTarget,
    
    // Configuration
    regionalTarget,
    setRegionalTarget,
    
    // Column removal confirmation
    columnToRemove,
    setColumnToRemove,
    performColumnRemoval,
    
    // SKU target management
    skuTargets,
    handleSkuTargetChange,
    
    // Excel-like filters
    filters,
    updateFilter,
    clearAllFilters,
    getFilterOptions,
  };
}
