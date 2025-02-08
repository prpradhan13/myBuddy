import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import toast from "react-hot-toast";
import { SendedPlanType } from "@/types/workoutPlans";
import { SearchUserType } from "@/types/userType";
import { useAuth } from "@/context/AuthProvider";

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
        .select("*, workoutplan:workoutplan_id (plan_name), profiles:user_id (full_name, username, email, avatar_url)")
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
        .select("*, workoutplan:workoutplan_id (plan_name), profiles:user_id (full_name, username, email, avatar_url)")
        .eq("sender_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data || []
    },
    enabled: !!currentUserId
  });
}