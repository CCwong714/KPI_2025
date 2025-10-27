type TLinkButton = {
  text: string;
  onClick: () => void;
};

const LinkButton = ({ text, onClick }: TLinkButton) => {
  return (
    <div className='flex items-center justify-end'>
      <button
        type='button'
        className='text-blue-600 text-end underline text-xs cursor-pointer'
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default LinkButton;
