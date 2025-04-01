

const NotValidUser = () => {
  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins grid place-content-center">
      <p className="text-PrimaryTextColor text-xl text-center">
        You don't have access, what are you doing here.{" "}
        <span className="text-red-500">I request, please don't do this.</span>
      </p>
    </div>
  );
};

export default NotValidUser;
