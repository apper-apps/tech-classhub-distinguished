import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}, ref) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-700",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700 border border-accent-300",
    grade: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 border border-primary-300"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;