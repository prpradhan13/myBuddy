import { Link } from "react-router-dom";
import UserDetails from "../components/home/UserDetails";
import { useGetUserWorkoutPlans } from "../utils/queries/workoutQuery";
import { useAuth } from "../context/AuthProvider";
import WorkoutPlanCard from "../components/home/WorkoutPlanCard";

const HomePage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, { limit: 5 });

  return (
    <div className="min-h-screen w-full bg-[#000000] p-4">
      <UserDetails />

      {data?.length === 0 ? (
        <div className="mt-6">
          <p className="text-SecondaryTextColor font-semibold text-center">You have no plans</p>
        </div>
      ) : (
        <>
          <div className="w-full mt-6 flex justify-between items-center">
            <h1 className="text-SecondaryTextColor font-semibold text-xl">
              Workout Plans
            </h1>
            <Link to={"/allWorkoutPlans"} className="text-blue-500">
              View all
            </Link>
          </div>

          <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="text-white">Loading...</div>
            ) : (
              data?.map((plan) => (
                <WorkoutPlanCard key={plan.id} planDetails={plan}  />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
