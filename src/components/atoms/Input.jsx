import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  label,
  error,
  helper,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none transition-colors duration-200",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-secondary-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;