import { ExercisesFormType } from "@/types/workoutPlans";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useAddExercises } from "@/utils/queries/exerciseQuery";
import { Loader2 } from "lucide-react"
import ErrorPage from "../loaders/ErrorPage";

interface AddExerciseFinalProps {
  exerciseDetails: ExercisesFormType[];
  setExerciseData: Dispatch<SetStateAction<ExercisesFormType[]>>;
  setStep: Dispatch<SetStateAction<number>>;
  workoutId: number;
}

const AddExerciseFinal = ({
  exerciseDetails,
  setExerciseData,
  setStep,
  workoutId
}: AddExerciseFinalProps) => {

  const { mutate, isPending, isError, error } = useAddExercises(workoutId)

  const handleRemoveBtn = (index: number) => {
    const updatedExercise = exerciseDetails.filter((_, i) => i !== index);
    setExerciseData(updatedExercise);
  }

  const handleSubmitBtn = () => {
    mutate({ formData: exerciseDetails })
  }

  useEffect(() => {
    if (exerciseDetails.length === 0) {
      setStep(1);
    }
  }, [exerciseDetails.length])

  if (isError) return <ErrorPage errorMessage={error.message} />

  return (
    <div className="p-3 bg-black border rounded-md w-full flex flex-col gap-3">
      <Button onClick={() => setStep(1)} variant="outline" className="w-32 bg-SecondaryBackgroundColor text-white border-none">
        Add More
      </Button>
      {exerciseDetails.map((exercise, index) => (
        <Collapsible
          key={index}
          className="bg-SecondaryBackgroundColor rounded-md p-3"
        >
          <div className="">
              <Button onClick={() => handleRemoveBtn(index)} variant="ghost" className="mt-1 p-0 text-red-500 hover:text-red-500 hover:bg-transparent">Remove</Button>
            <div className="flex justify-between items-center">
              <h1 className="text-PrimaryTextColor capitalize font-semibold">
                {exercise.exercise_name}
              </h1>
              {(exercise.target_muscle || exercise.exercise_description) && (
                  <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-black hover:text-white">
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

      <Button onClick={handleSubmitBtn} disabled={isPending} variant="secondary">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : "SUBMIT"}
      </Button>
    </div>
  );
};

export default AddExerciseFinal;
