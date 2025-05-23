
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye } from "lucide-react";

interface ImageAnalysisTabProps {
  input: string;
  uploadedImage: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

const ImageAnalysisTab: React.FC<ImageAnalysisTabProps> = ({
  input,
  uploadedImage,
  onInputChange,
  onImageUpload,
  onProcess,
  isProcessing
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white">Analýza obrázku</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-300">Nahrát obrázek</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onImageUpload}
                className="bg-slate-700/50 text-slate-300 px-3 py-2 rounded-md border border-slate-600"
                disabled={isProcessing}
              />
            </label>
            
            {uploadedImage && (
              <div className="relative overflow-hidden rounded-md border border-slate-600 h-48">
                <img 
                  src={uploadedImage} 
                  alt="Nahraný obrázek" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Textarea
              value={input}
              onChange={onInputChange}
              placeholder="Zadejte pokyn pro analýzu obrázku (např. 'Popiš tento obrázek poeticky' nebo 'Najdi emoce v tomto obrázku')"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 min-h-24"
              disabled={isProcessing}
            />
          </div>
          
          <Button
            onClick={onProcess}
            disabled={isProcessing || !input.trim() || !uploadedImage}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzuji obrázek...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Analyzovat obrázek
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageAnalysisTab;
