import { Dispatch, SetStateAction, useEffect } from "react";
import {
  ExercisesFormType,
  FinalWorkoutFormType,
} from "../../types/workoutPlans";
import { useAddWorkoutDay } from "../../utils/queries/dayQuery";
import ErrorPage from "../loaders/ErrorPage";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import Alert from "../extra/Alert";

const FinalStep = ({
  workoutDetail,
  setExerciseData,
  setStep,
  workoutDayId,
  planId,
  setOpenCreateForm,
}: {
  workoutDetail: FinalWorkoutFormType;
  setExerciseData: Dispatch<SetStateAction<ExercisesFormType[]>>;
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

  const handleRemoveBtn = (index: number) => {
    const updatedExercise = workoutDetail.exercises.filter(
      (_, i) => i !== index
    );
    setExerciseData(updatedExercise);
  };

  const handleCreateBtn = () => {
    mutate({ formData: workoutDetail });
  };

  const handleCloseBtn = () => {
    setOpenCreateForm(false);
  };

  useEffect(() => {
    if (workoutDetail.exercises.length === 0) {
      setOpenCreateForm(false);
    }
  }, [workoutDetail.exercises.length, setOpenCreateForm]);

  if (isError) return <ErrorPage errorMessage={error.message} />;

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
        <button
          onClick={() => setStep(2)}
          className="text-white text-xs capitalize font-semibold bg-blue-500 py-1 px-2 rounded-md"
        >
          Add more
        </button>
      </div>

      <div className="bg-black p-3 rounded-md flex flex-col gap-2 max-h-[40vh] overflow-y-scroll">
        {workoutDetail.exercises.map((exercise, index) => (
          <Collapsible
            key={index}
            className="bg-SecondaryBackgroundColor rounded-md p-3"
          >
            <div className="">
              <Button
                onClick={() => handleRemoveBtn(index)}
                variant="ghost"
                className="mt-1 p-0 text-red-500 hover:text-red-500 hover:bg-transparent"
              >
                Remove
              </Button>
              <div className="flex justify-between items-center">
                <h1 className="text-PrimaryTextColor capitalize font-semibold">
                  {exercise.exercise_name}
                </h1>
                {(exercise.target_muscle || exercise.exercise_description) && (
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-black hover:text-white"
                    >
                      <ChevronsUpDown className="h-4 w-4 text-PrimaryTextColor" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                )}
              </div>
            </div>
            <CollapsibleContent className="">
              <h1 className="text-SecondaryTextColor capitalize">
                Target Muscle: {exercise.target_muscle}
              </h1>
              <p className="text-SecondaryTextColor">
                {exercise.exercise_description}
              </p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="flex gap-3 justify-evenly mt-3">
        <Alert
          trigerBtnVarient={"destructive"}
          triggerBtnClassName="w-1/2 font-semibold"
          handleContinueBtn={handleCloseBtn}
        />

        <Button
          onClick={handleCreateBtn}
          disabled={isPending}
          variant="secondary"
          className="w-1/2 font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Please wait
            </>
          ) : (
            "SUBMIT"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
