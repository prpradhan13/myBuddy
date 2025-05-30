import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import {
  CreatePlanType,
  WorkoutDayType,
  WorkoutPlansType,
  WorkoutPlanWithDaysType,
} from "../../types/workoutPlans";
import { useAuth } from "../../context/AuthProvider";
import { Dispatch, SetStateAction } from "react";
import { TEditPlanDetails } from "@/validations/forms";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { daysOrder } from "../constants";

interface WorkoutQueryParams {
  limit?: number;
  offset?: number;
}

export const useGetUserWorkoutPlans = (
  userId?: string,
  { limit, offset }: WorkoutQueryParams = {}
) => {
  return useQuery<WorkoutPlansType[]>({
    queryKey: [`workoutPlans_${userId}_${limit}`],
    queryFn: async () => {
      let query = supabase
        .from("workoutplan")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false });

      if (limit) query = query.limit(limit);
      if (offset && limit) query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

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
        .select("*, creator: creator_id(full_name, username, avatar_url)")
        .eq("workoutplan_id", workoutPlanId)
        .single();

      if (error) {
        toast.error(error.message || "Workout plans could not be find");
        return;
      }

      return data || {};
    },
  });
};

export const useCreateWorkoutPlan = (
  setOpenCreateForm: Dispatch<SetStateAction<boolean>>,
  { limit }: WorkoutQueryParams = {}
) => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

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
        .select("*")
        .single();

      if (error || !workoutPlan) {
        toast.error(error?.message || "Error while inserting workout");
        throw new Error(error?.message || "Workout plan creation failed");
      }

      // Step 2: Create Days Entry
      const totalDays = weeks * 7;
      const workoutDays = Array.from({ length: totalDays }, (_, index) => ({
        day_name: daysOrder[index % 7],
        week_number: Math.floor(index / 7) + 1,
      }));

      const { data: workoutDayIds, error: daysError } = await supabase
        .from("workoutday")
        .insert(workoutDays)
        .select("id");

      if (daysError || !workoutDayIds) {
        toast.error(daysError?.message || "Error while inserting workoutDay");
        throw new Error(daysError?.message || "Workout days creation failed");
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
        throw new Error(
          joinError.message || "Error linking workout plan and days"
        );
      }

      return { workoutPlan };
    },
    onSuccess: ({ workoutPlan }: { workoutPlan: WorkoutPlansType }) => {
      queryClient.setQueryData(
        [`workoutPlans_${userId}_${limit}`],
        (oldData: WorkoutPlansType[] | undefined) => {
          if (!oldData) return [workoutPlan];
          return [{ ...workoutPlan }, ...oldData];
        }
      );

      toast.success("New Workout plan Created");
      setOpenCreateForm(false);
    },
  });
};

export const useDeletePlan = (planId: number, limit?: number) => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: workoutDays, error: fetchError } = await supabase
        .from("workoutplan_workoutday")
        .select("workoutday_id")
        .eq("workoutplan_id", planId);

      if (fetchError) throw new Error(fetchError.message);

      if (workoutDays && workoutDays.length > 0) {
        const workoutDayIds = workoutDays.map((plan) => plan.workoutday_id);

        const { error: deleteJoinError } = await supabase
          .from("workoutday")
          .delete()
          .in("id", workoutDayIds);

        if (deleteJoinError) throw new Error(deleteJoinError.message);
      }

      // Finally, delete the workout plan
      const { error: deletePlanError } = await supabase
        .from("workoutplan")
        .delete()
        .eq("id", planId);

      if (deletePlanError) throw new Error(deletePlanError.message);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        [`workoutPlans_${userId}_${limit}`],
        (oldData: WorkoutPlansType[] | undefined) => {
          if (!oldData) return undefined;
          const updatedData = oldData.filter((old) => old.id !== planId);
          return updatedData;
        }
      );
      toast.success("Deleted Plan Successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete plan");
    },
  });
};

export const useAddNewWeek = (planId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<WorkoutDayType[]> => {
      const totalDays = 7;

      // Fetch the current max week_number for the given workout plan
      const { data: existingWeeks, error: fetchError } = await supabase
        .from("workoutday")
        .select("week_number")
        .order("week_number", { ascending: false })
        .limit(1);

      if (fetchError) {
        toast.error(fetchError.message || "Error fetching week data");
        throw new Error(fetchError.message || "Error fetching week data");
      }

      const nextWeekNumber = existingWeeks?.[0]?.week_number
      ? existingWeeks[0].week_number + 1
      : 1; // If no weeks exist, start from 1

      const workoutDays = Array.from({ length: totalDays }, (_, index) => ({
        day_name: daysOrder[index % 7],
        week_number: nextWeekNumber,
      }));

      const { data: workoutDayIds, error: daysError } = await supabase
        .from("workoutday")
        .insert(workoutDays)
        .select("*");

      if (daysError || !workoutDayIds || workoutDayIds.length === 0) {
        toast.error(daysError?.message || "Error while inserting workoutDay");
        throw new Error(
          daysError?.message || "Error while inserting workoutDay"
        );
      }

      const workoutPlanWorkoutDays = workoutDayIds.map((day) => ({
        workoutplan_id: planId,
        workoutday_id: day.id,
      }));

      const { error: joinError } = await supabase
        .from("workoutplan_workoutday")
        .insert(workoutPlanWorkoutDays);

      if (joinError) {
        toast.error(joinError.message || "Error while joining");
        throw new Error(joinError.message || "Error while joining");
      }

      return workoutDayIds;
    },
    onSuccess: (data: WorkoutDayType[]) => {
      queryClient.setQueryData(
        [`workoutplan_days_${planId}`],
        (oldData: WorkoutPlanWithDaysType | undefined) => {
          if (!oldData) return undefined;

          return {
            ...oldData,
            workoutdays: [...(oldData.workoutdays || []), ...data],
          };
        }
      );
    },
    onError: (error) => {
      const errorMessage = (error as Error)?.message || "Something went wrong";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    },
  });
};

export const useTogglePlanVisibility = (
  planId: number,
  { limit = 5 }: WorkoutQueryParams
) => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStatus: boolean) => {
      const { data, error } = await supabase
        .from("workoutplan")
        .update({ is_public: newStatus })
        .eq("id", planId)
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      return { updatedPlan: data };
    },
    onSuccess: ({ updatedPlan }: { updatedPlan: WorkoutPlansType }) => {
      queryClient.setQueryData(
        [`workoutPlans_${userId}_${limit}`],
        (oldData: WorkoutPlansType[] | undefined) => {
          if (!oldData) return undefined;

          return oldData.map((plan) =>
            plan.id === planId
              ? { ...plan, is_public: updatedPlan.is_public }
              : plan
          );
        }
      );
      toast.success("Visibility Updated Successfully");
    },
  });
};

export const useGetPublicPlans = ({
  limit = 5,
  offset = 0,
}: WorkoutQueryParams) => {
  return useQuery({
    queryKey: ["public_plans", limit, offset],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workoutplan")
        .select("*")
        .eq("is_public", true)
        .limit(limit)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message || "Workout plans could not be find");
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};

export const useOtherUsersAllPublicPlans = (
  userId: string,
  page: number,
  limit: number
) => {
  return useQuery<WorkoutPlansType[]>({
    queryKey: ["userPublicPlan", userId, page],
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("workoutplan")
        .select("*")
        .eq("creator_id", userId)
        .eq("is_public", true)
        .range(from, to);

      if (error) throw new Error(error.message);

      return data || [];
    },
  });
};

export const useOtherUsersAllPrivatePlans = (
  userId: string,
  page: number,
  limit: number
) => {
  return useQuery<WorkoutPlansType[]>({
    queryKey: ["userPrivatePlan", userId, page],
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("workoutplan")
        .select("*")
        .eq("creator_id", userId)
        .eq("is_public", false)
        .range(from, to);

      if (error) throw new Error(error.message);

      return data || [];
    },
  });
};

export const useUsersTotalPlanCount = (userId: string) => {
  return useQuery<{ count: number } | undefined>({
    queryKey: ["userTotalPlanCount", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("workoutplan")
        .select("id", { count: "exact" })
        .eq("creator_id", userId);

      if (error) throw new Error(error.message);

      return { count: count ?? 0 };
    },
    enabled: !!userId,
  });
};

export const useUserTotalPublicPlanCount = (userId: string) => {
  return useQuery<{ count: number } | undefined>({
    queryKey: ["userTotalPublicPlanCount", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("workoutplan")
        .select(undefined, { count: "exact", head: true })
        .eq("creator_id", userId)
        .eq("is_public", true);

      if (error) throw new Error(error.message);

      return { count: count ?? 0 };
    },
    enabled: !!userId,
  });
};

export const useUserTotalPrivatePlanCount = (userId: string) => {
  return useQuery<{ count: number } | undefined>({
    queryKey: ["userTotalPrivatePlanCount", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("workoutplan")
        .select(undefined, { count: "exact", head: true })
        .eq("creator_id", userId)
        .eq("is_public", false);

      if (error) throw new Error(error.message);

      return { count: count ?? 0 };
    },
    enabled: !!userId,
  });
};

export const useUpadatePlanDetails = () => {
  const { planInfo } = usePlan();

  return useMutation({
    mutationFn: async ({
      plan_name,
      difficulty_level,
      description,
    }: TEditPlanDetails) => {
      const { error } = await supabase
        .from("workoutplan")
        .update({
          plan_name,
          difficulty_level,
          description,
        })
        .eq("id", planInfo.planId);

      if (error) {
        toast.error(error.message || "Error while updating plan details");
        throw new Error(error.message || "Error while updating plan details");
      }
    },
  });
};
