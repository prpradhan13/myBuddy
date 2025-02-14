import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import Loader from "@/components/loaders/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthProvider";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { getUserDetails } from "@/utils/queries/userProfileQuery";
import { useUsersPublicPlans } from "@/utils/queries/workoutQuery";
import { useParams } from "react-router-dom";
import { FixedSizeList as List } from "react-window";

const ProfilePage = () => {
  const { profileId } = useParams();
  const { user } = useAuth();

  const { data, isLoading: userDetailsLoading } = getUserDetails(profileId);
  const { data: planData, isLoading: planLoad } = useUsersPublicPlans(
    profileId!
  );

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
            <AvatarImage src={data.avatar_url} className="h-24 w-24 rounded-full" />
            <AvatarFallback>{getInitialLetter(data.full_name)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-24 w-24 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989]  rounded-full flex justify-center items-center text-PrimaryTextColor font-bold text-xl">
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
        <p className="text-sm text-PrimaryTextColor font-medium">
          Stars: {data?.stars}
        </p>
      </div>

      {planLoad ? (
        <Loader />
      ) : planData && planData.length > 0 ? (
        <List
          height={400}
          itemCount={planData?.length || 0}
          itemSize={120}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style} className="mt-2">
              <WorkoutPlanCard key={planData[index].id} planDetails={planData[index]} />
            </div>
          )}
        </List>
      ) : (
        <p className="text-SecondaryTextColor text-center">No Plans For Public</p>
      )}
    </div>
  );
};

export default ProfilePage;
