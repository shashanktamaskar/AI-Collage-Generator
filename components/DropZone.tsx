
import React, { useState, useCallback } from 'react';

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
  accept: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileDrop, children, accept }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  }, [onFileDrop]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileDrop(e.target.files[0]);
    }
  };

  const handleClick = () => {
    document.getElementById(`fileInput-${accept}`)?.click();
  };

  const dropZoneClasses = `
    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 h-full flex items-center justify-center
    ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
  `;

  return (
    <div
      className={dropZoneClasses}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={`fileInput-${accept}`}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      {children}
    </div>
  );
};
