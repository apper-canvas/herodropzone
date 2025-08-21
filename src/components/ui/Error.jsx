import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  description 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ApperIcon name="AlertCircle" size={40} className="text-red-400" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
      
      {description && (
        <p className="text-gray-400 mb-6 max-w-md">{description}</p>
      )}
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RotateCcw" size={20} className="mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;