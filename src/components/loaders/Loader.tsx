

const Loader = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-MainBackgroundColor">
      <div className="col-span-full flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa333]"></div>
      </div>
    </div>
  );
};

export default Loader;
