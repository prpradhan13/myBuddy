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
      const { data, error } = await supabase
        .from("banners")
        .upsert(
            { user_id: userId, content_type, content_path },
            { onConflict: "user_id" }
        )
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
  });
};
