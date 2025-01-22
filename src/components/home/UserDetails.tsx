import { useAuth } from "../../context/AuthProvider";
import { getInitialLetter } from "../../utils/helpingFunctions";
import { getUserDetails } from "../../utils/queries/userProfileQuery";
import Loader from "../loaders/Loader";
import { FaCamera } from "react-icons/fa";

const UserDetails = () => {
  const { user } = useAuth();

  const { data, isLoading } = getUserDetails(user?.id);

  const initialLetterOfName = getInitialLetter(data?.full_name);

  if (isLoading) return <Loader />;

  return (
    <div className="flex justify-between items-center w-full">
        <div className="font-ubuntu">
            <h1 className="text-PrimaryTextColor font-semibold text-2xl">
                {data?.full_name}
            </h1>
            <h3 className="text-PrimaryTextColor font-semibold text-lg">
                {data?.username}
            </h3>
            <p className="text-SecondaryTextColor text-sm">
                {data?.email}
            </p>

            <button className="bg-MainButtonColor mt-3 p-1 rounded-md font-semibold text-sm">
                Edit Profile
            </button>
        </div>

        {/* Profile Image */}
      <div className="h-24 w-24 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989]  rounded-full flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
        {!data?.avatar_url ? <p className="font-montserrat">{initialLetterOfName}</p> : ""}

        <button className="bg-[#f1f1f1] w-8 h-8 border-2 border-MainBackgroundColor flex justify-center items-center rounded-full absolute bottom-0 -right-1">
          <FaCamera color="#000" size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
