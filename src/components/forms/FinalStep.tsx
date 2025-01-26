import { Dispatch, SetStateAction } from "react";
import { FinalWorkoutFormType } from "../../types/workoutPlans";
import { useAddWorkoutDay } from "../../utils/queries/dayQuery";
import { ClipLoader } from "react-spinners";
import ErrorPage from "../loaders/ErrorPage";

const FinalStep = ({
  workoutDetail,
  setStep,
  workoutDayId,
  planId,
  setOpenCreateForm
}: {
  workoutDetail: FinalWorkoutFormType;
  setStep: Dispatch<SetStateAction<number>>;
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>;
  workoutDayId: number;
  planId: number;
}) => {

  const { mutate, isPending, isError, error } = useAddWorkoutDay(
      workoutDayId,
      planId,
      setOpenCreateForm
    );

  const handleCreateBtn = () => {
    mutate({ formData: workoutDetail })
  }

  if (isError) return <ErrorPage errorMessage={error.message} />

  return (
    <div className="bg-SecondaryBackgroundColor w-full max-h-[80vh] rounded-md p-3">
      <h1 className="text-xl text-PrimaryTextColor capitalize">
        {" "}
        {workoutDetail.workout_name}{" "}
      </h1>
      <h1 className="text-PrimaryTextColor capitalize">
        {" "}
        Difficulty Level: {workoutDetail.difficulty_level}
      </h1>
      <p className="text-sm text-PrimaryTextColor capitalize">
        {" "}
        Workout Tips: {workoutDetail.description}{" "}
      </p>

      <div className="mt-4 mb-2 flex items-center justify-between">
        <h1 className="text-PrimaryTextColor font-semibold">Exercises</h1>
        <button onClick={() => setStep(2)} className='text-white text-xs capitalize font-semibold bg-blue-500 py-1 px-2 rounded-md'>Add more</button>
      </div>

      <div className="bg-black p-3 rounded-md flex flex-col gap-2 max-h-[40vh] overflow-y-scroll">
        {workoutDetail.exercises.map((item, index) => (
          <div key={index} className="bg-SecondaryBackgroundColor p-3 rounded-md">
            <h2 className="text-PrimaryTextColor text-lg capitalize font-semibold">
              {item?.exercise_name}
            </h2>
            <h2 className="text-SecondaryTextColor capitalize">
              Target Muscle: <span className="font-semibold"> {item?.target_muscle} </span> 
            </h2>
            <h2 className="text-PrimaryTextColor text-sm">
              Tips: {item?.exercise_description}
            </h2>
          </div>
        ))}
      </div>

        <div className="flex gap-3 w-full mt-5">
          <button className="w-1/2 rounded-md font-semibold text-lg py-1 text-PrimaryTextColor bg-red-500">CLOSE</button>
          <button onClick={handleCreateBtn} disabled={isPending} className="w-1/2 rounded-md font-semibold text-lg py-1 bg-MainButtonColor">
            {isPending ? <ClipLoader size={15} /> : "CREATE"}
          </button>
        </div>
    </div>
  );
};

export default FinalStep;
