import { useParams } from "react-router-dom";
import { useGetWorkoutDay } from "../utils/queries/dayQuery";
import Loader from "../components/loaders/Loader";
import ErrorPage from "../components/loaders/ErrorPage";
import WorkoutExerciseCard from "../components/cards/WorkoutExerciseCard";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import AddExercise from "@/components/forms/AddExercise";

const WorkoutDayDetails = () => {
  const [openAddExerciseForm, setOpenAddExerciseForm] = useState(false);
  const { dayId } = useParams();

  const { data, isLoading, isError, error } = useGetWorkoutDay(Number(dayId));
  const validDAyExercises = data?.dayexercises || [];
  const sortedWorkoutDays = validDAyExercises.sort((a, b) => a.id - b.id);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  const handleClickAddBtn = () => {
    setOpenAddExerciseForm(true);
  }

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-montserrat">
      <div className="">
        <h1 className=" text-2xl font-semibold capitalize text-PrimaryTextColor">
          {data?.workout_name}
        </h1>
        <h2 className=" text-base text-SecondaryTextColor capitalize">
          {data?.day_name}, {data?.day_difficulty}
        </h2>
      </div>
      {data?.day_description && (
        <div className="text-SecondaryTextColor">
          <p className="font-semibold">Tips:</p>
          <p className="text-sm leading-5">{data.day_description}</p>
        </div>
      )}

      <Button onClick={handleClickAddBtn} variant="outline" className="mt-2">Add Exercise</Button>

      {sortedWorkoutDays && sortedWorkoutDays.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWorkoutDays.map((exercise) => (
            <WorkoutExerciseCard exerciseDetails={exercise} key={exercise.id} />
          ))}
        </div>
      ) : (
        <div className="h-96 text-center text-SecondaryTextColor">
          <p>No exercises for this day</p>
        </div>
      )}

      {openAddExerciseForm && (
        <AddExercise workoutId={Number(dayId)} setOpenAddExerciseForm={setOpenAddExerciseForm} />
      )}
    </div>
  );
};

export default WorkoutDayDetails;
