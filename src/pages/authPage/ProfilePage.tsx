import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import Loader from "@/components/loaders/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { WorkoutPlansType } from "@/types/workoutPlans";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { cld } from "@/utils/lib/cloudinary";
import {
  useCreateFollow,
  useFollowers,
  useFollowings,
} from "@/utils/queries/followQuery";
import { getUserDetails } from "@/utils/queries/userProfileQuery";
import {
  useOtherUsersAllPublicPlans,
  useUsersTotalPlanCount,
} from "@/utils/queries/workoutQuery";
import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

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
  const { data: planCount, isLoading: planCountLoad } = useUsersTotalPlanCount(
    profileId!
  );
  const { data: userFollowers, isLoading: followersLoad } = useFollowers(
    profileId!
  );
  const { data: userFollowings, isLoading: followingLoad } = useFollowings(
    profileId!
  );
  const { mutate, isPending } = useCreateFollow();
  const queryClient = useQueryClient();

  const [planData, setPlanData] = useState<WorkoutPlansType[]>([]);

  useEffect(() => {
    if (newPlans) {
      setPlanData((prev) => [...prev, ...newPlans]);
    }
  }, [newPlans]);

  const initialLetterOfName = getInitialLetter(data?.full_name);

  if (userDetailsLoading) return <Loader />;

  if (!user) {
    return (
      <div className="bg-MainBackgroundColor min-h-screen w-full p-4">
        <p className="text-center text-PrimaryTextColor text-lg">Oops!!!</p>
        <p className="text-SecondaryTextColor text-center">
          You need to login to access this page.
        </p>
      </div>
    );
  }

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

  if (!data) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h1>No User data</h1>
      </div>
    );
  }

  const userFollow = userFollowers?.followerIds.includes(user.id);

  const bannerVideo = cld.video(data?.profile_banner?.content_path);
  const bannerImage = cld.image(data?.profile_banner?.content_path);

  const onClickFollowBtn = () => {
    mutate(
      { isFollow: userFollow, profileId: profileId! },
      {
        onSuccess: () => {
          queryClient.setQueryData(
            ["followerAndCount", profileId],
            (oldData: {count: number; followerIds: string[]} | undefined) => {
              if (!oldData) return { count: 1, followerIds: [user.id] };

              return {
                ...oldData,
                count: userFollow ? oldData.count - 1 : oldData.count + 1,
                followerIds: userFollow ? oldData.followerIds.filter((id) => id !== user.id) : [...oldData.followerIds, user.id],
              }
            }
          );
        },
        onError: () => {
          toast.error("Failed to follow the user");
        }
      }
    );
  };

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4">
      <div className="w-full font-ubuntu flex gap-3">
        <div className="h-32 w-32 bg-gradient-to-t from-[#000000] via-[#1c1c1c] to-[#3e3e3e] rounded-xl border-2 border-[#a7a7a7] flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
          {!data.avatar_url ? (
            <p className="font-montserrat">{initialLetterOfName}</p>
          ) : (
            <img
              src={data.avatar_url}
              alt="Profile Image"
              className="h-full w-full object-cover rounded-xl"
            />
          )}
        </div>

        <div className="bg-[#444444] p-2 rounded-xl w-[70%]">
          <h1 className="text-PrimaryTextColor font-semibold text-xl">
            {data.full_name}
          </h1>
          <h3 className="text-PrimaryTextColor font-semibold">
            {data.username}
          </h3>

          <div className="">
            {userFollow ? (
              <Button
                variant={"secondary"}
                disabled={isPending}
                className="mt-2 px-4 py-2 rounded-lg bg-red-500"
                onClick={onClickFollowBtn}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                variant={"secondary"}
                disabled={isPending}
                className="mt-2 px-4 py-2 rounded-lg"
                onClick={onClickFollowBtn}
              >
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex mt-3 justify-between">
        <div className="h-60 bg-black w-[70%] rounded-xl overflow-hidden aspect-square">
          {!data.profile_banner ? (
            <img src="/logoImg.jpg" className="h-full w-full object-cover" />
          ) : data.profile_banner.content_type === "video" ? (
            <AdvancedVideo
              cldVid={bannerVideo}
              autoPlay
              muted
              loop
              className="h-full w-full object-cover"
            />
          ) : (
            <AdvancedImage
              cldImg={bannerImage}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="h-60 bg-[#444444] w-[27%] rounded-xl p-2 grid gap-3">
          <div className="bg-MainBackgroundColor w-full p-2 rounded-xl flex flex-col justify-center items-center">
            {planCountLoad ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <span className="text-white font-medium text-lg">
                {planCount?.count}
              </span>
            )}
            <span className="text-white font-medium leading-5">
              Public Plans
            </span>
          </div>

          <div className="bg-MainBackgroundColor w-full p-2 rounded-xl flex flex-col justify-center items-center">
            {followersLoad ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <span className="text-white font-medium text-lg">
                {userFollowers?.count}
              </span>
            )}
            <span className="text-white font-medium leading-5">Follower</span>
          </div>

          <div className="bg-MainBackgroundColor w-full p-2 rounded-xl flex flex-col justify-center items-center">
            {followingLoad ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <span className="text-white font-medium text-lg">
                {userFollowings?.count}
              </span>
            )}
            <span className="text-white font-medium leading-5">Following</span>
          </div>
        </div>
      </div>

      {data.bio ? (
        <div className="mt-3 bg-[#444444] p-2 rounded-xl">
          <h2 className="text-white text-lg font-semibold">About me</h2>
          <div className="bg-[#fff] h-1 w-10 rounded-full"></div>
          <p className="text-SecondaryTextColor leading-5 mt-2 whitespace-pre-line">
            {data.bio}
          </p>
        </div>
      ) : (
        <div className="mt-3 min-h-32 bg-[#444444] p-2 rounded-xl flex justify-center items-center">
          <p className="text-SecondaryTextColor font-medium"> No Bio </p>
        </div>
      )}

      <div className="mt-4 justify-between bg-[#444] p-2 rounded-xl">
        {planData && planData.length > 0 && (
          <h1 className="text-PrimaryTextColor text-lg font-medium">
            Workout Plans
          </h1>
        )}

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
      </div>

      {newPlans && newPlans.length < limit && newPlans?.length > 0 && (
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
