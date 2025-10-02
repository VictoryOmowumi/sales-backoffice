"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface DateInputProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const [inputValue, setInputValue] = React.useState(
    value.toLocaleDateString("en-CA") // YYYY-MM-DD format
  );

  React.useEffect(() => {
    setInputValue(value.toLocaleDateString("en-CA"));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Parse the date and validate
    const date = new Date(newValue);
    if (!isNaN(date.getTime()) && newValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      onChange(date);
    }
  };

  const handleBlur = () => {
    // Reset to valid date if input is invalid
    const date = new Date(inputValue);
    if (isNaN(date.getTime()) || !inputValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setInputValue(value.toLocaleDateString("en-CA"));
    }
  };

  return (
    <Input
      type="date"
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      className={cn("w-32", className)}
    />
  );
};
