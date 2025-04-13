'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-64 p-8">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Please choose a stock first to view analysis
      </h2>
      <Button 
        onClick={() => router.push('/stocks')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Go to Stocks
      </Button>
    </div>
  );
}