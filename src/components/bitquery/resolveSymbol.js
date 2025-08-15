export const resolveSymbol = (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback
) => {
  console.log('[resolveSymbol]: Method call', symbolName);

  // Create a symbol info object
  const symbolInfo = {
    ticker: symbolName,
    name: symbolName,
    description: symbolName,
    type: 'crypto',
    session: '24x7',
    timezone: 'Etc/UTC',
    exchange: 'Solana',
    minmov: 1,
    pricescale: 1000000000, // 9 decimal places for Solana tokens
    has_intraday: true,
    has_weekly_and_monthly: true,
    supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    volume_precision: 2,
    data_status: 'streaming',
  };

  setTimeout(() => {
    onSymbolResolvedCallback(symbolInfo);
  }, 0);
};
