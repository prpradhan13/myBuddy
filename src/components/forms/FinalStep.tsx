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
    <div className="bg-SecondaryBackgroundColor w-full max-h-[80vh] rounded-lg p-6 shadow-lg">
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl text-PrimaryTextColor capitalize font-bold">
          {workoutDetail.workout_name}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-PrimaryTextColor font-medium">Difficulty Level:</span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#2a2a2a] text-white capitalize">
            {workoutDetail.difficulty_level}
          </span>
        </div>
        {workoutDetail.description && (
          <div className="bg-[#2a2a2a] p-4 rounded-lg">
            <p className="text-PrimaryTextColor text-sm">
              {workoutDetail.description}
            </p>
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-PrimaryTextColor text-xl font-semibold">Exercises</h1>
        <button
          onClick={() => setStep(2)}
          className="text-white text-sm capitalize font-medium bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors"
        >
          Add more
        </button>
      </div>

      <div className="bg-[#2a2a2a] p-4 rounded-lg flex flex-col gap-3 max-h-[40vh] overflow-y-scroll">
        {workoutDetail.exercises.map((exercise, index) => (
          <Collapsible
            key={index}
            className="bg-SecondaryBackgroundColor rounded-lg p-4 border border-[#3a3a3a]"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h1 className="text-PrimaryTextColor capitalize font-semibold text-lg">
                  {exercise.exercise_name}
                </h1>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleRemoveBtn(index)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-transparent p-0"
                  >
                    Remove
                  </Button>
                  {(exercise.target_muscle || exercise.exercise_description) && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-PrimaryTextColor hover:bg-[#3a3a3a]"
                      >
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
              </div>
              <CollapsibleContent className="space-y-2 pt-2">
                {exercise.target_muscle && (
                  <div className="flex items-center gap-2">
                    <span className="text-SecondaryTextColor font-medium">Target Muscle:</span>
                    <span className="text-SecondaryTextColor">{exercise.target_muscle}</span>
                  </div>
                )}
                {exercise.exercise_description && (
                  <div className="bg-[#2a2a2a] p-3 rounded-lg">
                    <p className="text-SecondaryTextColor text-sm whitespace-pre-line">
                      {exercise.exercise_description}
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>

      <div className="flex gap-4 justify-evenly mt-6">
        <Alert
          trigerBtnVarient={"destructive"}
          triggerBtnClassName="w-1/2 font-medium bg-red-600 hover:bg-red-700"
          handleContinueBtn={handleCloseBtn}
        />

        <Button
          onClick={handleCreateBtn}
          disabled={isPending}
          variant="secondary"
          className="w-1/2 font-medium bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Please wait</span>
            </div>
          ) : (
            "SUBMIT"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
