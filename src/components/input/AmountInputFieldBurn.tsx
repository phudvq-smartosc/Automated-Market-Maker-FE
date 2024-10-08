import React from "react";
import ChooseTokenButton from "../button/ChooseToken";
interface Props {
  index: number;
  amount: string;
  balance: string;
  reserve:string,
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  symbol: string;
}
const AmountInputFieldBurn: React.FC<Props> = ({
  index,
  amount,
  balance,
  reserve,
  symbol,
  onClick,
  onChange,
}: Props) => {
  //TODO: khai bao bien set
  // TODO: If la token1 => se luu gia tri amount vao global state cua token 1
  // If token2 => luu gia tri amount vao gloval state cuar token 2

  return (
    //NOTE: Container for inside parent purpose
    <div className="container">

      <label className="flex flex-col items-center w-full h-32 pt-3 input input-bordered rounded-3xl">
        <div className="place-self-start">Minimum Expected Token Amount</div>
        <hr className="w-full h-px my-1 bg-gray-200 dark:bg-gray-700" ></hr>

        <div className="flex justify-between w-full">

          <input
            value={amount}
            type="text"
            className="h-10 text-3xl align-text-bottom place-self-start text-opacity-45"
            placeholder="0"
            onChange={onChange}
          />
          <ChooseTokenButton content={symbol ? symbol : "TKN"} self_position="place-self-start" onClick={onClick}
          ></ChooseTokenButton>{" "}
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

export default AmountInputFieldBurn;
