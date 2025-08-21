import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({
  src,
  alt,
  initials,
  size = "md",
  className,
  ...props
}, ref) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  const getInitialsColor = (initials) => {
    if (!initials) return "bg-secondary-500";
    const colors = [
      "bg-red-500",
      "bg-orange-500", 
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500"
    ];
    
    const charCode = initials.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-full flex items-center justify-center font-medium text-white",
        sizes[size],
        getInitialsColor(initials),
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;