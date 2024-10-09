// src/config.ts
const isLocal = import.meta.env.VITE_URL === "http://0.0.0.0:8545";

export const config = {
  url: import.meta.env.VITE_URL,
  localAddress: isLocal ? import.meta.env.VITE_LOCAL_ADDRESS : '',
  factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS,
  routerAddress: import.meta.env.VITE_ROUTER_ADDRESS,
  wethAddress: import.meta.env.VITE_WETH,
  usdtAddress: import.meta.env.VITE_USDT,
  wbtcAddress: import.meta.env.VITE_WBTC,
  chainID: import.meta.env.VITE_LOCAL_CHAIN_ID,
  isLocal,
};

console.log(config)