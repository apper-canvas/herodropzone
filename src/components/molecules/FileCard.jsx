import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import { formatFileSize, formatSpeed, formatTime, getFileIcon, getStatusColor, getStatusIcon } from "@/utils/fileUtils";

const FileCard = ({ 
  file, 
  onRemove, 
  onRename, 
  onRetry, 
  onPreview 
}) => {
  const statusColor = getStatusColor(file.status);
  const statusIcon = getStatusIcon(file.status);
  const fileIcon = getFileIcon(file.type);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "danger";
      case "uploading":
        return "primary";
      case "paused":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4 hover:border-primary/30 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <div className="flex-shrink-0 p-2 bg-gray-800 rounded-lg">
          <ApperIcon name={fileIcon} size={20} className="text-primary" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-white truncate">{file.name}</h4>
            <Badge variant={getStatusBadgeVariant(file.status)}>
              <ApperIcon name={statusIcon} size={12} className="mr-1" />
              {file.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
            <span>{formatFileSize(file.size)}</span>
            <span className="capitalize">{file.type.split("/")[0]}</span>
            {file.uploadedAt && (
              <span>
                {new Date(file.uploadedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Progress Bar for uploading files */}
          {file.status === "uploading" && (
            <div className="space-y-2">
              <ProgressBar 
                value={file.progress} 
                variant="primary" 
                animated={true}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{Math.round(file.progress)}% complete</span>
                <div className="flex gap-3">
                  {file.speed > 0 && <span>{formatSpeed(file.speed)}</span>}
                  {file.timeRemaining > 0 && <span>{formatTime(file.timeRemaining)} remaining</span>}
                </div>
              </div>
            </div>
          )}

          {/* Completed progress bar */}
          {file.status === "completed" && (
            <ProgressBar 
              value={100} 
              variant="success"
            />
          )}

          {/* Failed progress bar */}
          {file.status === "failed" && (
            <ProgressBar 
              value={file.progress || 0} 
              variant="danger"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {file.type.startsWith("image/") && file.preview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(file)}
              title="Preview"
            >
              <ApperIcon name="Eye" size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRename(file)}
            title="Rename"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>

          {file.status === "failed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRetry(file)}
              title="Retry Upload"
            >
              <ApperIcon name="RotateCcw" size={16} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(file)}
            title="Remove"
            className="text-red-400 hover:text-red-300"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;