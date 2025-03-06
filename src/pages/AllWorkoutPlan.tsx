import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";
import WorkoutDayLoader from "@/components/loaders/WorkoutDayLoader";
import { useAuth } from "@/context/AuthProvider";
import { useGetUserWorkoutPlans } from "@/utils/queries/workoutQuery";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AllWorkoutPlan = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = useAuth();
  const { data, isLoading } = useGetUserWorkoutPlans(user?.id, {
    limit: 5,
    offset: currentPage * 5,
  });
  
  const isLastPage = !data || data.length === 1;
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

  return (
    <div className="bg-MainBackgroundColor w-full min-h-screen p-4 font-poppins relative">
      <h1 className="text-PrimaryTextColor text-xl font-semibold">All Plans</h1>
      <div className="min-h-screen mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((item) => (
          <WorkoutPlanCard planDetails={item} key={item.id} />
        ))}
      </div>

      <Pagination className="mt-4">
        <PaginationContent className="w-full flex justify-between">
          <PaginationItem>
            <PaginationPrevious
              onClick={isFirstPage ? undefined : handlePreviousBtn}
              className={`text-PrimaryTextColor hover:bg-transparent hover:text-PrimaryTextColor ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={isLastPage ? undefined : handleNextBtn}
              className={`text-PrimaryTextColor hover:bg-transparent hover:text-PrimaryTextColor ${!data || data.length < 5 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AllWorkoutPlan;
