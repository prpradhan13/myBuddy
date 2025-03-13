import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlanSchema, TCreateWorkout } from "@/validations/forms";
import { useCreateWorkoutPlan } from "@/utils/queries/workoutQuery";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Alert from "../extra/Alert";

interface CreateWorkoutPlanProps {
  openCreateForm: boolean;
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>;
}

const CreateWorkoutPlan = ({
  openCreateForm,
  setOpenCreateForm,
}: CreateWorkoutPlanProps) => {
  const form = useForm<TCreateWorkout>({
    resolver: zodResolver(createPlanSchema),
  });

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

  const { mutate, isPending } = useCreateWorkoutPlan(setOpenCreateForm, {
    limit: 5,
  });

  const handleCloseBtn = () => {
    setOpenCreateForm(false);
  };

  const onSubmit = (data: TCreateWorkout) => {
    mutate({
      planFormData: {
        ...data,
        description: data.description ?? null,
      },
    });

    form.reset();
  };

  return (
    <div className="bg-[#00000096] fixed top-0 right-0 left-0 h-screen flex justify-center items-center px-4 font-montserrat z-50">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-SecondaryBackgroundColor border w-full md:w-[50vw] rounded-md p-3 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="plan_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-PrimaryTextColor text-lg">
                  Your Plan Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
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
            name="difficulty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-PrimaryTextColor text-lg">
                  What is the difficulty level of your plan?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-PrimaryTextColor text-lg">
                  Any Tips?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
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
            name="weeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-PrimaryTextColor text-lg">
                  How many week has your plan?
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="text-PrimaryTextColor w-[70px]"
                    onChange={(e) => {
                      // Handle empty string case explicitly
                      const value =
                        e.target.value === "" ? "" : Number(e.target.value);
                      field.onChange(value);
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 justify-evenly">
            <Alert
              handleContinueBtn={handleCloseBtn}
              trigerBtnVarient="destructive"
              triggerBtnClassName="w-1/2 font-semibold"
            />
            <Button type="submit" variant="secondary" className="w-1/2">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateWorkoutPlan;
