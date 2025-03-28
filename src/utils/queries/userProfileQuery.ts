/* eslint-disable react-hooks/rules-of-hooks */
import { UserProfileFormType, UserProfileType } from "../../types/userType";
import toast from "react-hot-toast";
import { supabase } from "../supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";

export const getUserDetails = (userId?: string) => {
  if (!userId) {
    toast.error("Unauthorized: User ID is required");
    throw new Error("Unauthorized : User ID is required");
  }

  return useQuery<UserProfileType>({
    queryKey: [`user_profile_${userId}`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, profile_banner(*)")
        .eq("id", userId)
        .single();

      if (error) {
        toast.error(error.message || "User profile not found");
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!userId,
  });
};

export const updateProfieDetails = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({
      profileForm,
      selectedImage,
    }: {
      profileForm: UserProfileFormType;
      selectedImage: File | null;
    }) => {

      const formData = { ...profileForm };
      console.log(formData);

      if (selectedImage) {
        const fileName = `${userId}/${new Date().getTime()}_${selectedImage.name}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, selectedImage, {
            contentType: selectedImage.type,
          });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        formData.avatar_url = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          username: formData.username,
          bio: formData.bio,
          avatar_url: formData.avatar_url
        })
        .eq("id", userId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
