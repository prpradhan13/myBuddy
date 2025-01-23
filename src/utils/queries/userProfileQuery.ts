/* eslint-disable react-hooks/rules-of-hooks */
import { UserProfileFormType, UserProfileType } from "../../types/userType";
import toast from "react-hot-toast";
import { supabase } from "../supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

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

export const updateProfiePicture = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      profileForm,
      selectedImage,
    }: {
      profileForm: UserProfileFormType;
      selectedImage: File | null;
    }) => {

      const formData = { ...profileForm };

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
        .eq("id", userId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`user_profile_${userId}`] });
      toast.success("Profile picture updated successfully");
      navigate(-1);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
