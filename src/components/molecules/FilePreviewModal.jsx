import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { formatFileSize } from "@/utils/fileUtils";

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-surface/95 backdrop-blur-sm rounded-2xl border border-gray-700 max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-white truncate">{file.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span>{formatFileSize(file.size)}</span>
                <span className="capitalize">{file.type}</span>
                {file.uploadedAt && (
                  <span>{new Date(file.uploadedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6">
            {file.type.startsWith("image/") && file.preview ? (
              <div className="flex justify-center">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={file.preview}
                  alt={file.name}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-6 bg-gray-800 rounded-2xl mb-4">
                  <ApperIcon name="File" size={48} className="text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Preview Not Available</h4>
                <p className="text-gray-400">
                  Preview is not supported for this file type
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilePreviewModal;