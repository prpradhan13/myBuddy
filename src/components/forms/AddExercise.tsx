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
import { ExercisesFormType } from "@/types/workoutPlans";
import { Dispatch, SetStateAction } from "react";
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

  const handleCloseBtn = () => {
    setOpenAddExerciseForm(false);
  };

  const onSubmit = (data: TExerciseForm) => {
    setExerciseData((prev) => [...prev, { ...data }]);
    setStep(2);
    form.reset();
  };

  return (
    <div className="bg-[#000000d6] absolute top-0 right-0 left-0 w-full h-screen flex justify-center items-center px-8">
      {step === 1 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-3 bg-black border rounded-md w-full flex flex-col gap-3"
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-1/2">Close</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCloseBtn}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" variant="secondary" className="w-1/2">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <AddExerciseFinal
          workoutId={workoutId}
          exerciseDetails={exerciseData}
          setExerciseData={setExerciseData}
          setStep={setStep}
        />
      )}
    </div>
  );
};

export default AddExercise;
