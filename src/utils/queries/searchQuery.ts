import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import { searchResultsType } from "@/types/workoutPlans";

export const useSearches = ({
  searchText,
  selectedButton,
  enabled
}: {
  searchText: string;
  selectedButton: "workoutplan" | "profiles";
  enabled: boolean;
}) => {
  const { user } = useAuth();

  return useQuery<searchResultsType[]>({
    queryKey: ["searchResults", searchText, selectedButton],
    queryFn: async () => {
      let query = supabase.from(`${selectedButton}`).select("*");

      if (selectedButton === "workoutplan")
        query = query
          .ilike("plan_name", `%${searchText}%`)
          .eq("is_public", true);
      if (selectedButton === "profiles")
        query = query.ilike("full_name", `%${searchText}%`).neq("id", user?.id);

      const { data, error } = await query;

      if (error) {
        toast.error(error.message || "Could not be find");
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: enabled && !!searchText.trim(),
  });
};
