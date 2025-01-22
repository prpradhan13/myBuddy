/* eslint-disable react-hooks/rules-of-hooks */
import { UserProfileType } from "../../types/userType";
import toast from "react-hot-toast";
import { supabase } from "../supabase";
import { useQuery } from "@tanstack/react-query";

export const getUserDetails = (userId?: string) => {
  if (!userId) {
    toast.error("Unauthorized: User ID is required");
  }

  return useQuery<UserProfileType>({
    queryKey: [`user_profile_${userId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        toast.error(error.message || "User profile not found");
      }

      return data || [];
    },
    enabled: !!userId,
  });
};
