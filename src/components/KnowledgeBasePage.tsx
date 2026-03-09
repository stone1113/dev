import React from 'react';
import { AlertCircle } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50/50">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
          <span>该功能还在完善中</span>
        </div>
      </div>
    </div>
  );
};
