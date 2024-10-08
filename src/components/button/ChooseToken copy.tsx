interface Props {
  content: string;
  self_position: string;
  onClick: () => void;
  //TODO: Add index field
}
const ChooseLiquidityTokenButton: React.FC<Props> = ({
  content,
  self_position,
  onClick,
}) => {
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={` min-w-32 max-w-96 max-h-12 rounded-2xl border-4 border-solid px-1 py-2 text-center font-semibold ${self_position} z-50 hover:bg-gray-100`}
    >
      {content}
      
    </button>
  );
};
export default ChooseLiquidityTokenButton;
