import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React from "react";
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
import { editPlanDetails, TEditPlanDetails } from "@/validations/forms";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import { useUpadatePlanDetails } from "@/utils/queries/workoutQuery";
import { useQueryClient } from "@tanstack/react-query";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { WorkoutPlanWithDaysType } from "@/types/workoutPlans";

interface EditPlanDetailsProps {
  editDrawerOpen: boolean;
  setEditDrawerOpen: (value: boolean) => void;
  planName: string;
  planDescription: string;
  planDifficulty: string;
}

const EditPlanDetails: React.FC<EditPlanDetailsProps> = ({
  editDrawerOpen,
  setEditDrawerOpen,
  planName,
  planDescription,
  planDifficulty,
}) => {
  const form = useForm<TEditPlanDetails>({
    resolver: zodResolver(editPlanDetails),
    defaultValues: {
      plan_name: planName,
      difficulty_level: planDifficulty,
      description: planDescription,
    },
  });
  const queryClient = useQueryClient();
  const { planInfo } = usePlan();
  const workoutPlanId = planInfo.planId;
  const { mutate, isPending } = useUpadatePlanDetails();

  const onSubmit = (data: TEditPlanDetails) => {
    const initialValues = {
      plan_name: planName,
      difficulty_level: planDifficulty,
      description: planDescription,
    };

    const noChanges = Object.keys(initialValues).every(
      (key) =>
        data[key as keyof TEditPlanDetails] ===
        initialValues[key as keyof typeof initialValues]
    );

    if (noChanges) {
      toast.error("No changes detected.");
      return;
    }

    mutate(
      {
        plan_name: data.plan_name,
        difficulty_level: data.difficulty_level,
        description: data.description,
      },
      {
        onSuccess: (_, givenData) => {
          queryClient.setQueryData(
            [`workoutplan_days_${workoutPlanId}`],
            (oldData: WorkoutPlanWithDaysType | undefined) => {
              if (!oldData) return undefined;

              return {
                ...oldData,
                plan_name: givenData.plan_name,
                plan_difficulty: givenData.difficulty_level,
                plan_description: givenData.description,
              };
            }
          );

          toast.success("Plan details updated successfully.");
          setEditDrawerOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Drawer open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
      <DrawerContent className="p-4 bg-MainBackgroundColor border-none">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">
            Edit Plan Details
          </DrawerTitle>
          <DrawerDescription>
            You can edit the details of the plan here. You can change the name
            of the plan, the description.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plan_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg text-PrimaryTextColor">
                    Your Plan Name
                  </FormLabel>
                  <FormControl>
                    <input
                      placeholder="Write your workout plan name."
                      {...field}
                      value={field.value}
                      className="text-PrimaryTextColor border-b pb-2 px-2 bg-transparent placeholder:text-[#6c6c6c] outline-none"
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
                <FormItem className="flex flex-col">
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Level
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={`w-[180px] ${
                          field.value ? "text-white" : "text-white"
                        }`}
                      >
                        <SelectValue>{field.value ?? "Level"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="beginners">Beginners</SelectItem>
                          <SelectItem value="intermediates">
                            Intermediates
                          </SelectItem>
                          <SelectItem value="advance">Advance</SelectItem>
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
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-PrimaryTextColor text-lg">
                    Any Tips?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional"
                      {...field}
                      className="text-PrimaryTextColor h-28 placeholder:text-[#6c6c6c]"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="p-0">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-500"
              >
                {isPending ? "Please wait..." : "Save Changes"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default EditPlanDetails;
