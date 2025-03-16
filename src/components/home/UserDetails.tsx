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
import {
  UserPen,
  LandPlot,
  Forward,
  Search,
  LogOut,
  Telescope,
} from "lucide-react";
import { motion } from "motion/react";

const UserDetails = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const { data, isLoading } = getUserDetails(user?.id);
  const initialLetterOfName = getInitialLetter(data?.full_name);
  const navigate = useNavigate();

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
    { Icon: UserPen, action: () => navigate("/editProfile") },
    { Icon: LandPlot, action: () => setOpenCreateForm(true) },
    { Icon: Forward, action: () => navigate("/sharedplandetails") },
    { Icon: Search, action: () => setIsSearchOpen(true) },
    { Icon: Telescope, action: () => navigate("/publicplan") },
    { Icon: LogOut, action: () => handleLogout() },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="w-full md:flex justify-center">
      <div className="w-full lg:w-[40vw] md:w-[60vw]">
        <div className="w-full font-ubuntu flex gap-3">
          {/* Profile Image */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="h-32 w-32 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] rounded-xl border-2 border-[#a7a7a7] flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative"
          >
            {!data?.avatar_url ? (
              <p className="font-montserrat">{initialLetterOfName}</p>
            ) : (
              <img
                src={data?.avatar_url}
                alt="Image Preview"
                className="h-full w-full object-cover rounded-xl"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="bg-[#444444] p-2 rounded-xl w-[70%]"
          >
            <h1 className="text-PrimaryTextColor font-semibold text-xl">
              {data?.full_name}
            </h1>
            <h3 className="text-PrimaryTextColor font-semibold">
              {data?.username}
            </h3>
            <p className="text-SecondaryTextColor text-sm">{data?.email}</p>
          </motion.div>
        </div>

        <div className="flex mt-3 gap-3">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="h-60 bg-black w-[70%] rounded-xl overflow-hidden aspect-square"
          >
            <img src="/logoImg.jpg" className="h-full w-full object-cover" />
            {/* <video 
              src="/glith_pr.mp4"
              autoPlay
              muted
              loop
              className="h-full w-full object-cover"
            /> */}
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            className="h-60 bg-[#444444] rounded-xl p-2 grid grid-cols-2 gap-3 place-items-center"
          >
            {iconButtons.map(({ Icon, action }, index) => (
              <div
                key={index}
                className="bg-[#242424] rounded-full w-14 h-14 flex justify-center items-center hover:scale-105 transition"
                onClick={action}
              >
                <Icon color="#fff" size={24} />
              </div>
            ))}
          </motion.div>
        </div>

        {data?.bio ? (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
            className="mt-3 bg-[#444444] p-2 rounded-xl"
          >
            <h2 className="text-white text-lg font-semibold">About me</h2>
            <div className="bg-[#fff] h-1 w-10 rounded-full"></div>
            <p className="text-SecondaryTextColor leading-5 mt-2 whitespace-pre-line">
              {data.bio}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
            className="mt-3 min-h-32 bg-[#444444] p-2 rounded-xl flex justify-center items-center"
          >
            <p className="text-SecondaryTextColor font-medium"> No Bio </p>
          </motion.div>
        )}
      </div>

      {openCreateForm && (
        <CreateWorkoutPlan
          openCreateForm={openCreateForm}
          setOpenCreateForm={setOpenCreateForm}
        />
      )}

      <SearchSection
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    </div>
  );
};

export default UserDetails;
