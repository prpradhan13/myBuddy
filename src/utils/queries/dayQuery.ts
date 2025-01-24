import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import {
  CreateWorkoutDayType,
  WorkoutDayWithExerciseType,
  WorkoutPlanWithDaysType,
} from "../../types/workoutPlans";
import { Dispatch, SetStateAction } from "react";

export const useGetWorkoutDay = (workoutDayId: number) => {
  return useQuery<WorkoutDayWithExerciseType>({
    queryKey: [`workoutDay_${workoutDayId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workoutday_with_exercises")
        .select("*")
        .eq("workoutday_id", workoutDayId)
        .single();

      if (error) {
        toast.error(
          error.message || "Can not find workout day with exercise id"
        );
      }

      return data || {};
    },
    enabled: !!workoutDayId,
  });
};

export const useToggleRestDay = (
  workoutDayId: number,
  newRestday: boolean,
  planId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("workoutday")
        .update({ is_restday: newRestday })
        .eq("id", workoutDayId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data || {};
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [`workoutplan_days_${planId}`],
        (oldData: WorkoutPlanWithDaysType | undefined) => {
          if (!oldData) return undefined;

          // Update the specific day in the list
          const updatedDays = oldData?.workoutdays?.map((day) =>
            day.id === workoutDayId ? { ...day, ...data } : day
          );

          return {
            ...oldData,
            workoutdays: updatedDays,
          };
        }
      );

      toast.success("Update Success");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update rest day");
    },
  });
};

export const useAddWorkoutDay = (
  workoutDayId: number,
  planId: number,
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData }: { formData: CreateWorkoutDayType }) => {
      const { data, error } = await supabase
        .from("workoutday")
        .update(formData)
        .eq("id", workoutDayId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data || {};
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [`workoutplan_days_${planId}`],
        (oldData: WorkoutPlanWithDaysType | undefined) => {
          if (!oldData) return undefined;

          // Update the specific day in the list
          const updatedDays = oldData?.workoutdays?.map((day) =>
            day.id === workoutDayId ? { ...day, ...data } : day
          );

          return {
            ...oldData,
            workoutdays: updatedDays,
          };
        }
      );

      toast.success("Update Success");
      setOpenCreateForm(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update rest day");
    },
  });
};
