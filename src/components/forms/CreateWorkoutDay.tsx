import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createWorkoutDayschema,
  TCreateWorkoutDay,
} from "../../validations/forms";
import ExerciseForm from "./ExerciseForm";
import FinalStep from "./FinalStep";
import { ExercisesFormType } from "../../types/workoutPlans";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const CreateWorkoutDay = ({
  workoutDayId,
  planId,
  openCreateForm,
  setOpenCreateForm,
}: {
  workoutDayId: number;
  planId: number;
  openCreateForm: boolean;
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<TCreateWorkoutDay>({
    resolver: zodResolver(createWorkoutDayschema),
    defaultValues: {
      workout_name: "",
      difficulty_level: "",
      description: "",
    },
  });
  const [step, setStep] = useState(1);
  const [exerciseData, setExerciseData] = useState<ExercisesFormType[]>([]);

  useEffect(() => {
    if (openCreateForm) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [openCreateForm]);

  const handleCloseBtn = () => {
    form.reset();
    setOpenCreateForm(false);
  };

  const onSubmit = () => {
    setStep(2);
  };

  return (
    <div className="bg-[#00000096] absolute top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat">
      {step === 1 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-SecondaryBackgroundColor w-full rounded-md p-3 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="workout_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Workout Name
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
              name="difficulty_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Difficulty Level
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optional"
                      {...field}
                      className="text-PrimaryTextColor"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Any Tips?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional"
                      {...field}
                      className="text-PrimaryTextColor"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="flex gap-3 justify-evenly">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-1/2 text-lg font-semibold"
                >
                  Close
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCloseBtn}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              type="submit"
              variant="secondary"
              className="w-1/2"
            >
              NEXT
            </Button>
          </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <ExerciseForm setStep={setStep} setExerciseData={setExerciseData} />
      )}

      {step === 3 && (
        <FinalStep
          workoutDetail={{ ...form.watch(), exercises: exerciseData }}
          setExerciseData={setExerciseData}
          setStep={setStep}
          workoutDayId={workoutDayId}
          planId={planId}
          setOpenCreateForm={setOpenCreateForm}
        />
      )}
    </div>
  );
};

export default CreateWorkoutDay;
