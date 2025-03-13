import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getInitialLetter } from "../../utils/helpingFunctions";
import { getUserDetails } from "../../utils/queries/userProfileQuery";
import Loader from "../loaders/Loader";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import CreateWorkoutPlan from "../forms/CreateWorkoutPlan";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase";
import SearchSection from "../publicPlan/SearchSection";

const UserDetails = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);

  const { user } = useAuth();

  const { data, isLoading } = getUserDetails(user?.id);

  const initialLetterOfName = getInitialLetter(data?.full_name);

  const navigate = useNavigate();

  const handleEditBtnClick = () => {
    navigate("/editProfile");
  };

  const handleCreatePlanBtnClick = () => {
    setOpenCreateForm(true);
  };

  const handleSharedBtnClick = () => {
    navigate("/sharedplandetails");
  };

  const handleExploreBtnClick = () => {
    navigate("/publicplan");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Logout error: ${error.message}`);
      throw new Error(error.message);
    }
    localStorage.clear();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="w-full md:flex justify-center">
      <div className="w-full lg:w-[40vw] md:w-[60vw]">
        <div className="font-ubuntu flex justify-between items-center">
          <div className="">
            <h1 className="text-PrimaryTextColor font-semibold text-2xl">
              {data?.full_name}
            </h1>
            <h3 className="text-PrimaryTextColor font-semibold text-lg">
              {data?.username}
            </h3>
            <p className="text-SecondaryTextColor text-sm">{data?.email}</p>
          </div>

          {/* Profile Image */}
          <div className="h-24 w-24 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] rounded-full border-2 border-[#a7a7a7] flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
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

        {data?.bio && (
          <div className="mt-2">
            <h2 className="text-white font-semibold">About me</h2>
            <div className="bg-[#fff] h-1 w-10 rounded-full"></div>
            <p className="text-SecondaryTextColor text-sm mt-2 whitespace-pre-line">{data.bio}</p>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Manage</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleEditBtnClick} className="">
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreatePlanBtnClick} className="">
                Create Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSharedBtnClick} className="">
                Shared Plan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 hover:text-red-500"
              >
                Logout <LogOut color="#ef4444" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SearchSection />

          <Button variant={"secondary"} onClick={handleExploreBtnClick}>
            Explore Plans
          </Button>
        </div>
      </div>

      {openCreateForm && (
        <CreateWorkoutPlan
          openCreateForm={openCreateForm}
          setOpenCreateForm={setOpenCreateForm}
        />
      )}
    </div>
  );
};

export default UserDetails;
