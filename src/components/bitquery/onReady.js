const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
  exchanges: [
    {
      value: 'Solana',
      name: 'Solana',
      desc: 'Solana Blockchain',
    },
  ],
  symbols_types: [
    {
      name: 'crypto',
      value: 'crypto',
    },
  ],
};

export const onReady = (callback) => {
  console.log('[onReady]: Method call');
  setTimeout(() => callback(configurationData), 0);
};
