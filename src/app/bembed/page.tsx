'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BitQueryChart from '@/components/bitquery-chart';

function BitQueryEmbedContent() {
  const searchParams = useSearchParams();
  const tokenAddress = searchParams.get('token');

  if (!tokenAddress) {
    return (
      <div className='w-full h-screen bg-background flex items-center justify-center p-4'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold mb-2'>BitQuery Chart</h2>
          <p className='text-sm text-muted-foreground'>
            Token address required. Add ?token=YOUR_TOKEN_ADDRESS to the URL
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen bg-background'>
      <BitQueryChart tokenAddress={tokenAddress} fullScreen={true} />
    </div>
  );
}

export default function BitQueryEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full h-screen bg-background flex items-center justify-center'>
          <div className='text-lg'>Loading...</div>
        </div>
      }
    >
      <BitQueryEmbedContent />
    </Suspense>
  );
}
