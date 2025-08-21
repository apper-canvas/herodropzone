export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return "0 B/s";
  
  const k = 1024;
  const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
  
  return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatTime = (seconds) => {
  if (seconds === Infinity || seconds === 0) return "--";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

export const getFileIcon = (type) => {
  if (type.startsWith("image/")) return "Image";
  if (type.startsWith("video/")) return "Video";
  if (type.startsWith("audio/")) return "Music";
  if (type === "application/pdf") return "FileText";
  if (type.includes("document") || type.includes("word")) return "FileText";
  if (type.includes("spreadsheet") || type.includes("excel")) return "Sheet";
  if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "Archive";
  return "File";
};

export const isImageFile = (type) => {
  return type.startsWith("image/");
};

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.some(type => file.type.match(type));
};

export const getStatusColor = (status) => {
  switch (status) {
    case "uploading":
      return "text-blue-400";
    case "completed":
      return "text-green-400";
    case "failed":
      return "text-red-400";
    case "paused":
      return "text-yellow-400";
    default:
      return "text-gray-400";
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "uploading":
      return "Upload";
    case "completed":
      return "CheckCircle";
    case "failed":
      return "XCircle";
    case "paused":
      return "PauseCircle";
    default:
      return "Clock";
  }
};