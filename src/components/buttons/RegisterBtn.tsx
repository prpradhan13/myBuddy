import { ClipLoader } from 'react-spinners';

interface RegisterBtnProps {
    loading: boolean;
    btnName: string;
}

const RegisterBtn = ({ btnName, loading }: RegisterBtnProps) => {
  return (
    <button
        type='submit'
        className={`${
            loading ? "bg-ButtonLoadingColor cursor-not-allowed" : "bg-MainButtonColor"
          } font-semibold w-full h-10 rounded-lg mt-5 uppercase flex justify-center items-center text-black`}
        disabled={loading}
    >
      {loading ? <ClipLoader color='#000' size={20} /> : btnName}
    </button>
  )
}

export default RegisterBtn
