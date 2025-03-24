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
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
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
import { ChevronsUpDown } from "lucide-react";

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
    <div className="bg-[#000000d6] absolute top-0 right-0 left-0 w-full h-screen flex justify-center items-center px-8 overflow-hidden">
      {step === 1 &&
        (!selectPreviousBoxOpen ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-3 bg-black border rounded-md w-full md:w-[50vw] flex flex-col gap-3"
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

              <div className="w-full flex gap-3">
                <Alert
                  trigerBtnVarient={"destructive"}
                  triggerBtnClassName="w-1/2"
                  handleContinueBtn={handleCloseBtn}
                />

                <Button type="submit" variant="secondary" className="w-1/2">
                  Submit
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
          <div className="bg-SecondaryBackgroundColor rounded-xl p-3 w-full">
            <ScrollArea className="w-full h-[80vh] rounded-xl bg-SecondaryBackgroundColor overflow-hidden">
              <h2 className="text-PrimaryTextColor text-lg text-center">
                Previous exercises
              </h2>
              <div className="w-full gap-2 mt-2">
                {isLoading ? (
                  <div className="flex w-full justify-center">
                    <p className="text-PrimaryTextColor text-center text-lg font-medium">
                      Loading...
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
                      <div key={category} className="mb-3">
                        <h2 className="text-white font-bold capitalize">
                          {category}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                          {exercises.map((exercise: ExerciseType) => (
                            <Collapsible
                              key={exercise.id}
                              className="bg-[#d5d5d5] text-black capitalize rounded-lg"
                            >
                              <div className="flex justify-between items-center">
                                <button
                                  onClick={() =>
                                    handleSelectPreviousExercise(exercise)
                                  }
                                  className="text-sm p-2 capitalize font-semibold"
                                >
                                  {exercise.exercise_name}
                                </button>
                                {(exercise.target_muscle ||
                                  exercise.description) && (
                                  <CollapsibleTrigger asChild className="z-50">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-black hover:bg-transparent hover:text-black"
                                    >
                                      <ChevronsUpDown className="h-4 w-4" />
                                      <span className="sr-only">Toggle</span>
                                    </Button>
                                  </CollapsibleTrigger>
                                )}
                              </div>
                              <CollapsibleContent className="px-2 pb-2 text-sm">
                                <p className="">Rest: {exercise.rest}</p>
                                <p className="text-xs whitespace-pre-line">
                                  {exercise.description}
                                </p>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex justify-center">
                    <p className="text-PrimaryTextColor text-lg font-medium">
                      No previous exercises found.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Button
              variant={"destructive"}
              onClick={handleClosePreviousBox}
              className="w-full mt-2"
            >
              Close
            </Button>
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
