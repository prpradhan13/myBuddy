import { useParams } from "react-router-dom";
import {
  useAddNewWeek,
  useGetPlanWithDays,
} from "../utils/queries/workoutQuery";
import WorkoutDayCard from "../components/cards/WorkoutDayCard";
import { useEffect, useState } from "react";
import ErrorPage from "../components/loaders/ErrorPage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkoutDayLoader from "@/components/loaders/WorkoutDayLoader";
import Alert from "@/components/extra/Alert";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { useRecipientPlan } from "@/context/SharedPlanProvider";
import ReviewForm from "@/components/forms/ReviewForm";

const WorkoutPlanDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const { planId } = useParams();
  const { planInfo, setPlanInfo, creatorOfPlan } = usePlan();
  const { isRecipient } = useRecipientPlan();

  const { data, isLoading, isError, error } = useGetPlanWithDays(
    Number(planId)
  );

  useEffect(() => {
    if (data?.workoutplan_id && data?.creator_id) {
      if (
        planInfo.planId !== data.workoutplan_id ||
        planInfo.creatorId !== data.creator_id
      ) {
        setPlanInfo({
          planId: data.workoutplan_id,
          creatorId: data.creator_id,
        });
      }
    }
  }, [data, setPlanInfo, planInfo]);

  const validWorkoutDays = data?.workoutdays || [];
  const sortedWorkoutDays = [...validWorkoutDays].sort((a, b) => a.id - b.id);
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

  const { mutate, isPending } = useAddNewWeek(Number(planId));

  const handleAddWeek = () => {
    mutate();
  };

  if (isLoading) return <WorkoutDayLoader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins">
      <h1 className="text-2xl font-semibold capitalize text-PrimaryTextColor">
        {data?.plan_name}
      </h1>
      <h2 className="text-base text-SecondaryTextColor capitalize">
        {data?.plan_difficulty}, {totalPages} week plan
      </h2>

      {data?.plan_description && (
        <div className="text-SecondaryTextColor">
          <p className="font-semibold">Note:</p>
          <p className="text-sm leading-5">{data.plan_description}</p>
        </div>
      )}

      {creatorOfPlan && (
        <Alert
          btnName="Add a week"
          trigerBtnVarient={"link"}
          triggerBtnClassName="text-blue-500 p-0"
          pendingState={isPending}
          headLine="Are you want to add a new week?"
          descLine="This is add a new week in this plan."
          handleContinueBtn={handleAddWeek}
        />
      )}

      {(isRecipient && !creatorOfPlan) && (
        <ReviewForm />
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
