import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "@/context/AuthProvider";
import { AiGeneratedPlansType, PlanCardType } from "@/types/aiPlanType";

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
