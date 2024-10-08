import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { GET_TOKEN_PAIRS } from "../../utils/queries";
import { ethers } from "ethers";
import {
  formatBalance,
  formatPrice,
  formatReserve,
  formatTotalSupply,
} from "../../utils/format";
import client from "../../components/ApolloClient";

interface Data {
  zuniswapV2Pairs: Pair[];
  zuniswapV2PairDayDatas: PairDay[];
}
interface PairDay {
  token0: {
    symbol: string;
  };
  token1: {
    symbol: string;
  };
  dailyVolumeToken1: string;
  dailyVolumeToken0: string;
  dailyTxns: number;
}
interface Pair {
  id: string;
  name: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  // liquidityProviderCount: string; //amount minted
  token0Price: string;
  token1Price: string;
  token0: Token;
  token1: Token;
  dayTxn: number;
}
interface Token {
  name: string;
  symbol: string;
  totalLiquidity: string;
  totalSupply: string;
  tradeVolume: string;
  txCount: number;
}
// Initial values for Token
const token0: Token = {
  name: "Tether USD",
  symbol: "USDT",
  totalLiquidity: "10",
  totalSupply: "10000000000000000000000",
  tradeVolume: "1000",
  txCount: 100,
};

const token1: Token = {
  name: "Ethereum",
  symbol: "WETH",
  totalLiquidity: "10",
  totalSupply: "10000000000000000000000",
  tradeVolume: "500",
  txCount: 50,
};

// Initial value for the Pair interface
const initialPair: Pair = {
  id: "0x1a2d29f091a6a45a032dee0939c5b896a6b2a4f0", // Example pair ID
  name: "USDT-WETH Pair", // Name of the pair
  reserve0: "5000", // Example reserve for token0
  reserve1: "10", // Example reserve for token1
  totalSupply: "3000", // Total supply of the liquidity pool
  // liquidityProviderCount: "5", // Number of liquidity providers
  token0Price: "2000.00", // Price of token0 in the pool (WETH price in this case)
  token1Price: "10.00",
  token0: token0, // Reference to the token0 object
  token1: token1, // Reference to the token1 object
  dayTxn: 20, // Number of transactions in the last day
};

const LiquidityPoolList: React.FC = () => {
  const {
    loading,
    error,
    data: queryData,
  } = useQuery(GET_TOKEN_PAIRS, {
    fetchPolicy: "no-cache",
  });

  const [data, setData] = useState<Data>({
    zuniswapV2Pairs: [initialPair],
    zuniswapV2PairDayDatas: [],
  });

  const { zuniswapV2Pairs, zuniswapV2PairDayDatas } = data;

  // Create a mapping of day data by pair ID
  const dayDataMap: Record<string, number> = zuniswapV2PairDayDatas.reduce(
    (acc, dayData) => {
      const pairId = `${dayData.token0.symbol}-${dayData.token1.symbol}`; // Create a unique key
      acc[pairId] = dayData.dailyTxns; // Store daily transactions by pair ID
      return acc;
    },
    {} as Record<string, number>,
  );

  // Combine pair data with daily transactions
  const combinedData = zuniswapV2Pairs.map((pair) => {
    const pairId = `${pair.token0.symbol}-${pair.token1.symbol}`; // Match pair by token symbols
    return {
      ...pair,
      dayTxn: dayDataMap[pairId] || 0, // Get dayTxn from dayDataMap, default to 0 if not found
    };
  });

  useEffect(() => {
    if (queryData) {
      setData(queryData);
    }
  }, [queryData]); // Chạy lại khi queryData thay đổi

  useEffect(() => {
    console.log("Use Effect 5s Interval call");

    const interval = setInterval(async () => {
      console.log("Refetching queries...");
      await client.refetchQueries({
        include: [GET_TOKEN_PAIRS],
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      console.log("Interval cleared");
    };
  }, [queryData]); // Thêm client vào dependency array để đảm bảo nó không thay đổi

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-5 pt-5 bg-white rounded-3xl bg-gradient-to-br from-gray-100 to-gray-300">
      <table className="table table-md table-zebra">
        <thead>
          <tr className="text-xl text-slate-950 bg-slate-300">
            <th>Symbol</th>

            <th>Price In Pool</th>

            <th>Reserve</th>

            <th>Total Supply</th>
            {/* <th>LP Count</th> */}
            <th>Hour Tx</th>
          </tr>
        </thead>
        <tbody>
          {combinedData.map((pair: Pair) => {
            const totalSupply = pair.totalSupply;

            const reserveString = `${formatReserve(pair.reserve0)} - ${formatReserve(pair.reserve1)}`;

            const token0Price = parseFloat(pair.token0Price);
            const token1Price = parseFloat(pair.token1Price);

            let formattedRate;
            let priceString;

            if (token0Price === 0 && token1Price === 0) {
              // Choose how you want to represent the zero case
              formattedRate = "0"; // or "Infinity" if you want to indicate no valid conversion
              priceString = `0 ${pair.token0.symbol}-0 ${pair.token1.symbol}`;
            } else {
              // Calculate the conversion price
              console.log("token0Price", token0Price);
              console.log("token1Price", token1Price);

              // Format the output to 2 decimal places
              // formattedRate = token1Price.toPrecision(5);
              formattedRate = formatPrice(token1Price.toString());
              priceString = `1 ${pair.token0.symbol} <-> ${formattedRate} ${pair.token1.symbol}`;
            }
            return (
              <tr className="border-dashed hover" key={pair.id}>
                <th>
                  <Link to={`/pair/${pair.id}`} key={pair.id} className="block">
                    {pair.token0.symbol}/{pair.token1.symbol}
                  </Link>
                </th>
                <td>
                  <Link to={`/pair/${pair.id}`} key={pair.id} className="block">
                    {priceString}
                  </Link>
                </td>
                <td>
                  <Link to={`/pair/${pair.id}`} key={pair.id} className="block">
                    {reserveString}
                  </Link>
                </td>

                <td>
                  {" "}
                  <Link to={`/pair/${pair.id}`} key={pair.id} className="block">
                    {formatTotalSupply(totalSupply.toString())}{" "}
                  </Link>
                </td>
                {/* <td>{pair.liquidityProviderCount}</td> */}
                <td>
                  {" "}
                  <Link to={`/pair/${pair.id}`} key={pair.id} className="block">
                    {pair.dayTxn}{" "}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LiquidityPoolList;
