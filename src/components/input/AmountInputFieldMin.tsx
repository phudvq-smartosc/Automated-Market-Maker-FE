import React from "react";
import ChooseTokenButton from "../button/ChooseToken";
interface Props {
  index: number;
  amount: string;
  amountMin: string;
  balance: string;
  reserve:string,
  onClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeMin: (e: React.ChangeEvent<HTMLInputElement>) => void;
  symbol: string;
}
const AmountInputFieldMin: React.FC<Props> = ({
  index,
  amount,
  amountMin,
  balance,
  reserve,
  symbol,
  onClick,
  onChange,
  onChangeMin,
}: Props) => {
  //TODO: khai bao bien set
  // TODO: If la token1 => se luu gia tri amount vao global state cua token 1
  // If token2 => luu gia tri amount vao gloval state cuar token 2

  return (
    //NOTE: Container for inside parent purpose
    <div className="container">
      <label className="flex flex-col items-center w-full pt-3 h-28 input input-bordered rounded-3xl">
        <div className="flex w-full">
            <div>
                Expected
                <input
                    value={amount}
                    type="text"
                    className="h-10 text-3xl align-text-bottom border-r-4 max-w-36 place-self-start text-opacity-45"
                    placeholder="0"
                    onChange={onChange}
                />
                    
            </div>
            <div className="pl-4">
                Min Amount
                <input
                    value={amountMin}
                    type="text"
                    className="h-10 text-3xl align-text-bottom max-w-40 place-self-start text-opacity-45"
                    placeholder="0"
                    onChange={onChangeMin}
                />                
            </div>

          <ChooseTokenButton content={symbol ? symbol : "TKN"} self_position="place-self-stretch" onClick={onClick}
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

export default AmountInputFieldMin;
