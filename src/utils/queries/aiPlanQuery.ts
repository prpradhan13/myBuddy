import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "@/context/AuthProvider";
import { AiGeneratedPlansType, PlanCardType } from "@/types/aiPlanType";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useGetAiGeneratedPlan = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<PlanCardType[]>({
    queryKey: ["aiGeneratedPlans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_generated_plans")
        .select("id, created_at, creator_id, plan_name")
        .eq("creator_id", userId);

      if (error) throw new Error(error.message || "Something went wrong!");

      return data || [];
    },
    enabled: !!userId,
  });
};

// utils/queries/aiPlanQuery.ts
export const useGetAiGeneratedPlanById = (planId: number | undefined) => {
  return useQuery<AiGeneratedPlansType | null>({
    queryKey: ["aiGeneratedPlan", planId],
    queryFn: async () => {
      if (!planId) return null;

      const { data, error } = await supabase
        .from("ai_generated_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error) throw new Error(error.message || "Something went wrong!");

      return data;
    },
    enabled: !!planId,
  });
};

export const useCanCreatePlan = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["canCreatePlan", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("ai_generated_plans")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", userId);

      if (error || count === null) {
        console.error("Something went wrong:", error?.message);
        return false;
      }

      return count < 3;
    },
    enabled: !!userId,
  });
};

export const useDeleteAiGeneratedPlan = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (planId: number) => {
      const { error } = await supabase
        .from("ai_generated_plans")
        .delete()
        .eq("id", planId);

      if (error) {
        toast.error(error.message || "Cannot delete!!");
      }

      return planId;
    },
    onSuccess: (planIdReturn) => {
      queryClient.setQueryData(
        ["aiGeneratedPlans"],
        (oldData: PlanCardType[] | undefined) => {
          if (!oldData) return [];
          const newData = oldData.filter((old) => old.id !== planIdReturn);
          return newData;
        }
      );
      navigate(-1);
      toast.success("Plan deleted successfully!");
    },
  });
};
