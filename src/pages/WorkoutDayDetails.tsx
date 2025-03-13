import { useParams } from "react-router-dom";
import { useGetWorkoutDay } from "../utils/queries/dayQuery";
import ErrorPage from "../components/loaders/ErrorPage";
import WorkoutExerciseCard from "../components/cards/WorkoutExerciseCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddExercise from "@/components/forms/AddExercise";
import WorkoutDayLoader from "@/components/loaders/WorkoutDayLoader";
import { usePlan } from "@/context/WorkoutPlanProvider";

const WorkoutDayDetails = () => {
  const [openAddExerciseForm, setOpenAddExerciseForm] = useState(false);
  const { dayId } = useParams();
  const { creatorOfPlan, planInfo, setPlanInfo } = usePlan();

  const { data, isLoading, isError, error } = useGetWorkoutDay(Number(dayId));
  const validDayId = Number(dayId);

  useEffect(() => {
    if (validDayId && planInfo.dayId !== validDayId) {
      setPlanInfo({ dayId: validDayId });
    }
  }, [validDayId, planInfo.dayId, setPlanInfo]);

  const validDAyExercises = data?.dayexercises || [];
  const sortedWorkoutDays = validDAyExercises.sort((a, b) => a.id - b.id);

  if (isLoading) return <WorkoutDayLoader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  const handleClickAddBtn = () => {
    setOpenAddExerciseForm(true);
  };

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-montserrat">
      <div className="">
        <h2 className=" text-sm font-medium text-SecondaryTextColor capitalize">
          {data?.day_name}, {data?.day_difficulty}
        </h2>
        <h1 className="text-2xl font-semibold capitalize text-PrimaryTextColor">
          {data?.workout_name}
        </h1>
      </div>
      {data?.day_description && (
        <div className="text-SecondaryTextColor my-4">
          <p className="text-sm leading-5 whitespace-pre-line font-medium">
            {data.day_description}
          </p>
        </div>
      )}

      {creatorOfPlan && (
        <Button onClick={handleClickAddBtn} variant={"secondary"} className="mb-2 rounded-full bg-white px-4 flex">
          Add Exercise
        </Button>
      )}

      {sortedWorkoutDays && sortedWorkoutDays.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWorkoutDays.map((exercise, index) => (
            <WorkoutExerciseCard
              key={`${index}_${exercise.id}`}
              exerciseDetails={exercise}
              dayId={data?.workoutday_id}
            />
          ))}
        </div>
      ) : (
        <div className="h-96 text-center text-SecondaryTextColor">
          <p>No exercises for this day</p>
        </div>
      )}

      {openAddExerciseForm && (
        <AddExercise
          workoutId={Number(dayId)}
          setOpenAddExerciseForm={setOpenAddExerciseForm}
        />
      )}
    </div>
  );
};

export default WorkoutDayDetails;
