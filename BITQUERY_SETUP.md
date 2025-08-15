# BitQuery Integration Setup

This project now includes BitQuery integration as an alternative to the Solana Tracker.

## Environment Setup

Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_BITQUERY_TOKEN=your_bitquery_token_here
```

Replace `your_bitquery_token_here` with your actual BitQuery API token.

## Usage

### BitQuery Chart Pages

1. **Main BitQuery Chart**: `/bitquery?token=TOKEN_ADDRESS`

   - Example: `/bitquery?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

2. **Embedded BitQuery Chart**: `/bitquery-embed?token=TOKEN_ADDRESS`
   - Example: `/bitquery-embed?token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

### Component Usage

You can also use the BitQuery chart component directly:

```tsx
import BitQueryChart from '@/components/bitquery-chart';

<BitQueryChart
  tokenAddress='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  fullScreen={true}
/>;
```

## Installation

After setting up the environment variable, install the new dependencies:

```bash
npm install
# or
yarn install
```

## Features

- ✅ **Real-time price data** via BitQuery WebSocket with proper resolution support
- ✅ **Historical OHLC data** with time range filtering
- ✅ **All time intervals** including 1s, 5s, 15s, 30s, 1m, 5m, 15m, 30m, 1h, 4h, 6h, 12h, 1d
- ✅ **Missing candle handling** - automatically fills gaps in data
- ✅ **Proper time navigation** - go back in time and data will be fetched
- ✅ **Solana token support** for any token address
- ✅ **UI matching Solana Tracker** with red/green bar colors
- ✅ **Dark theme optimized** with consistent styling
- ✅ **Save/load chart settings** with localStorage persistence
- ✅ **Trading view features** (marks, studies, etc.)
- ✅ **Responsive design** with Card wrapper for non-fullscreen
- ✅ **Embedded chart support** for external integration
- ✅ **Seamless switching** between Solana Tracker and BitQuery
- ✅ **Auto-reconnecting WebSocket** for reliable real-time updates

## Troubleshooting

1. Make sure your BitQuery token is valid and has proper permissions
2. Check that the token address is a valid Solana token address
3. Ensure all dependencies are installed correctly
4. Check browser console for any API errors
