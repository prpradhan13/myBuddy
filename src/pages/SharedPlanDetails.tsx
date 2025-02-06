import ErrorPage from "@/components/loaders/ErrorPage";
import Loader from "@/components/loaders/Loader";
import { useAuth } from "@/context/AuthProvider";
import { useGetSharedPlan } from "@/utils/queries/sharedPlanQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SharedPlanDetails = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useGetSharedPlan(userId!);
  const sharedPlansData = data?.map((item) => item.workoutplan);

  const handleBackBtn = () => {
    navigate(-1);
  };

  if (isPending) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-MainBackgroundColor p-4 min-h-screen w-full font-poppins">
      <h1 className="text-xl text-PrimaryTextColor font-semibold mb-3 flex items-center gap-2">
        <ArrowLeft onClick={handleBackBtn} className="cursor-pointer" />
        Shared Plans
      </h1>
      {sharedPlansData && sharedPlansData?.length > 0 ? (
        sharedPlansData?.map((item) => (
          <div
            className="bg-SecondaryBackgroundColor mb-3 rounded-lg p-3"
            key={item.id}
          >
            <Link to={`/workoutPlanDetails/${item.id}`}>
              <h1 className="text-PrimaryTextColor text-lg font-semibold">
                {item.plan_name}
              </h1>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <Avatar>
                {!item.profiles.avatar_url ? (
                  <AvatarFallback className="w-10 h-10 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] text-PrimaryTextColor text-sm font-semibold">
                    {getInitialLetter(item.profiles.full_name)}
                  </AvatarFallback>
                ) : (
                  <AvatarImage
                    src={item.profiles.avatar_url}
                    alt="profileImg"
                    className="w-10 h-10"
                  />
                )}
              </Avatar>
              <h1 className="text-SecondaryTextColor text-sm">
                {item.profiles.email}
              </h1>
            </div>
          </div>
        ))
      ) : (
        <p className="text-SecondaryTextColor text-center mt-5">No plans rechived</p>
      )}
    </div>
  );
};

export default SharedPlanDetails;
