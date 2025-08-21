import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const ProgressBar = React.forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  variant = "primary",
  animated = false,
  showPercentage = false,
  ...props 
}, ref) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: "from-primary to-secondary",
    success: "from-accent to-green-600",
    warning: "from-yellow-500 to-orange-500",
    danger: "from-red-500 to-red-600"
  };

  return (
    <div className={cn("space-y-2", className)} ref={ref} {...props}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full transition-all duration-300",
            variants[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;