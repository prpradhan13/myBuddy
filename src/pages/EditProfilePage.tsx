import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { UserProfileType } from "../types/userType";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileUpdateSchema,
  ProfileUpdateType,
} from "../validations/register";
import { getInitialLetter } from "../utils/helpingFunctions";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import { updateProfiePicture } from "../utils/queries/userProfileQuery";

const EditProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateType>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullname: "",
      username: "",
      bio: "",
    },
  });

  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const userData = queryClient.getQueryData<UserProfileType>([
    `user_profile_${userId}`,
  ]);

  // State for managing profile image
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      reset({
        fullname: userData.full_name || "",
        username: userData.username || "",
        bio: userData.bio || "",
      });
    }
  }, [userData, reset]);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const { mutate, isPending } = updateProfiePicture();

  // Form submission handler
  const onSubmit = async (data: ProfileUpdateType) => {
    const initialValues = {
      fullname: userData?.full_name || "",
      username: userData?.username || "",
      bio: userData?.bio || "",
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

    mutate({ profileForm: data, selectedImage });
    reset();
  };

  const initialLetterOfName = getInitialLetter(userData?.full_name);

  return (
    <div className="bg-MainBackgroundColor min-h-screen w-full p-4 flex flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-t from-[#1d1d1d] via-[#353535] to-[#898989]  rounded-full flex justify-center items-center text-PrimaryTextColor font-bold text-xl relative">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : userData?.avatar_url ? (
                <img
                  src={userData.avatar_url}
                  alt="User Avatar"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <p className="font-montserrat">{initialLetterOfName}</p>
              )}
            </div>
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
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullname"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Full Name
          </label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
            <input
              {...register("fullname")}
              type="text"
              id="fullname"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
            />
          </div>
          {errors.fullname && (
            <p className="text-red-500">{errors.fullname.message}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Username
          </label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
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

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="text-[#dfdfdf] mb-1 font-medium text-lg"
          >
            Bio
          </label>
          <div className="flex items-center gap-2 border border-[#5e5e5e] rounded-lg py-2 px-3">
            <textarea
              {...register("bio")}
              id="bio"
              className="text-white bg-transparent w-full focus:outline-none placeholder:text-[#c2c2c2]"
            />
          </div>
          {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg w-full"
        >
          {isPending ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
