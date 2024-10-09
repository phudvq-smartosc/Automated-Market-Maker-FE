import * as chains from './chains';

// TODO: Add address here
const LOCAL_ANVILS_COIN = [
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x8e1596Cf4eB5202a079D62C62091A06dd1F9B34e", // Weth address is fetched from the router
    img: "./src/assets/0x-leverage.png", // Replace with actual img URL
    balance: "0"
  },
  {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    address: "0x937544D6c07b1BBD960B94B160868289Ae681761",
    img: "./src/assets/aeggs.png", // Replace with actual img URL
    balance: "0"
  },
  {
    name: "Wrapped Binance",
    symbol: "WBNB",
    address: "0x6854EdB34f8A62ef3a9631238C61798053A39014",
    img: "./src/assets/0x-leverage.png", // Replace with actual img URL
    balance: "0"
  },
  {
    name: "Wrapped Toncoin",
    symbol: "TONCOIN",
    address: "0xD88F0d4083885dB8ff293A2c165655E3A5BceC0E",
    img: "./src/assets/0x-leverage.png", // Replace with actual img URL
    balance: "0"
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x50776D52BcF384EAeD6a1B8F097d3142a347f968",
    img: "./src/assets/0x-leverage.png", // Replace with actual img URL
    balance: "0"
  },
];

const COINS = new Map();
COINS.set(chains.ChainId.LOCAL_ANVIL, LOCAL_ANVILS_COIN);

export default COINS;