'use client';

import { useEffect, useState } from 'react';
import BitQueryTVChartContainer from './bitquery/BitQueryTVChartContainer';

export type BitQueryChartProps = {
  tokenAddress: string;
  fullScreen?: boolean;
};

export default function BitQueryChart({
  tokenAddress,
  fullScreen,
}: BitQueryChartProps) {
  const [tokenSymbol, setTokenSymbol] = useState<string>('');

  useEffect(() => {
    // Remove any existing chart elements from previous renders
    document.querySelector('#st-footer')?.remove();
    document.querySelector('.min-h-screen')?.classList.remove('min-h-screen');

    // Fix color scheme issues
    setInterval(() => {
      const html = document.querySelector('html');
      if (html && html !== null) {
        html.style.colorScheme = '';
      }
    }, 100);
  }, []);

  useEffect(() => {
    // Extract token symbol from address if needed
    // For now, we'll use the address as the symbol
    setTokenSymbol(tokenAddress);
  }, [tokenAddress]);

  return (
    <div
      className={
        fullScreen ? 'bg-background w-screen h-screen' : 'bg-background w-full'
      }
    >
      <BitQueryTVChartContainer
        baseMint={tokenAddress}
        quoteMint='So11111111111111111111111111111111111111112' // SOL mint address
        symbol={tokenSymbol}
        fullScreen={fullScreen}
      />
    </div>
  );
}
