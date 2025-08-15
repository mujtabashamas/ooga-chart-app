import { resolveSymbol } from './resolveSymbol';
import { getBars, subscribeBars, unsubscribeBars } from './getBars';
import { onReady } from './onReady';

const searchSymbols = (userInput, exchange, symbolType, onResult) => {
  // For BitQuery, we don't provide symbol search functionality
  // Just return empty results
  onResult([]);
};

const createBitQueryDatafeed = (baseMint, quoteMint) => ({
  onReady,
  resolveSymbol,
  searchSymbols,
  getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    return getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback, baseMint);
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    return subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback, baseMint);
  },
  unsubscribeBars,
});

export default createBitQueryDatafeed;
