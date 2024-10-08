// TradingViewWidget.jsx
import React from "react";
import Header from "../layout/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
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

function LiveChart() {
  const networkGlobalState = useSelector((state: RootState) => state.network);
  const account = networkGlobalState.account;

  const { id } = useParams();
  console.log("ID from the params", id);
  const { loading, error, data } = useQuery(PAIR_HISTORY_QUERY, {
    variables: { id: id }, // Replace with your dynamic ID
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract and prepare data for the line chart
  const transactions = [];

  // Process mints
  data.zuniswapV2Pair.mints.forEach((mint) => {
    const amount0 = parseFloat(mint.amount0);
    const amount1 = parseFloat(mint.amount1);
    const liquidity = parseFloat(mint.liquidity);
    let totalAmount;
    if (isNaN(amount0) || isNaN(amount1) || amount0 === 0 || amount1 === 0) {
      // return; // Skip if either amount is invalid or zero
      totalAmount = liquidity;
    } else {
      totalAmount = amount0 + amount1;
    }

    // Log the total amount
    console.log("mint", mint);

    console.log("totalAmount", totalAmount);

    // Check if totalAmount is a valid number and not zero
    if (isNaN(totalAmount) || totalAmount === 0) {
      return 0; // Skip if totalAmount is invalid or zero
    }

    transactions.push({
      timestamp: parseInt(mint.timestamp) * 1000, // Convert to milliseconds
      totalAmount: totalAmount, // Total amount for mints
    });
  });

  // Process swaps
  data.zuniswapV2Pair.swaps.forEach((swap) => {
    transactions.push({
      timestamp: parseInt(swap.timestamp) * 1000, // Convert to milliseconds
      totalAmount: parseFloat(swap.amount0In) + parseFloat(swap.amount1In), // Total amount for swaps
    });
  });
  // Process swaps
  data.zuniswapV2Pair.burns.forEach((burn) => {
    transactions.push({
      timestamp: parseInt(burn.timestamp) * 1000, // Convert to milliseconds
      totalAmount: parseFloat(burn.amount0In) + parseFloat(burn.amount1In), // Total amount for swaps
    });
  });
  const maxAmount =
    Math.max(...transactions.map((transaction) => transaction.totalAmount)) *
    1.1; // Increase by 10%

  // Sort transactions by timestamp
  transactions.sort((a, b) => a.timestamp - b.timestamp);
  console.log("transactions", transactions);
  return (
    <div
      id="Token-Swap-Page"
      className={`flex h-full w-full flex-col justify-start p-4`}
    >
      <Header address={account} />

      <div className="w-full h-full mt-16 pl-72 pr-72">
        <h1 className="mb-4 text-2xl font-semibold">Chart Pair</h1>
        <h1 className="mb-4 text-2xl font-medium">{id}</h1>
        <LineChart
          className="p-8 bg-gray-100"
          width={1000}
          height={500}
          data={transactions}
        >
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          />
          <YAxis domain={[0, maxAmount]} /> {/* Set the Y-axis domain */}
          <Tooltip />
          <Line
            strokeWidth={10}
            type="linear"
            dataKey="totalAmount"
            stroke="#000000"
            dot={{ r: 6 }} // Set the radius of the dots (default is 2)
          />{" "}
        </LineChart>
      </div>
    </div>
  );
}

export default LiveChart;
