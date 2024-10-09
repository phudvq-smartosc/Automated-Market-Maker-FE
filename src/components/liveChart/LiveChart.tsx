// TradingViewWidget.jsx
import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@apollo/client";
import { PAIR_HISTORY_QUERY } from "../../utils/queries";
import { useParams } from "react-router-dom";
import { DEFAULT_PRICE } from "../../utils/defaultValue";
import { PriceVsDollarV2 } from "../../utils/ethereumFunctions";
import {
  getAccount,
  getFactory,
  getNetwork,
  getProvider,
  getRouter,
  getSigners,

} from "../../utils/ethereumFunctions";

import {
  setAccount,
  setChainID,
  setCoins,
  setFactory,
  setProvider,
  setRouter,
  setSigner,
} from "../../state/blockchain/networkSlice";
import { config } from "../../config/envConfig";
import COINS from "../../utils/coins";
import { formatPrice, formatReserve } from "../../utils/format";
function LiveChart() {
  const dispatch = useDispatch<AppDispatch>();
  const networkGlobalState = useSelector((state: RootState) => state.network);
  const account = networkGlobalState.account;
  const { id } = useParams();

  const { loading, error, data } = useQuery(PAIR_HISTORY_QUERY, {
    variables: { id: id },
  });

  const [priceToken0OverUSDT, setToken0PriceOverUSDT] = useState<number>(DEFAULT_PRICE);
  const [priceToken1OverUSDT, setToken1PriceOverUSDT] = useState<number>(DEFAULT_PRICE);
  const [transactions, setTransactions] = useState([]);
  const [TVL, setTVL] = useState<number>(0);
  const handleConnect = async () => {
    try {
      const newNetworkState = await setupConnection();

      // Dispatch actions with the new state
      dispatch(setProvider(newNetworkState.provider));
      dispatch(setSigner(newNetworkState.signer));
      dispatch(setAccount(newNetworkState.account));
      dispatch(setChainID(newNetworkState.chainID));
      dispatch(setRouter(newNetworkState.router));
      dispatch(setFactory(newNetworkState.factory));
      dispatch(setCoins(newNetworkState.coins));

      // Optionally save to local storage
      // saveNetworkToLocalStorage(newNetworkState);
    } catch (err) {
      alert(`${err}`);
    }
  };
  useEffect(() => {
    console.log("In Use Effect: Handling Connection");
    handleConnect();
  }, []);
  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await testPrice();
      if(prices[0] == 0) {
        setToken0PriceOverUSDT(1)
        setToken1PriceOverUSDT(prices[1])
      }else if (prices[1] == 0) {
        setToken0PriceOverUSDT(prices[0])
        setToken1PriceOverUSDT(1)
      }else {
        setToken0PriceOverUSDT(prices[0])
        setToken1PriceOverUSDT(prices[1])
      }
    };

    if (data) {
      console.log("Data", data)
      fetchPrices();
      console.log('prices', priceToken0OverUSDT)
      console.log('prices', priceToken1OverUSDT)
      processTransactions(data);
      // setTVL(price)
      // const data.zuniswapV2Pair.
      const reserve0 = data.zuniswapV2Pair.reserve0;
      const reserve1 = data.zuniswapV2Pair.reserve1;
      const TVLPrice = reserve0 * priceToken0OverUSDT + reserve1 * priceToken1OverUSDT;
      setTVL(TVLPrice)
    }
  }, [data, networkGlobalState]);

  const processTransactions = (data) => {
    const newTransactions = [];

    // Process swaps
    data.zuniswapV2Pair.swaps.forEach((swap) => {
      const amountIn = swap.amount0In != 0 ? swap.amount0In : swap.amount1In;
      const amountOut = swap.amount0Out != 0 ? swap.amount0Out : swap.amount1Out;
      newTransactions.push({
        timestamp: parseInt(swap.timestamp) * 1000,
        totalAmount: parseFloat(amountIn) * priceToken0OverUSDT + parseFloat(amountOut) * priceToken1OverUSDT,
      });
    });

    setTransactions(newTransactions.sort((a, b) => a.timestamp - b.timestamp));
  };

  async function testPrice() {
    const token0Address = data.zuniswapV2Pair.token0.id.toLowerCase();
    const token1Address = data.zuniswapV2Pair.token1.id.toLowerCase();
    const usdtAddress = import.meta.env.VITE_USDT.toLowerCase();
    const price = [1, 1];

    try {
      if (token0Address === usdtAddress) {
        price[1] = await PriceVsDollarV2(token1Address, networkGlobalState.factory!, networkGlobalState.signer!);
      } else if (token1Address === usdtAddress) {
        price[0] = await PriceVsDollarV2(token0Address, networkGlobalState.factory!, networkGlobalState.signer!);
      } else {
        price[0] = await PriceVsDollarV2(token0Address, networkGlobalState.factory!, networkGlobalState.signer!);
        price[1] = await PriceVsDollarV2(token1Address, networkGlobalState.factory!, networkGlobalState.signer!);
      }
      return price;
    } catch (error) {
      console.error("Error fetching prices:", error);
      return [0, 1]; // Default prices in case of error
    }
  }
  const maxAmount = (Math.max(...transactions.map((transaction) => transaction.totalAmount)) * 1.1).toPrecision(4);
  console.log("MAx AMount", maxAmount)
    if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  transactions.sort((a, b) => a.timestamp - b.timestamp);

  async function setupConnection() {
    try {
      const provider = getProvider();
      const signer = await getSigners(provider);
      const account = await getAccount();
      const chainId = await getNetwork(provider);
      const routerAddress = config.routerAddress;
      const router = getRouter(routerAddress, signer);
      const coins = COINS.get(chainId);
      const factoryAddress = config.factoryAddress;
      const factory = getFactory(factoryAddress, signer);

      // Return an object with the new state
      return {
        provider,
        signer,
        account,
        chainID: chainId,
        router,
        coins,
        factory,
      };
    } catch (error) {
      console.log("Error in Set Up Connection", error);
      throw error; // Re-throw the error to handle it in handleConnect
    }
  }

  return (
    <div id="Token-Swap-Page" className="flex flex-col justify-start w-full h-full p-4">
      <Header address={account} />
      <div className="w-full h-full mt-8 pl-72 pr-72">
        <h1 className="mb-4 text-2xl font-semibold">Chart Pair</h1>
        <h1 className="mb-4 text-2xl font-medium">{data.zuniswapV2Pair.token0.symbol} / {data.zuniswapV2Pair.token1.symbol}</h1>

        <div className="shadow stats">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">TVL</div>
            <div className="stat-value">{formatReserve(TVL.toString())}</div>
            <div className="stat-desc">Total Value Lock</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Price {data.zuniswapV2Pair.token0.symbol} in $</div>
            <div className="stat-value">{formatPrice(priceToken0OverUSDT.toString())}</div>
          </div>

          <div className="stat">
          <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            {/* <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div> */}
            <div className="stat-title">Price {data.zuniswapV2Pair.token1.symbol} in $</div>
            <div className="stat-value">{formatPrice(priceToken1OverUSDT.toString())}</div>
          </div>
        </div>
        <div className="p-8 mt-4 bg-white w-fit rounded-3xl backdrop-opacity-65 ">
          <LineChart  width={1200} height={600} data={transactions}        margin={{
            top: 10,
            right: 30,
            left: 60,
            bottom: 10,
          }}>
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleString()} />
          <YAxis/>
          <Tooltip />
          <Line strokeWidth={8} type="monotone" dataKey="totalAmount" stroke="#000000" dot={{ r: 4 }} />
        </LineChart>
        </div>

      </div>
    </div>
  );
}

export default LiveChart;
