import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DropZone = ({ onFilesAdded, acceptedTypes = [], maxSize = 100 * 1024 * 1024 }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragActive(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
    setDragCounter(0);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    // Reset input
    e.target.value = "";
  }, [onFilesAdded]);

  const formatAcceptedTypes = () => {
    if (acceptedTypes.length === 0) return "All file types";
    return acceptedTypes.map(type => type.replace(/\/.*/, "")).join(", ");
  };

  const formatMaxSize = () => {
    const mb = maxSize / (1024 * 1024);
    return `${mb}MB`;
  };

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        isDragActive
          ? "border-primary bg-primary/10 scale-105"
          : "border-gray-600 hover:border-primary/50 hover:bg-surface/30"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        accept={acceptedTypes.join(",")}
      />

      <motion.div
        className="space-y-4"
        animate={isDragActive ? { y: -5 } : { y: 0 }}
      >
        <motion.div
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
            isDragActive
              ? "bg-gradient-to-r from-primary to-secondary"
              : "bg-surface"
          }`}
          animate={isDragActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon 
            name={isDragActive ? "Download" : "Upload"} 
            size={32} 
            className={isDragActive ? "text-white" : "text-primary"} 
          />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-gray-400">
            {isDragActive 
              ? "Release to upload files"
              : "Drag and drop files here, or click to browse"
            }
          </p>
        </div>

        {!isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <Button variant="primary" size="lg">
              <ApperIcon name="FolderOpen" size={20} className="mr-2" />
              Browse Files
            </Button>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p>Accepted formats: {formatAcceptedTypes()}</p>
              <p>Maximum file size: {formatMaxSize()}</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
        animate={isDragActive ? {
          background: "linear-gradient(45deg, #6366F1, #8B5CF6, #6366F1)",
          backgroundSize: "200% 200%",
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default DropZone;