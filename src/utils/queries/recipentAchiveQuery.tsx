import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { RecipentAchiveDataType } from "@/types/recipientAchiveType";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

export const useGetRecipentAchivementDetails = (recipientId?: string) => {
  if (!recipientId) {
    throw new Error("recipentId is required");
  }

  return useQuery<RecipentAchiveDataType[]>({
    queryKey: ["recipientAchievementDetails", recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipient_achive")
        .select(
          "*, recipient: recipient_id(id, full_name, username, avatar_url), planDetails: plan_id(plan_name), dayDetails: day_id(week_number, day_name, workout_name), exerciseDetails:exercise_id(exercise_name), setDetails: set_id(target_repetitions, target_weight)"
        )
        .eq("recipient_id", recipientId)
        .order("created_at");

      if (error)
        throw new Error(error.message || "Recipient not found in database!");

      return data ?? [];
    },
  });
};

export const useRecipientAchiveSetDetails = (setId: number) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  if (!currentUserId) {
    toast.error("User not found");
    throw new Error("User not found");
  }

  return useQuery<RecipentAchiveDataType>({
    queryKey: ["recipientAchiveSetDetails", setId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipient_achive")
        .select("*, setDetails: set_id(target_repetitions, target_weight)")
        .eq("set_id", setId)
        .maybeSingle();

      if (error) throw new Error(error.message || "Set not found in database!");

      return data ?? {};
    },
  });
};
