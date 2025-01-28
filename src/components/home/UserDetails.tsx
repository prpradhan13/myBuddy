import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getInitialLetter } from "../../utils/helpingFunctions";
import { getUserDetails } from "../../utils/queries/userProfileQuery";
import Loader from "../loaders/Loader";
import { Button } from "../ui/button";

const UserDetails = () => {
  const { user } = useAuth();

  const { data, isLoading } = getUserDetails(user?.id);

  const initialLetterOfName = getInitialLetter(data?.full_name);

  const navigate = useNavigate();

  const handleEditBtnClick = () => {
    navigate("/editProfile");
  };

  const handleCreatePlanBtnClick = () => {
    navigate("/createPlan");
  };

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
        <p className="text-SecondaryTextColor text-sm">{data?.email}</p>

        <div className="flex gap-2 mt-3">
          <Button variant="secondary" onClick={handleEditBtnClick} >
            Edit Profile
          </Button>
          <Button variant="secondary" onClick={handleCreatePlanBtnClick} className="">
            Create Plan
          </Button>
        </div>
      </div>

      {/* Profile Image */}
      <div className="h-24 w-24 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989]  rounded-full flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
        {!data?.avatar_url ? (
          <p className="font-montserrat">{initialLetterOfName}</p>
        ) : (
          <img
            src={data?.avatar_url}
            alt="Image Preview"
            className="h-full w-full object-cover rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default UserDetails;
