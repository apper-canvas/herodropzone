import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={48} className="text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;