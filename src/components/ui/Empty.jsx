import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No files uploaded yet", 
  description = "Upload your first file to get started",
  actionLabel = "Upload Files",
  onAction,
  icon = "Upload"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <ApperIcon name={icon} size={48} className="text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;