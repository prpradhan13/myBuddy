import { Link } from "react-router-dom";
import UserDetails from "../components/home/UserDetails";
import { useGetUserWorkoutPlans } from "../utils/queries/workoutQuery";
import { useAuth } from "../context/AuthProvider";
import WorkoutPlanCard from "../components/home/WorkoutPlanCard";

const HomePage = () => {
  const { user } = useAuth();
  const limit= 5;
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, { limit });

  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] p-4">
      <UserDetails />

      {data?.length === 0 ? (
        <div
          className="bg-[#444] p-2 rounded-xl mt-4 h-36 flex justify-center items-center"
        >
          <p className="text-SecondaryTextColor font-semibold">
            You have no plans
          </p>
        </div>
      ) : (
        <div
          className="bg-[#444] p-2 rounded-xl mt-4"
        >
          <div className="w-full mt-4 flex justify-between items-center">
            <h1 className="text-SecondaryTextColor font-semibold text-xl">
              Your Plans
            </h1>
            <Link to={"/allWorkoutPlans"} className="text-blue-500">
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
                <WorkoutPlanCard key={plan.id} planDetails={plan} limit={limit} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
