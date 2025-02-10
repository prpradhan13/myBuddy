import { useAuth } from "@/context/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { GetReviewDetailsType } from "@/types/workoutPlans";

interface TReviewData {
  star: number | null;
  review?: string;
}

export const useAddReview = (planId: number) => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ reviewData }: { reviewData: TReviewData }) => {
      const { error } = await supabase.from("plan_review").insert([
        {
          plan_id: planId,
          reviewed_user: user?.id,
          rating: reviewData.star,
          review: reviewData.review,
        },
      ]);

      if (error) throw new Error(error.message);
    },
  });
};

export const useGetReviewDetails = (planId: number) => {
  return useQuery<GetReviewDetailsType[]>({
    queryKey: ["reviews", planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plan_review")
        .select("*")
        .eq("plan_id", planId)

      if (error) throw new Error(error.message);

      return data || [];
    },
  });
};

export const useRemoveReview = (planId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {

      const { error } = await supabase
        .from("plan_review")
        .delete()
        .eq("id", reviewId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", planId] });
    },
    onError: (error) => {
      console.error("Failed to remove review:", error);
    },
  });
};
