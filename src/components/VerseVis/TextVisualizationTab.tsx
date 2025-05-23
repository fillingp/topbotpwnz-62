
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye } from "lucide-react";

interface TextVisualizationTabProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

const TextVisualizationTab: React.FC<TextVisualizationTabProps> = ({
  input,
  onInputChange,
  onProcess,
  isProcessing
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white">Text k vizualizaci</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              value={input}
              onChange={onInputChange}
              placeholder="Vložte báseň, text nebo popis k vizualizaci..."
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 min-h-32"
              disabled={isProcessing}
            />
          </div>
          
          <Button
            onClick={onProcess}
            disabled={isProcessing || !input.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zpracovávám...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Vizualizovat text
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextVisualizationTab;
