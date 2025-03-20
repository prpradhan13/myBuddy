import { useAuth } from "@/context/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

export const useAddBanner = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({
      content_type,
      content_path,
    }: {
      content_type: string;
      content_path: string;
    }) => {
      const { data: banner, error: bannerError } = await supabase
        .from("banners")
        .upsert(
            { user_id: userId, content_type, content_path },
            { onConflict: "user_id" }
        )
        .select("*")
        .single();

      if (bannerError) throw new Error(bannerError.message);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ profile_banner: banner.id })
        .eq("id", userId);

      if (profileError) throw new Error(profileError.message);

      return banner;
    },
  });
};
