import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import WorkoutDayLoader from "@/components/loaders/WorkoutDayLoader";
import { useAuth } from "@/context/AuthProvider";
import { useGetUserWorkoutPlans } from "@/utils/queries/workoutQuery";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AllWorkoutPlan = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const offset = currentPage * 5;
  const { user } = useAuth();
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, {
    limit,
    offset
  });
  
  const isLastPage = data && data.length < limit;
  const isFirstPage = currentPage === 0;
  
  const handleNextBtn = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const handlePreviousBtn = () => {
    if (!isFirstPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  
  if (isLoading) return <WorkoutDayLoader />;
  if (!data) {
    return (
      <div className="bg-[#0a0a0a] w-full min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center min-h-[200px]">
            <h1 className="text-[#e0e0e0] text-lg font-medium">No Workout Plans</h1>
            <p className="text-[#a0a0a0] mt-2 text-center">
              Start by creating a new plan or try our AI-generated plans
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] w-full min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-4 sm:p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#e0e0e0]">All Workout Plans</h1>
            <div className="flex items-center gap-2 text-[#a0a0a0]">
              <span className="text-sm">Page {currentPage + 1}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <WorkoutPlanCard 
                planDetails={item} 
                key={item.id}
                limit={limit}
              />
            ))}
          </div>

          {data.length === 0 && (
            <div className="p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-center min-h-[200px]">
              <h1 className="text-[#e0e0e0] text-lg font-medium">No Workout Plans</h1>
              <p className="text-[#a0a0a0] mt-2 text-center">
                Start by creating a new plan or try our AI-generated plans
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePreviousBtn}
              disabled={isFirstPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFirstPage 
                  ? "text-[#a0a0a0] cursor-not-allowed" 
                  : "text-[#ffa333] hover:text-[#ffb366]"
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={handleNextBtn}
              disabled={isLastPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLastPage 
                  ? "text-[#a0a0a0] cursor-not-allowed" 
                  : "text-[#ffa333] hover:text-[#ffb366]"
              }`}
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllWorkoutPlan;
