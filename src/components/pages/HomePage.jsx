import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FileUploader from "@/components/organisms/FileUploader";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="p-4 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Upload" size={32} className="text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DropZone
            </h1>
          </div>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload and manage multiple files efficiently with real-time progress tracking, 
            instant previews, and organized file management.
          </p>
        </motion.div>

        {/* Main Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FileUploader />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MousePointer" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop</h3>
              <p className="text-gray-400 text-sm">
                Simply drag files from your computer and drop them to start uploading
              </p>
            </div>

            <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="BarChart3" size={24} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Progress</h3>
              <p className="text-gray-400 text-sm">
                Monitor upload progress with speed and time remaining estimates
              </p>
            </div>

            <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Eye" size={24} className="text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Preview</h3>
              <p className="text-gray-400 text-sm">
                Preview images and manage files with rename and delete options
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;