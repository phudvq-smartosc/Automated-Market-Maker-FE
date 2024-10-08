export const networks = [1, 3, 4, 5, 42, 123, 1337, 65110000, 65010000]

export const ChainId = {
  MAINNET: 1,
  LOCAL_ANVIL: 31337
};

export const routerAddress = new Map();
const USDT_ADDRESS = import.meta.env.VITE_USDT;
routerAddress.set(ChainId.LOCAL_ANVIL, USDT_ADDRESS);
