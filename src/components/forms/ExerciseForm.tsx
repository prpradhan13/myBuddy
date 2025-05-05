import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { exerciseSchema, TExerciseForm } from "../../validations/forms";
import { ExercisesFormType, ExerciseType } from "../../types/workoutPlans";
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
import { usePlan } from "@/context/WorkoutPlanProvider";
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { targetMuscles } from "@/utils/constants";
import PreviousExerciseBox from "../extra/PreviousExerciseBox";

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

  const [selectPreviousBoxOpen, setSelectPreviousBoxOpen] = useState(false);

  const handleClosePreviousBox = () => {
    setSelectPreviousBoxOpen(false);
  };

  const handleSelectPreviousExercise = (exercise: ExerciseType) => {
    const formattedExercise: ExercisesFormType = {
      exercise_name: exercise.exercise_name,
      target_muscle: exercise.target_muscle ?? null,
      exercise_description: exercise.description ?? "",
      rest: exercise.rest ?? null,
    };

    setExerciseData((prev) => [...prev, formattedExercise]);
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
            className="bg-SecondaryBackgroundColor w-full rounded-lg p-6 flex flex-col gap-6 shadow-lg"
          >
            <FormField
              control={form.control}
              name="exercise_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg font-medium">
                    Exercise Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter exercise name"
                      {...field}
                      className="text-PrimaryTextColor bg-[#2a2a2a] border-[#3a3a3a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                <FormItem className="flex flex-col">
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Target Muscle
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white w-full">
                        <SelectValue placeholder="Select target muscle" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectGroup>
                          {targetMuscles.map((target, index) => (
                            <SelectItem
                              key={index}
                              value={target}
                              className="text-white hover:bg-gray-700 focus:bg-gray-700"
                            >
                              {target}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                  <FormLabel className="text-PrimaryTextColor text-lg font-medium">
                    Exercise Tips
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-PrimaryTextColor bg-[#2a2a2a] border-[#3a3a3a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Enter exercise tips and instructions"
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
                  <FormLabel className="text-PrimaryTextColor text-lg font-medium">
                    Rest After This Exercise
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 40 seconds or 1 minute"
                      {...field}
                      value={field.value ?? ""}
                      className="text-PrimaryTextColor bg-[#2a2a2a] border-[#3a3a3a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="secondary"
                className="w-1/2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white font-medium"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="secondary"
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Next
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3a3a3a]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-SecondaryBackgroundColor text-PrimaryTextColor">
                  OR
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => setSelectPreviousBoxOpen(true)}
                variant="secondary"
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#3a3a3a] font-medium"
              >
                Select from previous exercises
              </Button>
            </div>
          </form>
        </Form>
        ) : (
          <PreviousExerciseBox
            planId={planId!}
            handleClosePreviousBox={handleClosePreviousBox}
            handleSelectPreviousExercise={handleSelectPreviousExercise}
          />
        )}

      <div className="mt-4"></div>
    </div>
  );
};

export default ExerciseForm;
