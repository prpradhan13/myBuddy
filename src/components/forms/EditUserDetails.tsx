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
        <DrawerHeader className="space-y-2">
          <DrawerTitle className="text-PrimaryTextColor text-2xl font-bold">Edit Profile</DrawerTitle>
          <DrawerDescription className="text-gray-400">Make changes to your profile here. Click save when you're done.</DrawerDescription>
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
    <div className="p-6 space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-6 items-start">
          <div className="relative group">
            <div className="h-32 w-32 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989] rounded-xl border-2 border-[#a7a7a7] flex justify-center items-center text-PrimaryTextColor font-bold text-xl overflow-hidden">
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
                <p className="font-montserrat text-4xl">{initialLetterOfName}</p>
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-2 right-2 bg-white/90 text-black p-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg"
            >
              <FaCamera size={16} />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullname" className="text-sm font-medium text-gray-400">Full Name</label>
              <div className="bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] p-3">
                <input
                  {...register("full_name")}
                  type="text"
                  id="fullname"
                  className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#666]"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.full_name && (
                <p className="text-red-500 text-sm">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-400">Username</label>
              <div className="bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] p-3">
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#666]"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-gray-400">About Me</label>
          <div className="bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] p-3">
            <textarea
              {...register("bio")}
              placeholder="Write something about yourself..."
              id="bio"
              className="text-white bg-transparent w-full h-32 focus:outline-none placeholder:text-[#666] resize-none"
            />
          </div>
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditUserDetailsOpen(false)}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserDetails;
