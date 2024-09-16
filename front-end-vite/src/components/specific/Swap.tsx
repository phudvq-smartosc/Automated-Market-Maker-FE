import TokensModal from "../../modal/TokensModal";
import LongButton from "../button/MaxWidthButton";
// export type Swap = {
//   srcImg: string;
//   name: string;
//   symbol: string;
// };
export default function Swap(): JSX.Element {
  return (
    <div>
      <button type="button" className="btn" onClick={toggleModal}>
        Open
      </button>
      <TokensModal open={showModal} onClose={toggleModal} />
      <LongButton content="Cap khong hop le" />
    </div>
  );
}
