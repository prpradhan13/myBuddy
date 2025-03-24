import React from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { TUpdateDayDetails, updateDayDetails } from "@/validations/forms";
import { useUpdateDayDetails } from "@/utils/queries/dayQuery";
import { WorkoutPlanWithDaysType } from "@/types/workoutPlans";
import { usePlan } from "@/context/WorkoutPlanProvider";

interface EditDayDetailsProps {
  editDrawerOpen: boolean;
  setEditDrawerOpen: (value: boolean) => void;
  dayId: number;
  workoutName: string;
  difficultyLevel: string;
  description: string | null;
}

const EditDayDetails: React.FC<EditDayDetailsProps> = ({
  editDrawerOpen,
  setEditDrawerOpen,
  dayId,
  workoutName,
  difficultyLevel,
  description,
}) => {
  const form = useForm<TUpdateDayDetails>({
    resolver: zodResolver(updateDayDetails),
    defaultValues: {
      workout_name: workoutName,
      difficulty_level: difficultyLevel,
      description: description ?? "",
    },
  });
  const queryClient = useQueryClient();
  const { planInfo } = usePlan();
  const workoutPlanId = planInfo.planId;
  const { mutate, isPending } = useUpdateDayDetails({ dayId });

  const onSubmit = async (data: TUpdateDayDetails) => {
    const initialValues = {
      workout_name: workoutName,
      difficulty_level: difficultyLevel ?? "",
      description: description ?? "",
    };

    const noChanges = Object.keys(initialValues).every(
      (key) =>
        data[key as keyof TUpdateDayDetails] ===
        initialValues[key as keyof typeof initialValues]
    );

    if (noChanges) {
      toast.error("No changes detected.");
      return;
    }

    mutate(
      {
        workout_name: data.workout_name,
        difficulty_level: data.difficulty_level,
        description: data.description,
      },
      {
        onSuccess: (_, givenData) => {
          queryClient.setQueryData(
            [`workoutplan_days_${workoutPlanId}`],
            (oldData: WorkoutPlanWithDaysType | undefined) => {
              if (!oldData || !oldData.workoutdays) return oldData;

              return {
                ...oldData,
                workoutdays: oldData.workoutdays.map((day) =>
                  day.id === dayId
                    ? {
                        ...day,
                        workout_name: givenData.workout_name,
                        difficulty_level: givenData.difficulty_level,
                        description: givenData.description,
                      }
                    : day
                ),
              };
            }
          );
          toast.success("Day details updated successfully.");
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
            Edit Day Details
          </DrawerTitle>
          <DrawerDescription>
            You can edit the details of the a Day here. You can change the name
            of the plan, the description.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workout_name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-lg text-PrimaryTextColor">
                    Workout name
                  </FormLabel>
                  <FormControl>
                    <input
                      placeholder="Write your workout day name."
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
                  <FormLabel className="text-lg text-PrimaryTextColor">
                    Difficulty Level
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={`w-[180px] capitalize ${
                          field.value ? "text-white" : "text-white"
                        }`}
                      >
                        <SelectValue>{field.value ?? "Select"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
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
                  <FormLabel className="text-lg text-PrimaryTextColor">
                    Description
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

export default EditDayDetails;
