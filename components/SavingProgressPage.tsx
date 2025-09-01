import React from 'react';

export const SavingProgressPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="text-2xl font-bold mb-4">Saving...</div>
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
  </div>
);
