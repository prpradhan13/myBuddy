import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { exerciseSchema, TExerciseForm } from "../../validations/forms";
import { ExercisesFormType } from "../../types/workoutPlans";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useGetPreviousExercises } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";

interface ExerciseFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  setExerciseData: Dispatch<SetStateAction<ExercisesFormType[]>>;
}

const ExerciseForm = ({ setStep, setExerciseData }: ExerciseFormProps) => {
  const form = useForm<TExerciseForm>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exercise_name: "",
      target_muscle: "",
      exercise_description: "",
      rest: "",
    },
  });

  const { planInfo } = usePlan();
  const planId = planInfo.planId;

  const { data: previousExercisesData, isLoading } = useGetPreviousExercises(
    planId!
  );
  const [previousExercises, setPreviousExercises] = useState<
    ExercisesFormType[]
  >([]);
  const [selectPreviousBoxOpen, setSelectPreviousBoxOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && previousExercisesData) {
      setPreviousExercises(previousExercisesData.flat());
    }
  }, [previousExercisesData, isLoading]);

  const handleSelectPreviousExercise = (exercise: ExercisesFormType) => {
    setExerciseData((prev) => [...prev, exercise]);
    setStep(3);
  };

  const handleNextBtnClick = (data: TExerciseForm) => {
    setExerciseData((prev) => [
      ...prev,
      {
        ...data,
        target_muscle: data.target_muscle ?? null,
        exercise_description: data.exercise_description ?? null,
        rest: data.rest ?? null,
      },
    ]);
    setStep(3);
    form.reset();
  };

  return (
    <div className="w-full">
      {!selectPreviousBoxOpen ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNextBtnClick)}
            className="bg-SecondaryBackgroundColor w-full rounded-md p-3 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="exercise_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Exercise Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="text-PrimaryTextColor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_muscle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Target Muscles
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Chest"
                      {...field}
                      value={field.value ?? ""}
                      className="text-PrimaryTextColor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exercise_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Exercise Tips
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-PrimaryTextColor"
                      placeholder="Optional"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Rest After This Exercise
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 40 seconds"
                      {...field}
                      value={field.value ?? ""}
                      className="text-PrimaryTextColor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="secondary"
                className="w-1/2 bg-blue-500"
              >
                Back
              </Button>
              <Button type="submit" variant="secondary" className="w-1/2">
                Next
              </Button>
            </div>

            <p className="text-center font-semibold text-lg text-white">OR</p>

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => setSelectPreviousBoxOpen(true)}
                variant="secondary"
                className="w-full bg-transparent text-white"
              >
                Select from previous exercises
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="bg-SecondaryBackgroundColor w-full rounded-xl p-3">
          <h2 className="text-PrimaryTextColor text-lg text-center">
            This Plan's previous exercises
          </h2>

          <div className="flex flex-wrap gap-2 mt-2">
            {isLoading ? (
              <p className="text-PrimaryTextColor">Loading...</p>
            ) : previousExercises.length > 0 ? (
              previousExercises.map((exercise, index) => (
                <Button
                  key={index}
                  onClick={() => handleSelectPreviousExercise(exercise)}
                  variant="secondary"
                  className="bg-blue-500"
                >
                  {exercise.exercise_name}
                </Button>
              ))
            ) : (
              <p className="text-PrimaryTextColor">
                No previous exercises found.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4"></div>
    </div>
  );
};

export default ExerciseForm;
