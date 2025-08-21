import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  children,
  className,
  hover = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
        hover && "transition-all duration-200 hover:shadow-lg hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;