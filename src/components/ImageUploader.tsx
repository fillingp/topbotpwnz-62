
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelected: (imageData: string) => void;
  onClose: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Můžeš nahrát pouze obrázky!");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Obrázek je moc velký! Maximum je 5MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageData = event.target.result as string;
        setPreviewImage(imageData);
        onImageSelected(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Nahraj obrázek k analýze</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </div>
        
        {previewImage ? (
          <div className="mb-4">
            <img src={previewImage} alt="Preview" className="w-full h-auto rounded-md" />
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-purple-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-2" />
            <p className="text-slate-300">Přetáhni obrázek sem nebo klikni pro výběr</p>
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            className="w-full"
            onClick={onClose}
            variant="outline"
          >
            Zrušit
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => {
              if (previewImage) {
                onClose();
              } else {
                document.getElementById('file-input')?.click();
              }
            }}
          >
            {previewImage ? 'Analyzovat' : 'Vybrat obrázek'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

