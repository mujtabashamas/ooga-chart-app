import { createClient } from 'graphql-ws';

let client;
let activeSubscriptions = new Map();

// Convert TradingView resolution to BitQuery duration in seconds
const resolutionToDuration = (resolution) => {
  switch (resolution) {
    case '1S':
    case '1s':
      return 1;
    case '5S':
    case '5s':
      return 5;
    case '15S':
    case '15s':
      return 15;
    case '30S':
    case '30s':
      return 30;
    case '1':
      return 60; // 1 minute
    case '5':
      return 300; // 5 minutes
    case '15':
      return 900; // 15 minutes
    case '30':
      return 1800; // 30 minutes
    case '60':
      return 3600; // 1 hour
    case '240':
      return 14400; // 4 hours
    case '360':
      return 21600; // 6 hours
    case '720':
      return 43200; // 12 hours
    case '1D':
    case '1440':
      return 86400; // 1 day
    case '1W':
      return 604800; // 1 week
    case '1M':
      return 2592000; // 1 month (30 days)
    default:
      return 60; // Default to 1 minute
  }
};

const buildSubscriptionQuery = (baseMint, resolution) => {
  const duration = resolutionToDuration(resolution);

  return `
subscription {
  Trading {
    Tokens(
      where: {
        Token: {
          Network: {is: "Solana"},
          Address: {is: "${baseMint}"}
        },
        Interval: {Time: {Duration: {eq: ${duration}}}}
      }
    ) {
      Block {
        Time
      }
      Price {
        Ohlc {
          Open
          High
          Low
          Close
        }
      }
      Volume {
        Base
      }
    }
  }
}`;
};

export function subscribeToWebSocket(baseMint, resolution, onRealtimeCallback, subscriberUID) {
  const authToken = process.env.NEXT_PUBLIC_BITQUERY_TOKEN;

  if (!authToken) {
    console.error('NEXT_PUBLIC_BITQUERY_TOKEN environment variable is not set');
    return;
  }

  const subscriptionKey = `${baseMint}_${resolution}`;

  // If we already have a subscription for this combination, unsubscribe first
  if (activeSubscriptions.has(subscriptionKey)) {
    console.log('Unsubscribing existing subscription for:', subscriptionKey);
    const existingSubscription = activeSubscriptions.get(subscriptionKey);
    if (existingSubscription.unsubscribe) {
      existingSubscription.unsubscribe();
    }
  }

  const BITQUERY_ENDPOINT = `wss://streaming.bitquery.io/eap?token=${authToken}`;
  const subscriptionQuery = buildSubscriptionQuery(baseMint, resolution);

  console.log("BitQuery WebSocket connecting to:", BITQUERY_ENDPOINT);
  console.log("Base Mint:", baseMint, "Resolution:", resolution, "SubscriberUID:", subscriberUID);

  if (!client) {
    client = createClient({ url: BITQUERY_ENDPOINT });
  }

  const onNext = (data) => {
    console.log("BitQuery subscription data received", data);
    const tokenData = data.data?.Trading?.Tokens?.[0];
    if (!tokenData) return;

    const bar = {
      time: new Date(tokenData.Block.Time).getTime(),
      open: parseFloat(tokenData.Price.Ohlc.Open) || 0,
      high: parseFloat(tokenData.Price.Ohlc.High) || 0,
      low: parseFloat(tokenData.Price.Ohlc.Low) || 0,
      close: parseFloat(tokenData.Price.Ohlc.Close) || 0,
      volume: parseFloat(tokenData.Volume.Base) || 0,
    };

    console.log('Emitting real-time bar:', bar);
    onRealtimeCallback(bar); // Emit immediately
  };

  const onError = (error) => {
    console.error('BitQuery WebSocket error:', error);
    // Try to reconnect after a delay
    setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      subscribeToWebSocket(baseMint, resolution, onRealtimeCallback, subscriberUID);
    }, 5000);
  };

  const onComplete = () => {
    console.log('BitQuery WebSocket subscription completed');
  };

  const unsubscribe = client.subscribe(
    { query: subscriptionQuery },
    { next: onNext, error: onError, complete: onComplete }
  );

  // Store the subscription
  activeSubscriptions.set(subscriptionKey, {
    unsubscribe,
    subscriberUID,
    baseMint,
    resolution,
    callback: onRealtimeCallback
  });

  console.log('WebSocket subscription created for:', subscriptionKey);
}

export function unsubscribeFromWebSocket(subscriberUID) {
  console.log('Unsubscribing WebSocket for subscriber:', subscriberUID);

  // Find and remove subscription by subscriberUID
  for (const [key, subscription] of activeSubscriptions.entries()) {
    if (subscription.subscriberUID === subscriberUID) {
      console.log('Found subscription to unsubscribe:', key);
      if (subscription.unsubscribe) {
        subscription.unsubscribe();
      }
      activeSubscriptions.delete(key);
      break;
    }
  }

  // If no more active subscriptions, dispose the client
  if (activeSubscriptions.size === 0 && client) {
    console.log('No more active subscriptions, disposing WebSocket client');
    client.dispose();
    client = null;
  }
}
