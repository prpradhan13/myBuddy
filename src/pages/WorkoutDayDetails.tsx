import { useParams } from "react-router-dom";
import { useGetWorkoutDay } from "../utils/queries/dayQuery";
import Loader from "../components/loaders/Loader";
import ErrorPage from "../components/loaders/ErrorPage";
import WorkoutExerciseCard from "../components/cards/WorkoutExerciseCard";

const WorkoutDayDetails = () => {
  const { dayId } = useParams();

  const { data, isLoading, isError, error } = useGetWorkoutDay(Number(dayId));

  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage errorMessage={error.message} />;

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 font-poppins">
      <h1 className="text-center text-2xl font-semibold capitalize text-PrimaryTextColor">
        {data?.workout_name}
      </h1>
      <h2 className="text-center text-base text-SecondaryTextColor capitalize">
        {data?.day_name}, {data?.day_difficulty}
      </h2>
      {data?.day_description && (
        <div className="text-SecondaryTextColor">
          <p className="font-semibold">Tips:</p>
          <p className="text-sm leading-5">{data.day_description}</p>
        </div>
      )}

      {data?.dayexercises && data.dayexercises.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.dayexercises.map((exercise) => (
                <WorkoutExerciseCard exerciseDetails={exercise} key={exercise.id} />
            ))}
        </div>
      ) : (
        <div className="h-96 text-center text-SecondaryTextColor">
          <p>No exercises for this day</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutDayDetails;
