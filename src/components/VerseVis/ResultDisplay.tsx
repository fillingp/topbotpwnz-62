
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface ResultDisplayProps {
  result: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Výsledek analýzy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-slate-300">{result}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
