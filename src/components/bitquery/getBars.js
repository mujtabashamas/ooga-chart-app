import { fetchHistoricalData } from "./histOHLC";
import { subscribeToWebSocket, unsubscribeFromWebSocket } from "./webSocketOHLC";

export const getBars = async (
  symbolInfo,
  resolution,
  periodParams, // compulsorily needed
  onHistoryCallback,
  onErrorCallback,
  baseMint
) => {
  try {
    console.log(
      "[getBars]: Fetching BitQuery bars for",
      symbolInfo,
      "resolution:", resolution,
      "from:", new Date(periodParams.from * 1000),
      "to:", new Date(periodParams.to * 1000),
      "baseMint:", baseMint
    );

    const bars = await fetchHistoricalData(baseMint, resolution, periodParams.from, periodParams.to);

    if (bars && bars.length > 0) {
      console.log(`[getBars]: Returning ${bars.length} bars`);
      onHistoryCallback(bars, { noData: false });
    } else {
      console.log('[getBars]: No data found for the specified period');
      onHistoryCallback([], { noData: true });
    }
  } catch (err) {
    console.error("[getBars] Error fetching BitQuery data:", err);
    onErrorCallback(err);
  }
};

export const subscribeBars = (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback,
  baseMint
) => {
  console.log('[subscribeBars]: Setting up BitQuery real-time subscription', subscriberUID, baseMint, resolution);
  subscribeToWebSocket(baseMint, resolution, onRealtimeCallback, subscriberUID);
};

export const unsubscribeBars = (subscriberUID) => {
  console.log('[unsubscribeBars]: Cleaning up BitQuery subscription', subscriberUID);
  unsubscribeFromWebSocket(subscriberUID);
};
