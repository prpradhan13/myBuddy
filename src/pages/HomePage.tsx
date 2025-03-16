import { Link } from "react-router-dom";
import UserDetails from "../components/home/UserDetails";
import { useGetUserWorkoutPlans } from "../utils/queries/workoutQuery";
import { useAuth } from "../context/AuthProvider";
import WorkoutPlanCard from "../components/home/WorkoutPlanCard";
import { motion } from "motion/react";

const HomePage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, { limit: 5 });

  return (
    <div className="min-h-screen w-full bg-[#1d1d1d] p-4">
      <UserDetails />

      {data?.length === 0 ? (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
          className="bg-[#444] p-2 rounded-xl mt-4 h-36 flex justify-center items-center"
        >
          <p className="text-SecondaryTextColor font-semibold">
            You have no plans
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
          className="bg-[#444] p-2 rounded-xl mt-4"
        >
          <div className="w-full mt-6 flex justify-between items-center">
            <h1 className="text-SecondaryTextColor font-semibold text-xl">
              Your Plans
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
                <WorkoutPlanCard key={plan.id} planDetails={plan} />
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
