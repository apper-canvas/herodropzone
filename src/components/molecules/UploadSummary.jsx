import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/atoms/ProgressBar";
import Button from "@/components/atoms/Button";
import { formatFileSize } from "@/utils/fileUtils";

const UploadSummary = ({ 
  files, 
  onClearCompleted, 
  onClearAll, 
  onRetryFailed 
}) => {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === "completed").length;
  const failedFiles = files.filter(f => f.status === "failed").length;
  const uploadingFiles = files.filter(f => f.status === "uploading").length;
  
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const uploadedSize = files
    .filter(f => f.status === "completed")
    .reduce((acc, file) => acc + file.size, 0);
  
  const overallProgress = totalFiles > 0 
    ? files.reduce((acc, file) => acc + (file.progress || 0), 0) / totalFiles
    : 0;

  if (totalFiles === 0) return null;

  const getStatusSummary = () => {
    if (uploadingFiles > 0) {
      return `Uploading ${uploadingFiles} file${uploadingFiles !== 1 ? "s" : ""}...`;
    } else if (failedFiles > 0) {
      return `${completedFiles} completed, ${failedFiles} failed`;
    } else if (completedFiles === totalFiles) {
      return "All files uploaded successfully!";
    } else {
      return "Ready to upload";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <ApperIcon name="Files" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Upload Summary</h3>
            <p className="text-sm text-gray-400">{getStatusSummary()}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {failedFiles > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetryFailed}
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-1" />
              Retry Failed
            </Button>
          )}
          
          {completedFiles > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCompleted}
            >
              <ApperIcon name="Check" size={16} className="mr-1" />
              Clear Completed
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
          >
            <ApperIcon name="Trash2" size={16} className="mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <ProgressBar
          value={overallProgress}
          variant={failedFiles > 0 ? "warning" : completedFiles === totalFiles ? "success" : "primary"}
          animated={uploadingFiles > 0}
          showPercentage={true}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-white">{totalFiles}</div>
            <div className="text-gray-400">Total Files</div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-green-400">{completedFiles}</div>
            <div className="text-gray-400">Completed</div>
          </div>
          
          {failedFiles > 0 && (
            <div className="text-center">
              <div className="font-semibold text-red-400">{failedFiles}</div>
              <div className="text-gray-400">Failed</div>
            </div>
          )}
          
          <div className="text-center">
            <div className="font-semibold text-blue-400">{formatFileSize(uploadedSize)}</div>
            <div className="text-gray-400">of {formatFileSize(totalSize)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadSummary;