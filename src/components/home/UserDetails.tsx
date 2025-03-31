import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getInitialLetter } from "../../utils/helpingFunctions";
import { getUserDetails } from "../../utils/queries/userProfileQuery";
import Loader from "../loaders/Loader";
import { useState } from "react";
import CreateWorkoutPlan from "../forms/CreateWorkoutPlan";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase";
import SearchSection from "../publicPlan/SearchSection";
import { UserPen, LandPlot, Send, Search, LogOut, MessageCircle } from "lucide-react";
import EditUserDetails from "../forms/EditUserDetails";
import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import { cld } from "@/utils/lib/cloudinary";
import EditBanner from "../forms/EditBanner";
import { useFollowers, useFollowings } from "@/utils/queries/followQuery";
import { ClipLoader } from "react-spinners";

const UserDetails = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditUserDetailsOpen, setIsEditUserDetailsOpen] = useState(false);
  const [isBannerDrawerOpen, setIsBannerDrawerOpen] = useState(false);

  const { user } = useAuth();
  const userId = user && user.id;
  const navigate = useNavigate();
  
  const { data, isLoading } = getUserDetails(user?.id);
  const { data: userFollowers, isLoading: followersLoad } = useFollowers(
    userId!
  );
  const { data: userFollowings, isLoading: followingLoad } = useFollowings(
    userId!
  );

  const initialLetterOfName = getInitialLetter(data?.full_name);

  const handleLogout = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error("No active session to log out");
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Logout error: ${error.message}`);
      throw new Error(error.message);
    }

    localStorage.clear();
    toast.success("Logged out successfully!");
  };

  const iconButtons = [
    { Icon: UserPen, action: () => setIsEditUserDetailsOpen(true) },
    { Icon: LandPlot, action: () => setOpenCreateForm(true) },
    { Icon: Send, action: () => navigate("/sharedplandetails") },
    { Icon: Search, action: () => setIsSearchOpen(true) },
    { Icon: MessageCircle, action: () => navigate("/chatPage") },
    { Icon: LogOut, action: () => handleLogout() },
  ];

  const handleClickBanner = () => {
    setIsBannerDrawerOpen(true);
  };

  if (isLoading) return <Loader />;
  if (!data) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h1>No User data</h1>
      </div>
    );
  }

  const bannerVideo = cld.video(data.profile_banner?.content_path);
  const bannerImage = cld.image(data.profile_banner?.content_path);

  return (
    <div className="w-full md:flex justify-center">
      <div className="w-full lg:w-[30vw] md:w-[60vw]">
        <div className="w-full font-ubuntu flex gap-3">
          {/* Profile Image */}
          <div className="h-32 w-32 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] rounded-xl border-2 border-[#a7a7a7] flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
            {!data.avatar_url ? (
              <p className="font-montserrat">{initialLetterOfName}</p>
            ) : (
              <img
                src={data.avatar_url}
                alt="Image Preview"
                className="h-full w-full object-cover rounded-xl"
              />
            )}
          </div>

          <div className="bg-SecondaryBackgroundColor p-2 rounded-xl w-[70%]">
            <h1 className="text-PrimaryTextColor font-semibold text-xl">
              {data.full_name}
            </h1>
            <h3 className="text-PrimaryTextColor font-semibold">
              {data.username}
            </h3>
            <p className="text-SecondaryTextColor text-sm">{data.email}</p>

            <div className="flex gap-3">
              <div className="bg-transparent">
                {followersLoad ? (
                  <ClipLoader size={14} color="#fff" />
                ) : (
                  <span className="text-white font-medium">
                    {userFollowers?.count}
                  </span>
                )}
                <span className="text-white font-medium leading-5 text-sm ml-1">
                  Follower
                </span>
              </div>

              <div className="bg-transparent">
                {followingLoad ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  <span className="text-white font-medium">
                    {userFollowings?.count}
                  </span>
                )}
                <span className="text-white font-medium leading-5 text-sm ml-1">
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <button
            onClick={handleClickBanner}
            className="h-60 bg-black w-[70%] rounded-xl overflow-hidden aspect-square"
          >
            {!data.profile_banner ? (
              <img src="/logoImg.jpg" className="h-full w-full object-cover" />
            ) : data.profile_banner.content_type === "video" ? (
              <AdvancedVideo
                cldVid={bannerVideo}
                autoPlay
                loop
                className="h-full w-full object-cover"
              />
            ) : (
              <AdvancedImage
                cldImg={bannerImage}
                className="h-full w-full object-cover"
              />
            )}
          </button>

          <div className="h-60 bg-SecondaryBackgroundColor rounded-xl p-2 grid grid-cols-2 gap-3 place-items-center">
            {iconButtons.map(({ Icon, action }, index) => (
              <div
                key={index}
                className="bg-BtnBgClr rounded-xl w-12 h-12 flex justify-center items-center hover:scale-105 transition"
                onClick={action}
              >
                <Icon color={"#000"} size={24} />
              </div>
            ))}
          </div>
        </div>

        {data.bio ? (
          <div className="mt-3 bg-SecondaryBackgroundColor p-2 rounded-xl">
            <h2 className="text-PrimaryTextColor text-lg font-semibold">About me</h2>
            <div className="bg-PrimaryTextColor h-1 w-10 rounded-full"></div>
            <p className="text-SecondaryTextColor leading-5 mt-2 whitespace-pre-line">
              {data.bio}
            </p>
          </div>
        ) : (
          <div className="mt-3 min-h-32 bg-[#444444] p-2 rounded-xl flex justify-center items-center">
            <p className="text-SecondaryTextColor font-medium"> No Bio </p>
          </div>
        )}
      </div>

      {openCreateForm && (
        <CreateWorkoutPlan
          openCreateForm={openCreateForm}
          setOpenCreateForm={setOpenCreateForm}
          accessForCreatePlan={data.access_create_plan}
        />
      )}

      <SearchSection
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      <EditUserDetails
        isEditUserDetailsOpen={isEditUserDetailsOpen}
        setIsEditUserDetailsOpen={setIsEditUserDetailsOpen}
        userAvatar={data.avatar_url}
        userBio={data.bio}
        userFullName={data.full_name}
        userName={data.username}
      />

      <EditBanner
        isBannerDrawerOpen={isBannerDrawerOpen}
        setIsBannerDrawerOpen={setIsBannerDrawerOpen}
      />
    </div>
  );
};

export default UserDetails;
