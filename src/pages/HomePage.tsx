import { Link, useNavigate } from "react-router-dom";
import UserDetails from "../components/home/UserDetails";
import { useGetUserWorkoutPlans } from "../utils/queries/workoutQuery";
import { useAuth } from "../context/AuthProvider";
import WorkoutPlanCard from "../components/home/WorkoutPlanCard";
import { ChevronRight, Sparkles } from "lucide-react";
import Loader from "@/components/loaders/Loader";

const HomePage = () => {
  const { user } = useAuth();
  const limit = 5;
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, { limit });
  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <UserDetails />

        <button
          onClick={() => navigate("/aiGeneratedPlan")}
          className="w-full mt-6 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#2a2a2a] transition-all duration-300 shadow-lg hover:shadow-[#2a2a2a]/20 flex items-center justify-center gap-3 group"
        >
          <Sparkles
            size={20}
            className="text-[#ffa333] group-hover:scale-110 transition-transform"
          />
          <span className="text-[#ffa333] font-semibold text-lg">
            AI Generated Plans
          </span>
          <Sparkles
            size={20}
            className="text-[#ffa333] group-hover:scale-110 transition-transform"
          />
        </button>

        {data?.length === 0 ? (
          <div className="mt-6 p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-[#e0e0e0] font-medium text-lg">
              You have no workout plans yet
            </p>
            <p className="text-[#a0a0a0] mt-2 text-center">
              Start by creating a new plan or try our AI-generated plans
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 sm:p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-[#e0e0e0]">
                Your Workout Plans
              </h1>
              <Link
                to={"/allWorkoutPlans"}
                className="text-[#ffa333] hover:text-[#ffb366] font-medium transition-colors flex items-center gap-2"
              >
                View all plans
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.map((plan) => (
                <WorkoutPlanCard
                  key={plan.id}
                  planDetails={plan}
                  limit={limit}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
