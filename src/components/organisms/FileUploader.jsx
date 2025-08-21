import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import UploadSummary from "@/components/molecules/UploadSummary";
import FilePreviewModal from "@/components/molecules/FilePreviewModal";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { fileService } from "@/services/api/fileService";
import { generateFileId, isImageFile, validateFileType, formatFileSize } from "@/utils/fileUtils";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  // Configuration
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  const acceptedTypes = []; // Accept all types

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const loadedFiles = await fileService.getAll();
      setFiles(loadedFiles);
    } catch (err) {
      console.error("Error loading files:", err);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFilesAdded = async (newFiles) => {
    const validFiles = [];
    const invalidFiles = [];

    for (const file of newFiles) {
      // Validate file size
      if (file.size > maxFileSize) {
        invalidFiles.push({
          name: file.name,
          reason: `File size exceeds ${formatFileSize(maxFileSize)}`
        });
        continue;
      }

      // Validate file type
      if (!validateFileType(file, acceptedTypes)) {
        invalidFiles.push({
          name: file.name,
          reason: "File type not supported"
        });
        continue;
      }

      // Create file object
      const fileId = generateFileId();
      const fileObj = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending",
        progress: 0,
        speed: 0,
        timeRemaining: 0,
        preview: null,
        file: file // Store the actual file object for uploading
      };

      // Generate preview for images
      if (isImageFile(file.type)) {
        try {
          const preview = await generateImagePreview(file);
          fileObj.preview = preview;
        } catch (err) {
          console.warn("Failed to generate preview for", file.name);
        }
      }

      validFiles.push(fileObj);
    }

    // Show warnings for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ name, reason }) => {
        toast.error(`${name}: ${reason}`);
      });
    }

    // Add valid files and start uploading
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file${validFiles.length !== 1 ? "s" : ""} to upload queue`);
      
      // Start uploading each file
      validFiles.forEach(file => {
        uploadFile(file);
      });
    }
  };

  const generateImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (fileObj) => {
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: "uploading", progress: 0 }
          : f
      ));

      // Simulate upload with progress
      await fileService.simulateUpload(fileObj.file, (progressData) => {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, ...progressData }
            : f
        ));
      });

      // Create the file record
      const savedFile = await fileService.create({
        name: fileObj.name,
        size: fileObj.size,
        type: fileObj.type,
        status: "completed",
        progress: 100,
        preview: fileObj.preview
      });

      // Update with completed status
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...savedFile, id: fileObj.id, status: "completed", progress: 100 }
          : f
      ));

      toast.success(`${fileObj.name} uploaded successfully`);

    } catch (err) {
      console.error("Upload failed:", err);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: "failed" }
          : f
      ));
      toast.error(`Failed to upload ${fileObj.name}`);
    }
  };

  const handleRemoveFile = (file) => {
    setFiles(prev => prev.filter(f => f.id !== file.id));
    toast.info(`Removed ${file.name} from upload queue`);
  };

  const handleRenameFile = (file) => {
    setRenameFile(file);
    setNewFileName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
  };

  const handleConfirmRename = () => {
    if (!newFileName.trim()) {
      toast.error("File name cannot be empty");
      return;
    }

    const fileExtension = renameFile.name.split(".").pop();
    const newName = `${newFileName.trim()}.${fileExtension}`;

    setFiles(prev => prev.map(f => 
      f.id === renameFile.id 
        ? { ...f, name: newName }
        : f
    ));

    toast.success(`Renamed to ${newName}`);
    setRenameFile(null);
    setNewFileName("");
  };

  const handleRetryFile = (file) => {
    const retryFile = { ...file, status: "pending" };
    setFiles(prev => prev.map(f => 
      f.id === file.id ? retryFile : f
    ));
    uploadFile(retryFile);
  };

  const handlePreviewFile = (file) => {
    setPreviewFile(file);
  };

  const handleClearCompleted = () => {
    const completedCount = files.filter(f => f.status === "completed").length;
    setFiles(prev => prev.filter(f => f.status !== "completed"));
    toast.info(`Cleared ${completedCount} completed files`);
  };

  const handleClearAll = () => {
    setFiles([]);
    toast.info("Cleared all files");
  };

  const handleRetryFailed = () => {
    const failedFiles = files.filter(f => f.status === "failed");
    failedFiles.forEach(file => {
      handleRetryFile(file);
    });
  };

  if (loading) {
    return <Loading message="Loading files..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load files" 
        description={error}
        onRetry={loadFiles} 
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Drop Zone */}
      <DropZone
        onFilesAdded={handleFilesAdded}
        acceptedTypes={acceptedTypes}
        maxSize={maxFileSize}
      />

      {/* Upload Summary */}
      {files.length > 0 && (
        <UploadSummary
          files={files}
          onClearCompleted={handleClearCompleted}
          onClearAll={handleClearAll}
          onRetryFailed={handleRetryFailed}
        />
      )}

      {/* File List */}
      <div className="space-y-4">
        <AnimatePresence>
          {files.length === 0 ? (
            <Empty
              title="No files in queue"
              description="Drag and drop files above or click to browse and add files to your upload queue"
              icon="Upload"
            />
          ) : (
            files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
                onRename={handleRenameFile}
                onRetry={handleRetryFile}
                onPreview={handlePreviewFile}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* Rename Modal */}
      <AnimatePresence>
        {renameFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setRenameFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface/95 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Rename File</h3>
              
              <Input
                label="New file name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleConfirmRename()}
                placeholder="Enter new file name"
                autoFocus
              />
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setRenameFile(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRename}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;