import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import { RecipientAchivementType, SendedPlanType } from "@/types/workoutPlans";
import { SearchUserType } from "@/types/userType";
import { useAuth } from "@/context/AuthProvider";
import { Dispatch, SetStateAction } from "react";

export const useGetSharedUsers = (planId: number) => {
  return useQuery({
    queryKey: [`sharedUsers_${planId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workoutplan_shared")
        .select("user_id, profiles!workoutplan_shared_user_id_fkey(email)")
        .eq("workoutplan_id", planId);

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useGetSharedPlan = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  return useQuery<SendedPlanType[]>({
    queryKey: [`sharedPlans`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workoutplan_shared")
        .select("*, workoutplan:workoutplan_id (plan_name, creator_id, image_content), profiles:user_id (full_name, username, email, avatar_url)")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data || [];
    },
    enabled: !!currentUserId
  });
};

export const useCreateSharedPlan = (planId: number) => {
  return useMutation({
    // This userId is plan reviser user
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("workoutplan_shared")
        .insert([{ workoutplan_id: planId, user_id: userId }]);

      if (error) {
        console.error("Error sharing plan:", error.message);
        return;
      }
    },
    onSuccess: () => {
        toast.success("Plan Shared")
    },
    onError: (error) => {
        throw new Error(error.message);
    }
  });
};

export const useSearchUser = (searchText: string) => {
  const { user } = useAuth();
  const loggedInUserId = user?.id;

  return useQuery<SearchUserType[]>({
    queryKey: ["searchUsers", searchText],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, email, avatar_url")
        .ilike("username", `%${searchText}%`)
        .neq("id", loggedInUserId);

        if (error) {
          toast.error(error.message);
          throw new Error(error.message);
        }

        return data ?? [];
    },
    enabled: searchText.length > 0,
  })
};

export const useSendedPlan = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  
  return useQuery<SendedPlanType[]>({
    queryKey: ["sendedPlans", currentUserId],
    queryFn: async () => {
       const { data, error } = await supabase
        .from("workoutplan_shared")
        .select("*, workoutplan:workoutplan_id (plan_name, image_content), profiles:user_id (full_name, username, email, avatar_url)")
        .eq("sender_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data || []
    },
    enabled: !!currentUserId
  });
}

interface TUseUpdateSetByRecipient {
  planId?: number;
  dayId?: number;
  exerciseId?: number;
  recipientId?: string;
  setExerciseSetIdForUpdate: Dispatch<SetStateAction<number | null>>;
}

interface TRecipientAchiveFormData {
  achive_repetition: string;
  achive_weight: string;
  setId: number;
}

export const useUpdateSetByRecipient = ({ planId, dayId, exerciseId, recipientId, setExerciseSetIdForUpdate }: TUseUpdateSetByRecipient) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData }: {formData: TRecipientAchiveFormData}) => {
      const { error } = await supabase
        .from("recipient_achive")
        .insert({
          recipient_id: recipientId,
          plan_id: planId,
          day_id: dayId,
          exercise_id: exerciseId,
          set_id: formData.setId,
          achive_repetition: formData.achive_repetition,
          achive_weight: formData.achive_weight
        })

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipientAchive", recipientId] });
      setExerciseSetIdForUpdate(null);
      toast.success("Successfully submitted")
    },
    onError: () => {
      toast.error("Submission failed");
    }
  })
  
}

export const useGetRecipientAchivement = (setId: number) => {
  return useQuery<RecipientAchivementType[]>({
    queryKey: ["recipientAchiveSet", setId],
    queryFn: async () => {
      const {data, error} = await supabase
        .from("recipient_achive")
        .select("*, profiles(username, avatar_url, full_name)")
        .eq("set_id", setId)

      if(error) throw new Error(error.message);
      
      return data || [];
    },
    enabled: !!setId
  })
}

export const useTotalSharedCount = (senderId: string) => {
  return useQuery<{count: number} | undefined>({
    queryKey: ["totalSharedCount", senderId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("workoutplan_shared")
        .select(undefined, { count: "exact", head: true })
        .eq("sender_id", senderId);

      if (error) throw new Error(error.message);

      return { count: count ?? 0 };
    },
    enabled: !!senderId
  })
};

export const useHasReceivedPlan = (planId: number) => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ["hasReceivedPlan", userId, planId],
    queryFn: async () => {
      if (!userId) return false;

      const { data, error } = await supabase
        .from("workoutplan_shared")
        .select("user_id")
        .eq("workoutplan_id", planId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw new Error(error.message);

      return !!data;
    },
    enabled: !!userId && !!planId,
  });
};