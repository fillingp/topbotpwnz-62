
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onImageCaptured: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCaptured, onClose }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasCapture, setHasCapture] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Start camera when component mounts
    startCamera();
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Nepodařilo se získat přístup ke kameře. Zkontrolujte oprávnění.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        setHasCapture(true);
        
        // Stop camera after capturing
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setHasCapture(false);
    startCamera();
  };

  const usePhoto = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-800 p-4 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Vyfotit pro analýzu</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </div>
        
        {!hasCapture ? (
          <div className="relative">
            <video 
              ref={videoRef} 
              className="w-full h-auto rounded-md bg-slate-900"
              autoPlay 
              playsInline
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button
                onClick={takePhoto}
                disabled={!isReady}
                className="bg-white hover:bg-gray-200 text-black rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
              >
                <Camera size={24} />
              </Button>
            </div>
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-white">
                Připravuji kameru...
              </div>
            )}
          </div>
        ) : (
          <div>
            <img 
              src={capturedImage || ''} 
              alt="Captured" 
              className="w-full h-auto rounded-md"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button 
            className="w-full"
            onClick={hasCapture ? retakePhoto : onClose}
            variant="outline"
          >
            {hasCapture ? <><RefreshCw size={16} className="mr-2" /> Fotit znovu</> : 'Zrušit'}
          </Button>
          
          {hasCapture && (
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={usePhoto}
            >
              Použít fotku
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
