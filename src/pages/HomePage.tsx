import { Link, useNavigate } from "react-router-dom";
import UserDetails from "../components/home/UserDetails";
import { useGetUserWorkoutPlans } from "../utils/queries/workoutQuery";
import { useAuth } from "../context/AuthProvider";
import WorkoutPlanCard from "../components/home/WorkoutPlanCard";
import { Sparkles } from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();
  const limit = 5;
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, { limit });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#000] p-4">
      <UserDetails />

      <button
        onClick={() => navigate("/aiGeneratedPlan")}
        className="text-[#ffa333] font-semibold text-lg bg-SecondaryBackgroundColor w-full p-2 mt-4 rounded-xl text-center flex gap-3 justify-center items-center"
      >
        <Sparkles size={18} />
        AI Generated Plans
        <Sparkles size={18} />
      </button>

      {data?.length === 0 ? (
        <div className="bg-[#444] p-2 rounded-xl mt-4 h-36 flex justify-center items-center">
          <p className="text-SecondaryTextColor font-semibold">
            You have no plans
          </p>
        </div>
      ) : (
        <div className="bg-SecondaryBackgroundColor p-2 rounded-xl mt-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-4">
              <h1 className="text-SecondaryTextColor font-semibold text-xl">
                Your Plans
              </h1>
            </div>
            <Link to={"/allWorkoutPlans"} className="text-blue-500 ">
              View all
            </Link>

            {/* <Link to={"/smallWorkouts"} className="text-blue-500">
              Small W
            </Link> */}
          </div>

          <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {isLoading ? (
              <div className="text-white">Loading...</div>
            ) : (
              data?.map((plan) => (
                <WorkoutPlanCard
                  key={plan.id}
                  planDetails={plan}
                  limit={limit}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
