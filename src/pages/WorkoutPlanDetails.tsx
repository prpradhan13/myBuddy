import { useParams } from "react-router-dom";
import { useGetPlanWithDays } from "../utils/queries/workoutQuery";
import Loader from "../components/loaders/Loader";
import WorkoutDayCard from "../components/cards/WorkoutDayCard";
import { useState } from "react";
import ErrorPage from "../components/loaders/ErrorPage";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const WorkoutPlanDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const { planId } = useParams();

  const { data, isLoading, isError, error } = useGetPlanWithDays(
    Number(planId)
  );
  const validWorkoutDays = data?.workoutdays || [];
  const sortedWorkoutDays = validWorkoutDays.sort((a, b) => a.id - b.id);
  const totalPages = Math.ceil(validWorkoutDays.length / itemsPerPage);

  const currentDays = sortedWorkoutDays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins">
      <h1 className="text-center text-2xl font-semibold capitalize text-PrimaryTextColor">
        {data?.plan_name}
      </h1>
      <h2 className="text-center text-base text-SecondaryTextColor capitalize">
        {data?.plan_difficulty}
      </h2>
      {data?.plan_description && (
        <div className="text-SecondaryTextColor">
          <p className="font-semibold">Note:</p>
          <p className="text-sm leading-5">{data.plan_description}</p>
        </div>
      )}

      {validWorkoutDays.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <h2 className="text-center text-lg text-PrimaryTextColor font-semibold">
            Week {currentPage}
          </h2>

          {currentDays.map((day) => (
            <WorkoutDayCard
              planId={Number(planId)}
              dayDetails={day}
              key={day.id}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls flex items-center justify-between">
              <Button
                variant={"secondary"}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="text-sm font-semibold disabled:opacity-50"
              >
                <ChevronLeft />
                Previous
              </Button>
              <Button
                variant={"secondary"}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="text-sm font-semibold disabled:opacity-50"
              >
                Next
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-96 flex justify-center items-center">
          <p className="text-PrimaryTextColor font-semibold">
            No workout days found
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanDetails;
