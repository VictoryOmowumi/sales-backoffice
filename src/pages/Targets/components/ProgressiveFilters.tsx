import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Region, Period, User } from "@/domain/targets";

interface ProgressiveFiltersProps {
  selectedPeriod: string;
  selectedRegion: string;
  selectedRSM: string;
  regions: Region[];
  periods: Period[];
  availableRSMs: User[];
  onPeriodChange: (periodId: string) => void;
  onRegionChange: (regionId: string) => void;
  onRSMChange: (rsmId: string) => void;
}

export default function ProgressiveFilters({
  selectedPeriod,
  selectedRegion,
  selectedRSM,
  regions,
  periods,
  availableRSMs,
  onPeriodChange,
  onRegionChange,
  onRSMChange,
}: ProgressiveFiltersProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${selectedPeriod ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium">Step 1: Select Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${selectedRegion ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium">Step 2: Select Region</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${selectedRSM ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium">Step 3: Select RSM</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.id} value={period.id}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedRegion} 
            onValueChange={onRegionChange}
            disabled={!selectedPeriod}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedRSM} 
            onValueChange={onRSMChange}
            disabled={!selectedRegion}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="RSM" />
            </SelectTrigger>
            <SelectContent>
              {availableRSMs.map(rsm => (
                <SelectItem key={rsm.id} value={rsm.id}>
                  {rsm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
