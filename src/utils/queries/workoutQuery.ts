import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import {
  CreatePlanType,
  WorkoutPlansType,
  WorkoutPlanWithDaysType,
} from "../../types/workoutPlans";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export const useGetUserWorkoutPlans = (userId?: string) => {
  return useQuery<WorkoutPlansType[]>({
    queryKey: [`workoutPlans_${userId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workoutplan")
        .select("*")
        .eq("creator_id", userId);

      if (error) {
        toast.error(error.message || "Workout plans could not be find");
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};

export const useGetPlanWithDays = (workoutPlanId: number) => {
  return useQuery<WorkoutPlanWithDaysType>({
    queryKey: [`workoutplan_days_${workoutPlanId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workoutplan_with_days")
        .select("*")
        .eq("workoutplan_id", workoutPlanId)
        .single();

      if (error) {
        toast.error(error.message || "Workout plans could not be find");
      }

      return data || [];
    },
  });
};

export const useCreateWorkoutPlan = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ planFormData }: { planFormData: CreatePlanType }) => {

      const { plan_name, description, difficulty_level, weeks } = planFormData;

      // Step 1: Create a new workout plan
      const { data: workoutPlan, error } = await supabase
        .from("workoutplan")
        .insert({
          creator_id: userId,
          plan_name,
          difficulty_level,
          description,
        })
        .select("id")
        .single();

      if (error) {
        toast.error(error.message || "Error while inserting workout");
        return;
      }

      // Step 2: Create Days Entry
      const daysOfWeek: string[] = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const totalDays = weeks * 7;
      const workoutDays = Array.from({ length: totalDays }, (_, index) => ({day_name: daysOfWeek[index % 7]}));

      const { data: workoutDayIds, error: daysError } = await supabase
        .from("workoutday")
        .insert(workoutDays)
        .select("id");

      if (daysError) {
        toast.error(daysError.message || "Error while inserting workoutDay");
        return;
      }

      // Step 3: Link workoutplan and workoutday
      const workoutPlanWorkoutDays = workoutDayIds.map((day) => ({
        workoutplan_id: workoutPlan.id,
        workoutday_id: day.id,
      }));

      const { error: joinError } = await supabase
        .from("workoutplan_workoutday")
        .insert(workoutPlanWorkoutDays);

      if (joinError) {
        toast.error(joinError.message || "Error while joining");
        return ;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: `workoutPlans_${userId}` });
      toast.success("New Workout plan Created");
      navigate(-1);
    },
  });
};

export const useDeletePlan = (planId: number) => {
  const queryClient = useQueryClient();
  const {user} = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
      .from("workoutplan")
      .delete()
      .eq("id", planId)

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`workoutPlans_${userId}`] });
      toast.success("Delete Plan Successfully");
    }
  })
};
