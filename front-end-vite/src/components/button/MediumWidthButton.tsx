interface Props {
    content: string;
  }
  const MediumWidthButton: React.FC<Props> = ({ content }) => {
    return (
      <button
        type="button"
        className="py-3 font-semibold border-2 w-96 rounded-2xl bg-component-color px-14"
      >
        {content}
      </button>
    );
  };
  export default MediumWidthButton;
  