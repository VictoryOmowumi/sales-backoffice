import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";

interface FilterDropdownProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
}

export default function FilterDropdown({
  title,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Search...",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter(v => v !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(filteredOptions);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
    setIsOpen(false);
  };

  const hasActiveFilters = selectedValues.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8  text-xs font-medium relative ${
            hasActiveFilters ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Filter className="w-2 h-2" strokeWidth={1} />
          {title}
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
              {selectedValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Filter by {title}</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="h-6 px-2 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        
        <div className="p-2 border-b">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="h-6 px-2 text-xs flex-1"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs flex-1"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No options found
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={selectedValues.includes(option)}
                    onCheckedChange={() => handleToggleOption(option)}
                  />
                  <label
                    htmlFor={option}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
