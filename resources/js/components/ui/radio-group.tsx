import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Pass the context through
  const contextValue = React.useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [value, handleValueChange]
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div ref={ref} className={cn("grid gap-2", className)} {...props} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const useRadioGroupContext = () => React.useContext(RadioGroupContext);

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, children, value, ...props }, ref) => {
  const context = useRadioGroupContext();
  const checked = context.value === value;

  return (
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={() => context.onValueChange?.(value as string)}
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-slate-500 text-slate-900 ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:ring-offset-slate-950 dark:focus:ring-slate-300",
        className
      )}
      {...props}
      data-state={checked ? "checked" : "unchecked"}
    />
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
