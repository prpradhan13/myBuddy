import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
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

  const handleNextBtnClick = (data: TExerciseForm) => {
    setExerciseData((prev) => [...prev, { ...data }]);
    setStep(3);
    form.reset();
  };

  return (
    <div className="w-full">
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
            <Button type="button" onClick={() => setStep(1)} variant="secondary" className="w-1/2 bg-blue-500">
              Back
            </Button>
            <Button type="submit" variant="secondary" className="w-1/2">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ExerciseForm;
