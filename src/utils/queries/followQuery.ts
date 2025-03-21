import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "@/context/AuthProvider";

export const useFollowers = (userId: string) => {
  return useQuery<{ count: number; followerIds: string[] } | undefined>({
    queryKey: ["followerAndCount", userId],
    queryFn: async () => {
      const { data, count, error } = await supabase
        .from("followers")
        .select("follower_id", { count: "exact" })
        .eq("following_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const followerIds = data.map(({ follower_id }) => follower_id);

      return { count: count ?? 0, followerIds };
    },
    enabled: !!userId,
  });
};

export const useFollowings = (userId: string) => {
  return useQuery<{ count: number; followingIds: string[] } | undefined>({
    queryKey: ["followingAndCount", userId],
    queryFn: async () => {
      const { data, count, error } = await supabase
        .from("followers")
        .select("following_id", { count: "exact" })
        .eq("follower_id", userId);

      if (error) {
        throw new Error(error.message);
      }

      const followingIds = data.map(({ following_id }) => following_id);

      return { count: count ?? 0, followingIds };
    },
    enabled: !!userId,
  });
};

export const useCreateFollow = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      profileId,
      isFollow,
    }: {
      profileId: string;
      isFollow?: boolean;
    }) => {
      if (!user) return;

      if (isFollow) {
        // Unfollow
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profileId);

        if (error) throw new Error("Failed to Unfollow the user");

        return { id: user.id, action: "unfollow" };
      }

      // Follow
      const { error } = await supabase
        .from("followers")
        .insert({
          follower_id: user.id,
          following_id: profileId,
        })
        .select("*")
        .single();

        if (error) throw new Error(error.message);

      return { id: user.id, action: "follow" };
    },
  });
};
