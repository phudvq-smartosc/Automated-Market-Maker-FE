import React from "react";
import ChooseTokenButton from "../button/ChooseToken";
import { PairInterface } from "../../types/pair";
import ChooseLiquidityTokenButton from "../button/ChooseToken copy";
interface Props {
  amount: string;
  balance: string;
  reserve:string,
//   symbol: string;
    pair: PairInterface
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const AmountInputFieldPair: React.FC<Props> = ({
  amount,
  balance,
  reserve,
//   symbol,
    pair,
  onClick,
  onChange,
}: Props) => {
    const symbol = `${pair.token0.symbol} / ${pair.token1.symbol}`;
  return (
    //NOTE: Container for inside parent purpose
    <div className="container">
      <label className="flex flex-col items-center w-full h-32 pt-3 input input-bordered rounded-3xl">
        <div className="place-self-start">Liquidity Token Burn</div>
        <hr className="w-full h-px my-1 bg-gray-200 dark:bg-gray-700" ></hr>

        <div className="flex justify-between w-full">
          <input
            value={amount}
            type="text"
            className="h-10 text-3xl align-text-bottom max-w-52 place-self-start text-opacity-45"
            placeholder="0"
            onChange={onChange}
          />
          <ChooseLiquidityTokenButton content={symbol ? symbol : "TKN-TKN"} self_position="place-self-start" onClick={onClick}
          ></ChooseLiquidityTokenButton>{" "}
        </div>
        <div className="flex justify-between w-full">
          {reserve != "-1" ? 
            <span> Reserve: {reserve}</span> : 
            <span></span>
          }
            
          {balance != "-1" ? 
            <span> Balance: {balance}</span> : 
            <span></span>
          }
            
        </div>

      </label>

    </div>
  );
};

export default AmountInputFieldPair;
