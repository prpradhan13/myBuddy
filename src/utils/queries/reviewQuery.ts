import { useAuth } from "@/context/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { CommentType, GetReviewStarType } from "@/types/workoutPlans";
import toast from "react-hot-toast";
import { usePlan } from "@/context/WorkoutPlanProvider";
import { useNavigate } from "react-router-dom";

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
  return useQuery<GetReviewStarType[]>({
    queryKey: ["reviews", planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plan_review")
        .select("id, rating, reviewed_user, review")
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

export const useGetComment = (planId: number) => {
  return useQuery<CommentType[]>({
    queryKey: ["comments", planId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('fetch_nested_comments', { workoutplan_id: planId });
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!planId
  })
}

export const useCreateComment = () => {
  const { user } = useAuth();
  const { planInfo } = usePlan();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ cmtText, parentCmtId }: { parentCmtId?: number | null, cmtText: string }) => {
      if (!user?.id) {
        toast.error("User id missing!");
        return null;
      }
      
      const {error} = await supabase
        .from("comments")
        .insert([{
          user_id: user.id,
          plan_id: planInfo.planId,
          parent_comment_id: parentCmtId,
          text: cmtText,
        }])

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", planInfo.planId] });
      navigate(-1)
    },

    onError: (error) => {
      toast.error(error.message || "Failed to add comment!");
    },
  })
}