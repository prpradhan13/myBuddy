import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import {
  FinalWorkoutFormType,
  WorkoutDayWithExerciseType,
  WorkoutPlanWithDaysType,
} from "../../types/workoutPlans";
import { Dispatch, SetStateAction } from "react";
import { TUpdateDayDetails } from "@/validations/forms";

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
        return;
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
        toast.error(error.message);
        return;
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
    mutationFn: async ({ formData }: { formData: FinalWorkoutFormType }) => {
      const { data: dayData, error } = await supabase
        .from("workoutday")
        .update({
          workout_name: formData.workout_name,
          difficulty_level: formData.difficulty_level,
          description: formData.description,
        })
        .eq("id", workoutDayId)
        .select("*")
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      const exerciseSchemaForDB = formData.exercises.map((item) => ({
        exercise_name: item.exercise_name,
        target_muscle: item.target_muscle,
        description: item.exercise_description,
        rest: item.rest,
      }));

      const { data: exerciseIds, error: exerciseError } = await supabase
        .from("exercise")
        .insert(exerciseSchemaForDB)
        .select("id");

      if (exerciseError) {
        toast.error(exerciseError.message);
        return;
      }

      const workoutDayExercises = exerciseIds.map((exer) => ({
        workoutday_id: workoutDayId,
        exercise_id: exer.id,
      }));

      const { error: joinError } = await supabase
        .from("workoutday_exercise")
        .insert(workoutDayExercises);

      if (joinError) {
        toast.error(joinError.message || "Error while joining");
        return;
      }

      return dayData || {};
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
      toast.error(error.message || "Failed to Add Workout");
    },
  });
};

export const useUpdateDayDetails = ({ planId, dayId, setOpenUpdateForm }: { planId: number, dayId: number, setOpenUpdateForm: Dispatch<SetStateAction<boolean>> }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: TUpdateDayDetails) => {
      const {data, error} = await supabase
        .from("workoutday")
        .update(formData)
        .eq("id", dayId)
        .select("*")
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data) {
        toast.error("Update failed, no data returned");
        return;
      }

      return data;
    },
    onSuccess: (data: TUpdateDayDetails) => {
      queryClient.setQueryData(
        [`workoutplan_days_${planId}`],
        (oldData: WorkoutPlanWithDaysType | undefined) => {
          if (!oldData) return undefined;

          // Update the specific day in the list
          const updatedDays = oldData?.workoutdays?.map((day) =>
            day.id === dayId ? { ...day, ...data } : day
          );

          return {
            ...oldData,
            workoutdays: updatedDays,
          };
        }
      );

      toast.success("Update Success");
      setOpenUpdateForm(false);
    },
    onError: (error) => {
      setOpenUpdateForm(false);
      toast.error(error.message || "Failed to update!");
    }
  })
};
