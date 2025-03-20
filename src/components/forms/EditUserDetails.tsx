import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema, ProfileUpdateType } from "@/validations/register";
import { updateProfieDetails } from "@/utils/queries/userProfileQuery";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { FaCamera } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { UserProfileType } from "@/types/userType";
import { useAuth } from "@/context/AuthProvider";

interface ProfileFormProps {
  userFullName: string;
  userName: string;
  userBio: string | null;
  userAvatar: string | null;
  setIsEditUserDetailsOpen: (value: boolean) => void;
}

interface EditUserDetailsProps {
  isEditUserDetailsOpen: boolean;
  setIsEditUserDetailsOpen: (value: boolean) => void;
  userFullName: string;
  userName: string;
  userBio: string | null;
  userAvatar: string | null;
}

const EditUserDetails = ({
  isEditUserDetailsOpen = false,
  setIsEditUserDetailsOpen,
  userAvatar,
  userBio,
  userFullName,
  userName,
}: EditUserDetailsProps) => {
  return (
    <Drawer
      open={isEditUserDetailsOpen}
      onOpenChange={setIsEditUserDetailsOpen}
    >
      <DrawerContent className="bg-MainBackgroundColor border-none">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">Edit</DrawerTitle>
          <DrawerDescription>Edit your profile details.</DrawerDescription>
        </DrawerHeader>

        <ProfileForm
          userAvatar={userAvatar}
          userBio={userBio}
          userFullName={userFullName}
          userName={userName}
          setIsEditUserDetailsOpen={setIsEditUserDetailsOpen}
        />
      </DrawerContent>
    </Drawer>
  );
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  userAvatar,
  userBio,
  userFullName,
  userName,
  setIsEditUserDetailsOpen,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateType>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: userFullName,
      username: userName,
      bio: userBio ?? "",
    },
  });

  const { mutate, isPending } = updateProfieDetails();

  const initialLetterOfName = getInitialLetter(userFullName);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const onSubmit = (data: ProfileUpdateType) => {
    const initialValues = {
      fullname: userFullName,
      username: userName,
      bio: userBio,
    };

    // Compare form values with initial values
    const noChanges = Object.keys(initialValues).every(
      (key) =>
        data[key as keyof ProfileUpdateType] ===
        initialValues[key as keyof typeof initialValues]
    );

    if (noChanges && !selectedImage) {
      toast.error("No changes detected.");
      return;
    }

    mutate(
      { profileForm: data, selectedImage },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            [`user_profile_${userId}`],
            (oldData: UserProfileType) => {
              if (!oldData) return data;

              return {
                ...oldData,
                ...data,
              };
            }
          );

          reset();
          toast.success("Profile picture updated successfully");
          setIsEditUserDetailsOpen(false);
        },
      }
    );
  };

  return (
    <div className="p-4">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3">
          <div className="h-32 w-32 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] rounded-xl border-2 border-[#a7a7a7] flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : userAvatar ? (
              <img
                src={userAvatar}
                alt="Image Preview"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <p className="font-montserrat">{initialLetterOfName}</p>
            )}
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 bg-PrimaryTextColor text-white p-2 rounded-full cursor-pointer"
            >
              <FaCamera color="black" />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <div className="bg-[#444444] p-2 rounded-xl w-[70%]">
            {/* Full Name */}
            <div className="flex items-center gap-2 border-b border-[#fff] py-2">
              <input
                {...register("full_name")}
                type="text"
                id="fullname"
                className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              />
            </div>
            {errors.full_name && (
              <p className="text-red-500">{errors.full_name.message}</p>
            )}

            {/* User Name */}
            <div className="flex items-center gap-2 border-b border-[#fff] py-2">
              <input
                {...register("username")}
                type="text"
                id="username"
                className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
              />
            </div>
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
        </div>
        <div className="mt-3 bg-[#444444] p-2 rounded-xl">
          <h2 className="text-white text-lg font-semibold">About me</h2>
          <div className="bg-[#fff] h-1 w-10 rounded-full"></div>
          <div className="flex items-center gap-2 border border-[#fff] rounded-xl p-2 mt-2">
            <textarea
              {...register("bio")}
              placeholder="Write somthing about yourself..."
              id="bio"
              className="text-white bg-transparent w-full h-36 focus:outline-none placeholder:text-[#c2c2c2]"
            />
          </div>
          {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          variant={"secondary"}
          className="py-2 px-4 rounded-xl w-full"
        >
          {isPending ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default EditUserDetails;
