import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#000]">
      <ClipLoader color="#fff" size={60} />
    </div>
  );
};

export default Loader;
