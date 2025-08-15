import axios from "axios";

const endpoint = "https://streaming.bitquery.io/eap";

const buildTokenQuery = (baseMint) => `
{
  Trading {
    Tokens(
      where: {Token: {Network: {is: "Solana"}, Address: {is: "${baseMint}"}}, Interval: {Time: {Duration: {eq: 60}}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10000}
    ) {
      Token {
        Address
        Id
        IsNative
        Name
        Network
        Symbol
        TokenId
      }
      Block {
        Date
        Time
        Timestamp
      }
      Interval {
        Time {
          Start
          Duration
          End
        }
      }
      Volume {
        Base
        Quote
        Usd
      }
      Price {
        IsQuotedInUsd
        Ohlc {
          Close
          High
          Low
          Open
        }
        Average {
          ExponentialMoving
          Mean
          SimpleMoving
          WeightedSimpleMoving
        }
      }
    }
  }
}`;

export async function fetchHistoricalData(baseMint, from) {
  const requiredBars = 360; // Hardcoding the value
  const TOKEN_DETAILS = buildTokenQuery(baseMint);

  console.log("BitQuery query:", TOKEN_DETAILS);

  try {
    const authToken = process.env.NEXT_PUBLIC_BITQUERY_TOKEN;

    if (!authToken) {
      throw new Error('NEXT_PUBLIC_BITQUERY_TOKEN environment variable is not set');
    }

    const response = await axios.post(
      endpoint,
      { query: TOKEN_DETAILS },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("BitQuery API called", response);

    if (!response.data?.data?.Trading?.Tokens) {
      throw new Error('No trading data received from BitQuery API');
    }

    const trades = response.data.data.Trading.Tokens;

    // Preprocess the bars data
    let bars = trades.map((trade) => {
      // Parse and convert Block Time field to Unix timestamp in milliseconds
      const blockTime = new Date(trade.Block.Time).getTime();

      return {
        time: blockTime, // Time in Unix timestamp (milliseconds)
        open: trade.Price.Ohlc.Open || 0,
        high: trade.Price.Ohlc.High || 0,
        low: trade.Price.Ohlc.Low || 0,
        close: trade.Price.Ohlc.Close || 0,
        volume: trade.Volume.Base || 0,
      };
    });

    // Sort bars in ascending order by time (since the API returned descending order)
    bars.sort((a, b) => a.time - b.time);

    // Fill in missing bars if needed to reach required bars count
    if (bars.length < requiredBars) {
      const earliestTime = bars[0]?.time || from;
      const missingBarsCount = requiredBars - bars.length;

      // Generate missing bars before the earliest returned bar
      for (let i = 1; i <= missingBarsCount; i++) {
        bars.unshift({
          time: earliestTime - i * 60000, // Assuming 1-minute bars (60000 ms)
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          count: 0
        });
      }
    }

    return bars;
  } catch (err) {
    console.error("Error fetching BitQuery historical data:", err);
    throw err;
  }
}
