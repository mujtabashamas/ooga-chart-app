'use client';

import './index.css';
import React, { useEffect, useRef } from 'react';
import {
  widget,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
} from '../../../public/static/charting_library';
import createBitQueryDatafeed from './datafeed';
import { Card } from '@/components/ui/card';
import { flatten } from '../trading-view/utils/utils';
import * as saveLoadAdapter from '../trading-view/saveLoadAdapter';

interface BitQueryTVChartContainerProps {
  baseMint: string;
  quoteMint: string;
  symbol?: string;
  fullScreen?: boolean;
}

const BitQueryTVChartContainer: React.FC<BitQueryTVChartContainerProps> = ({
  baseMint,
  quoteMint,
  symbol,
  fullScreen = false,
}) => {
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);

  useEffect(() => {
    const containerEl = document.getElementById('BitQueryTVChartContainer');
    if (!containerEl) {
      console.error('BitQueryTVChartContainer element not found');
      return;
    }

    const displaySymbol = symbol || `${baseMint}/${quoteMint}`;

    const chartProperties = JSON.parse(
      localStorage.getItem('chartproperties') || '{}'
    );

    const savedProperties = flatten(chartProperties, {
      restrictTo: ['scalesProperties', 'paneProperties', 'tradingProperties'],
    });

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: displaySymbol,
      datafeed: createBitQueryDatafeed(baseMint, quoteMint),
      container: containerEl as any,
      library_path: '/static/charting_library/',
      auto_save_delay: 5,
      locale: 'en',
      has_seconds: true,
      debug: false,
      seconds_multipliers: [1],
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      load_last_chart: true,
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      supports_marks: true,
      supported_resolutions: [
        '1S',
        '5S',
        '15S',
        '30S',
        '1',
        '5',
        '15',
        '30',
        '60',
        '240',
        '360',
        '720',
        '1440',
      ],
      allow_symbol_change: false,
      interval: '1' as any,
      seconds_multipliers: [1, 5, 15, 30],
      has_seconds: true,
      theme: 'dark',
      overrides: {
        ...savedProperties,
        // Keep red/green colors as requested but use standard values
        'mainSeriesProperties.candleStyle.upColor': 'rgb(34, 197, 94)', // green-500
        'mainSeriesProperties.candleStyle.downColor': 'rgb(239, 68, 68)', // red-500
        'mainSeriesProperties.candleStyle.borderUpColor': 'rgb(34, 197, 94)',
        'mainSeriesProperties.candleStyle.borderDownColor': 'rgb(239, 68, 68)',
        'mainSeriesProperties.candleStyle.wickUpColor': 'rgb(34, 197, 94)',
        'mainSeriesProperties.candleStyle.wickDownColor': 'rgb(239, 68, 68)',
        'paneProperties.backgroundGradientStartColor': 'rgba(0,0,0,0)',
        'paneProperties.backgroundGradientEndColor': 'rgba(0,0,0,0)',
      },
      wickUpColor: 'rgb(34, 197, 94)',
      upColor: 'rgb(34, 197, 94)',
      wickDownColor: 'rgb(239, 68, 68)',
      downColor: 'rgb(239, 68, 68)',
      borderVisible: false,

      // @ts-ignore
      save_load_adapter: saveLoadAdapter,
      supports_timescale_marks: true,
      settings_adapter: {
        initialSettings: {
          'trading.orderPanelSettingsBroker': JSON.stringify({
            showRelativePriceControl: false,
            showCurrencyRiskInQty: false,
            showPercentRiskInQty: false,
            showBracketsInCurrency: false,
            showBracketsInPercent: false,
          }),
          'trading.chart.proterty':
            localStorage.getItem('trading.chart.proterty') ||
            JSON.stringify({
              hideFloatingPanel: 1,
            }),
          'chart.favoriteDrawings':
            localStorage.getItem('chart.favoriteDrawings') ||
            JSON.stringify([]),
          'chart.favoriteDrawingsPosition':
            localStorage.getItem('chart.favoriteDrawingsPosition') ||
            JSON.stringify({}),
        },
        setValue: (key, value) => {
          localStorage.setItem(key, value);
        },
        removeValue: (key) => {
          localStorage.removeItem(key);
        },
      },
    };

    console.log('BitQuery widgetOptions:', widgetOptions);

    try {
      const tvWidget = new widget(widgetOptions);
      console.log('BitQuery widget created:', tvWidget);
      tvWidgetRef.current = tvWidget;

      tvWidget.onChartReady(() => {
        console.log('BitQuery onChartReady');
        tvWidget
          // @ts-ignore
          .subscribe('onAutoSaveNeeded', () => tvWidget.saveChartToServer());
      });
    } catch (e) {
      console.error('Failed to create BitQuery TradingView widget', e);
    }

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
    };
  }, [baseMint, quoteMint, symbol, fullScreen]);

  if (fullScreen) {
    return (
      <div
        className='w-screen h-screen overflow-hidden'
        style={{ colorScheme: 'dark' }}
      >
        <div id={'BitQueryTVChartContainer'} className={'TVChartContainer'} />
      </div>
    );
  }

  return (
    <Card
      className='h-[29rem] sm:w-[50rem] overflow-hidden p-2'
      style={{ colorScheme: 'dark' }}
    >
      <div id={'BitQueryTVChartContainer'} className={'TVChartContainer'} />
    </Card>
  );
};

export default BitQueryTVChartContainer;
