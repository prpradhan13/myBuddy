import { exerciseSchema, TExerciseForm } from "@/validations/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import AddExerciseFinal from "./AddExerciseFinal";
import { ExercisesFormType, ExerciseType } from "@/types/workoutPlans";
import { Dispatch, SetStateAction } from "react";
import Alert from "../extra/Alert";
import { useGetPreviousExercises } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown, X } from "lucide-react";
import { targetMuscles } from "@/utils/constants";
import PreviousExerciseBox from "../extra/PreviousExerciseBox";

interface AddExerciseProps {
  workoutId: number;
  setOpenAddExerciseForm: Dispatch<SetStateAction<boolean>>;
}

const AddExercise = ({
  setOpenAddExerciseForm,
  workoutId,
}: AddExerciseProps) => {
  const form = useForm<TExerciseForm>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exercise_name: "",
      target_muscle: "",
      exercise_description: "",
      rest: "",
    },
  });

  const [step, setStep] = useState(1);
  const [exerciseData, setExerciseData] = useState<ExercisesFormType[]>([]);
  const { planInfo } = usePlan();
  const planId = planInfo.planId;
  const { data: previousExercisesData, isLoading } = useGetPreviousExercises(
    planId!
  );
  const [selectPreviousBoxOpen, setSelectPreviousBoxOpen] = useState(false);

  useEffect(() => {
    if (workoutId) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [workoutId]);

  const handleCloseBtn = () => {
    setOpenAddExerciseForm(false);
  };

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
    setStep(2);
  };

  const onSubmit = (data: TExerciseForm) => {
    setExerciseData((prev) => [
      ...prev,
      {
        ...data,
        target_muscle: data.target_muscle ?? null,
        exercise_description: data.exercise_description ?? null,
        rest: data.rest ?? null,
      },
    ]);
    setStep(2);
    form.reset();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {step === 1 &&
        (!selectPreviousBoxOpen ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-6 space-y-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Add New Exercise
                </h2>
                <button
                  onClick={handleCloseBtn}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="exercise_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-base font-medium">
                        Exercise Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter exercise name"
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_muscle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-base font-medium">
                        Target Muscle
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
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
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exercise_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-base font-medium">
                        Exercise Tips
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any tips or notes about the exercise"
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px] focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200 text-base font-medium">
                        Rest After This Exercise
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 40 seconds"
                          {...field}
                          value={field.value ?? ""}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex gap-3">
                  <Alert
                    trigerBtnVarient={"destructive"}
                    triggerBtnClassName="flex-1"
                    handleContinueBtn={handleCloseBtn}
                  />
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Add Exercise
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">OR</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setSelectPreviousBoxOpen(true)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors"
                >
                  Select from previous exercises
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Previous Exercises
              </h2>
              <button
                onClick={handleClosePreviousBox}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <ScrollArea className="w-full h-[70vh] rounded-lg">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500"></div>
                    <p className="text-gray-400 text-lg">
                      Loading exercises...
                    </p>
                  </div>
                ) : previousExercisesData &&
                  Object.keys(previousExercisesData).length > 0 ? (
                  Object.entries(previousExercisesData)
                    .sort(([categoryA], [categoryB]) =>
                      categoryA.localeCompare(categoryB, "en", {
                        sensitivity: "base",
                      })
                    )
                    .map(([category, exercises]) => (
                      <div key={category} className="space-y-3">
                        <h2 className="text-lg font-semibold text-gray-200 capitalize">
                          {category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {exercises.map((exercise: ExerciseType) => (
                            <Collapsible
                              key={exercise.id}
                              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all hover:border-gray-600"
                            >
                              <div className="flex items-center justify-between p-3">
                                <button
                                  onClick={() =>
                                    handleSelectPreviousExercise(exercise)
                                  }
                                  className="text-left flex-1 text-gray-200 hover:text-white transition-colors"
                                >
                                  <h3 className="font-medium capitalize">
                                    {exercise.exercise_name}
                                  </h3>
                                  {exercise.target_muscle && (
                                    <p className="text-sm text-gray-400 capitalize">
                                      {exercise.target_muscle}
                                    </p>
                                  )}
                                </button>
                                {(exercise.target_muscle ||
                                  exercise.description) && (
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                                    >
                                      <ChevronsUpDown className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle details
                                      </span>
                                    </Button>
                                  </CollapsibleTrigger>
                                )}
                              </div>
                              <CollapsibleContent className="px-3 pb-3 space-y-2">
                                {exercise.rest && (
                                  <div className="flex items-center text-sm text-gray-400">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Rest: {exercise.rest}
                                  </div>
                                )}
                                {exercise.description && (
                                  <div className="text-sm text-gray-400 whitespace-pre-line">
                                    {exercise.description}
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <PreviousExerciseBox
                    planId={planId!}
                    handleClosePreviousBox={handleClosePreviousBox}
                    handleSelectPreviousExercise={handleSelectPreviousExercise}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        ))}

      {step === 2 && (
        <AddExerciseFinal
          workoutId={workoutId}
          exerciseDetails={exerciseData}
          setExerciseData={setExerciseData}
          setStep={setStep}
          setOpenAddExerciseForm={setOpenAddExerciseForm}
        />
      )}
    </div>
  );
};

export default AddExercise;
