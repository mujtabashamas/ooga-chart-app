'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BitQueryChart from '@/components/bitquery-chart';
import { Card } from '@/components/ui/card';

function BitQueryPageContent() {
  const searchParams = useSearchParams();
  const tokenAddress = searchParams.get('token');

  if (!tokenAddress) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <Card className='p-6'>
          <h1 className='text-xl font-bold mb-4'>BitQuery Chart</h1>
          <p className='text-muted-foreground'>
            Please provide a token address in the URL parameter:
            ?token=YOUR_TOKEN_ADDRESS
          </p>
          <p className='text-sm text-muted-foreground mt-2'>
            Example:
            /bitquery?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background relative'>
      <BitQueryChart tokenAddress={tokenAddress} fullScreen={true} />

      {/* Solana Tracker Alternative Link */}
      <div className='absolute top-4 right-4 z-50'>
        <Link
          href={`/?token=${tokenAddress}`}
          className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors'
        >
          Solana Tracker
        </Link>
      </div>
    </div>
  );
}

export default function BitQueryPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-background flex items-center justify-center'>
          <div className='text-lg'>Loading BitQuery chart...</div>
        </div>
      }
    >
      <BitQueryPageContent />
    </Suspense>
  );
}
