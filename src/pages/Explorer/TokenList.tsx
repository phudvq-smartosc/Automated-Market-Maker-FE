import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_TOKENS } from "../../utils/queries";
import { ethers } from "ethers";
import { formatReserve, formatTradeVolume } from "../../utils/format";
import client from "../../components/ApolloClient";

interface Data {
  tokens: Token[];
}
interface Token {
  id: string;
  name: string;
  symbol: string;
  totalLiquidity: string;
  totalSupply: string;
  tradeVolume: string;
  txCount: number;
}
const initialToken: Token = {
  id: "0x0000000000000000000000000000000000000000", // ID token
  name: "Default Token", // Tên token
  symbol: "DTK", // Ký hiệu token
  totalLiquidity: "0", // Tổng thanh khoản
  totalSupply: "0", // Tổng cung
  tradeVolume: "0", // Khối lượng giao dịch
  txCount: 0, // Số lượng giao dịch
};

const TokenList: React.FC = () => {
  const [data, setData] = useState<Data>({tokens: [initialToken]});

  const { loading, error, data: queryData } = useQuery(GET_TOKENS);

  useEffect(() => {
    console.log("Use Effect Query Data");
    if (queryData) {
      console.log("queryData", queryData);
      setData(queryData);
    }
  }, [queryData]);

  useEffect(() => {

    const interval = setInterval(async () => {
      console.log("Refetching queries...");
      console.log("Use Effect 5s Interval call");

      await client.refetchQueries({
        include: [GET_TOKENS],
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      console.log("Interval cleared");
    };
  }, [queryData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log("queryData", queryData)
  return (
    <div className="p-5 pt-5 bg-white rounded-3xl bg-gradient-to-br from-gray-100 to-gray-300">
      <table className="table table-md table-zebra">
      <thead>
      <tr className="text-xl text-slate-950 bg-slate-300">
      <th>Token</th>
            <th>Symbol</th>
            <th>Total Liquidity</th>
            <th>Total Supply</th>
            <th>Trade Volume</th>
            <th>Number Tx</th>
          </tr>
        </thead>
        <tbody>
          {data.tokens.map((token: Token) => {
            const totalSupply = ethers.utils.formatEther(token.totalSupply);
            console.log("totalSupply", totalSupply);
            return (
              <tr className="hover" key={token.id}>
                <th>{token.name}</th>
                <td>{token.symbol}</td>
                <td>{formatReserve(token.totalLiquidity)}</td>
                <td>{totalSupply}</td>
                <td>{formatTradeVolume(token.tradeVolume)}</td>
                <td>{token.txCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;
