import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import Loader from "@/components/loaders/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { WorkoutPlansType } from "@/types/workoutPlans";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { getUserDetails } from "@/utils/queries/userProfileQuery";
import { useOtherUsersAllPublicPlans } from "@/utils/queries/workoutQuery";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { profileId } = useParams();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading: userDetailsLoading } = getUserDetails(profileId);
  const { data: newPlans, isLoading: planLoad } = useOtherUsersAllPublicPlans(
    profileId!,
    page,
    limit
  );

  const [planData, setPlanData] = useState<WorkoutPlansType[]>([]);

  useEffect(() => {
    if (newPlans) {
      setPlanData((prev) => [...prev, ...newPlans]);
    }
  }, [newPlans]);

  if (userDetailsLoading) return <Loader />;

  if (user?.id?.toString() === profileId) {
    return (
      <div className="bg-MainBackgroundColor min-h-screen w-full p-4">
        <p className="text-center text-PrimaryTextColor text-lg">Oops!!!</p>
        <p className="text-SecondaryTextColor text-center">
          You are not allowed to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4">
      <div className="flex justify-center flex-col items-center">
        {data?.avatar_url ? (
          <Avatar>
            <AvatarImage
              src={data.avatar_url}
              className="h-24 w-24 rounded-full"
            />
            <AvatarFallback>{getInitialLetter(data.full_name)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-24 w-24 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] rounded-full flex justify-center items-center text-PrimaryTextColor font-bold text-xl">
            {getInitialLetter(data?.full_name)}
          </div>
        )}

        <h1 className="text-PrimaryTextColor text-lg font-medium mt-2">
          {data?.full_name}
        </h1>
        <h1 className="text-PrimaryTextColor font-medium">{data?.username}</h1>
        {data?.bio && (
          <p className="text-sm text-SecondaryTextColor">{data.bio}</p>
        )}
      </div>

      <div className="flex items-center mt-4 justify-between">
        <h1 className="text-PrimaryTextColor text-lg font-medium">
          Workout Plans
        </h1>
      </div>

      <div>
        {planLoad && page === 1 ? (
          <Loader />
        ) : planData && planData.length > 0 ? (
          planData.map((plan, index) => (
            <div key={index} className="mt-2">
              <WorkoutPlanCard planDetails={plan} />
            </div>
          ))
        ) : (
          <p className="text-SecondaryTextColor text-center">
            No Plans For Public
          </p>
        )}
      </div>

      {newPlans && newPlans.length < limit && (
        <p className="text-SecondaryTextColor font-medium text-center mt-4">
          {" "}
          No More Plans{" "}
        </p>
      )}

      <div className="flex justify-center">
        {planData && planData.length >= limit ? (
          <Button
            variant={"secondary"}
            onClick={() => setPage((prev) => prev + 1)}
            className={`mt-4 px-4 py-2 rounded-lg ${
              newPlans && newPlans.length < limit
                ? "cursor-not-allowed opacity-70"
                : ""
            }`}
            disabled={newPlans && newPlans.length < limit}
          >
            {planLoad ? "Loading..." : "Load More"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ProfilePage;
