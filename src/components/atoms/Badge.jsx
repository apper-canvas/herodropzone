import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface text-gray-300 border border-gray-700",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    success: "bg-gradient-to-r from-accent to-green-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    secondary: "bg-gray-700 text-gray-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;