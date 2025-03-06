import { BarLoader} from "react-spinners";

const Loader = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-MainBackgroundColor">
      <BarLoader color="#a6ff17" />
    </div>
  );
};

export default Loader;
