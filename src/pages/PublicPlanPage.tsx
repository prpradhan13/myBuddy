import WorkoutDayLoader from "@/components/loaders/WorkoutDayLoader";
import { useGetPublicPlans } from "@/utils/queries/workoutQuery";
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import WorkoutPlanCard from "@/components/home/WorkoutPlanCard";

const PublicPlanPage = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading } = useGetPublicPlans({
    limit: 10,
    offset: currentPage * 10,
  });

  const isLastPage = !data || data.length < 10;
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
    <div className="bg-MainBackgroundColor w-full min-h-screen p-4">
      <h1 className="text-lg font-semibold text-PrimaryTextColor">
        Public Plans
      </h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((item) => (
          <WorkoutPlanCard planDetails={item} key={item.id} />
        ))}
      </div>

      <Pagination className="absolute bottom-3 left-0 right-0">
        <PaginationContent className="mt-4 w-full flex justify-between">
          <PaginationItem>
            <PaginationPrevious
              onClick={isFirstPage ? undefined : handlePreviousBtn}
              className={`text-PrimaryTextColor hover:bg-transparent hover:text-PrimaryTextColor ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={isLastPage ? undefined : handleNextBtn}
              className={`text-PrimaryTextColor hover:bg-transparent hover:text-PrimaryTextColor ${!data || data.length < 10 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PublicPlanPage;
