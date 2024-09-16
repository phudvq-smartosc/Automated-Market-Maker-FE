interface Props {
  content: string;
  self_position: string;
  onClick: () => void;
}
const ShortWidthButton: React.FC<Props> = ({
  content,
  self_position,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl bg-component-color px-10 py-2 text-center font-semibold ${self_position} z-50 hover:bg-base-300`}
    >
      {content}
    </button>
  );
};
export default ShortWidthButton;
