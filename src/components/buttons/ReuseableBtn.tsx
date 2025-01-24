
interface ReuseableBtnProps {
    btnName: string;
    onClick: () => void;
}

const ReuseableBtn = ({ btnName, onClick }: ReuseableBtnProps) => {
  return (
    <button onClick={onClick} className={`bg-MainButtonColor capitalize text-sm rounded-md font-semibold px-2 py-1`}>
      {btnName}
    </button>
  )
}

export default ReuseableBtn
