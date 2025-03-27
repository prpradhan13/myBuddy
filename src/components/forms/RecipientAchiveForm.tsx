import { Dispatch, SetStateAction } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipientAchiveForm, TRecipientAchiveForm } from "@/validations/forms";
import { useUpdateSetByRecipient } from "@/utils/queries/sharedPlanQuery";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { Button } from "../ui/button";
import Alert from "../extra/Alert";
import { useAuth } from "@/context/AuthProvider";

interface RecipientAchiveFormProps {
  exerciseId: number;
  exerciseSetIdForUpdate: number | null;
  setExerciseSetIdForUpdate: Dispatch<SetStateAction<number | null>>;
}

const RecipientAchiveForm = ({
  exerciseId,
  exerciseSetIdForUpdate,
  setExerciseSetIdForUpdate,
}: RecipientAchiveFormProps) => {
  const form = useForm<TRecipientAchiveForm>({
    resolver: zodResolver(recipientAchiveForm),
  });

  const { planInfo } = usePlan();
  const { user } = useAuth();
  const userId = user && user.id;

  const { mutate: recipientMutate } = useUpdateSetByRecipient({
    dayId: planInfo.dayId,
    exerciseId: Number(exerciseId),
    planId: planInfo.planId,
    recipientId: userId!,
    setExerciseSetIdForUpdate
  });

  const handleFormClose = () => {
    setExerciseSetIdForUpdate(null);
    form.reset();
  };

  const onSubmit = (data: TRecipientAchiveForm) => {
    recipientMutate({ formData: { ...data, setId: exerciseSetIdForUpdate! } });
  };

  return (
    <div className="bg-[#00000096] fixed top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat">
      <div className="bg-SecondaryBackgroundColor w-full md:w-[50vw] rounded-md p-3 flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="achive_repetition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Achive Repetition
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} className="text-PrimaryTextColor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="achive_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Achive Weight
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} className="text-PrimaryTextColor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 mt-2">
              <Alert
                trigerBtnVarient={"destructive"}
                triggerBtnClassName="w-1/2"
                handleContinueBtn={handleFormClose}
              />

              <Button type="submit" variant="secondary" className="w-1/2">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RecipientAchiveForm;
