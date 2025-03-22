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
import { useEffect, useState } from "react";
import AddExerciseFinal from "./AddExerciseFinal";
import { ExercisesFormType } from "@/types/workoutPlans";
import { Dispatch, SetStateAction } from "react";
import Alert from "../extra/Alert";
import { useGetPreviousExercises } from "@/utils/queries/exerciseQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [previousExercises, setPreviousExercises] = useState<
    ExercisesFormType[]
  >([]);
  const [selectPreviousBoxOpen, setSelectPreviousBoxOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && previousExercisesData) {
      setPreviousExercises(previousExercisesData.flat());
    }
  }, [previousExercisesData, isLoading]);

  const handleCloseBtn = () => {
    setOpenAddExerciseForm(false);
  };

  const handleClosePreviousBox = () => {
    setSelectPreviousBoxOpen(false);
  };

  const handleSelectPreviousExercise = (exercise: ExercisesFormType) => {
    setExerciseData((prev) => [...prev, exercise]);
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
          <div className="bg-SecondaryBackgroundColor rounded-xl p-3">
            <ScrollArea className="w-full h-[80vh] rounded-xl bg-SecondaryBackgroundColor overflow-hidden">
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
                      className="bg-black text-white"
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
            </ScrollArea>

            <Alert
              trigerBtnVarient={"destructive"}
              triggerBtnClassName="w-full mt-2"
              handleContinueBtn={handleClosePreviousBox}
            />
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
