import React from "react";
import ShortWidthButton from "../button/ShortWidthButton";

interface Props {
  onClick: () => void;
}
const AmountInputField: React.FC<Props> = ({ onClick }: Props) => {
  return (
    //NOTE: Container for inside parent purpose
    <div className="container">
      <label className="input input-bordered flex h-24 w-full items-center rounded-3xl pt-3">
        <input
          type="text"
          className="h-10 place-self-start align-text-bottom text-3xl text-opacity-45"
          placeholder="0"
        />
        <ShortWidthButton
          content="TKN"
          self_position="place-self-start"
          onClick={onClick}
        ></ShortWidthButton>{" "}
      </label>
    </div>
  );
};

export default AmountInputField;
