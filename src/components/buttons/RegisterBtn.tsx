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
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500"
          } font-semibold w-full h-10 rounded-lg mt-5 uppercase flex justify-center items-center text-white`}
          disabled={loading}
    >
      {loading ? <ClipLoader color='#000' size={20} /> : btnName}
    </button>
  )
}

export default RegisterBtn
