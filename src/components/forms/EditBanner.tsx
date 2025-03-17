import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "@/utils/lib/cloudinary";
import { bannerPublicId } from "@/utils/constants";
import { Button } from "../ui/button";
import { useAddBanner } from "@/utils/queries/profileBannerQuery";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthProvider";
import { UserProfileType } from "@/types/userType";

interface EditBannerProps {
  isBannerDrawerOpen: boolean;
  setIsBannerDrawerOpen: (value: boolean) => void;
}

interface BannerFormProps {
  setIsBannerDrawerOpen: (value: boolean) => void;
}

const EditBanner: React.FC<EditBannerProps> = ({
  isBannerDrawerOpen,
  setIsBannerDrawerOpen,
}) => {
  return (
    <Drawer open={isBannerDrawerOpen} onOpenChange={setIsBannerDrawerOpen}>
      <DrawerContent className="bg-MainBackgroundColor border-none">
        <DrawerHeader>
          <DrawerTitle className="text-PrimaryTextColor">Banner</DrawerTitle>
          <DrawerDescription>Add a banner for your profile.</DrawerDescription>
        </DrawerHeader>

        <BannerForm setIsBannerDrawerOpen={setIsBannerDrawerOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const BannerForm: React.FC<BannerFormProps> = ({ setIsBannerDrawerOpen }) => {
  const [selectedBanner, setSelectedBanner] = useState<{
    content_type: string;
    content_path: string;
  } | null>(null);
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useAddBanner();

  const clickOnGivenBanner = (item: {
    content_type: string;
    content_path: string;
  }) => {
    setSelectedBanner((prev) => ({ ...prev, ...item }));
  };

  const bannerChoosed =
    selectedBanner && cld.image(selectedBanner.content_path);

  const handleBannerSave = () => {
    if (!selectedBanner) {
      toast.error("Please select a banner");
      return;
    }

    mutate(
      {
        content_path: selectedBanner.content_path,
        content_type: selectedBanner.content_type,
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            [`user_profile_${userId}`],
            (oldData: UserProfileType | undefined) => {
              if (!oldData) return { profile_banner: data };

              return {
                ...oldData,
                profile_banner: {
                  id: data.id,
                  user_id: data.user_id,
                  content_type: data.content_type,
                  content_path: data.content_path,
                  created_at: data.created_at,
                },
              };
            }
          );

          setIsBannerDrawerOpen(false);
          toast.success("Your profile banner has been updated 🎉");
        },
        onError: () => {
          toast.error("An error has occurred");
        },
      }
    );
  };

  return (
    <div className="px-4 pb-4">
      <div className="flex mt-3 gap-3">
        <div className="h-60 bg-black w-[70%] rounded-xl overflow-hidden aspect-square flex justify-center items-center">
          {!selectedBanner ? (
            <p className="text-PrimaryTextColor">Choose a Banner</p>
          ) : bannerChoosed ? (
            <AdvancedImage
              cldImg={bannerChoosed}
              className={"h-full w-full object-cover"}
            />
          ) : (
            ""
          )}
        </div>

        <div className="h-60 bg-[#444444] rounded-xl p-2 grid grid-cols-2 gap-2 place-items-center">
          {bannerPublicId.map((item, index) => {
            const givenBanner = cld.image(item.content_path);

            return (
              <div
                key={index}
                onClick={() => clickOnGivenBanner(item)}
                className="rounded-xl w-14 h-14 overflow-hidden"
              >
                <AdvancedImage
                  cldImg={givenBanner}
                  className="rounded-xl w-full h-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant={"secondary"}
        disabled={!selectedBanner || isPending}
        onClick={handleBannerSave}
        className={`w-full mt-4 text-lg ${
          !selectedBanner ? "bg-white/50" : "bg-white"
        }`}
      >
        {isPending ? "Please wait..." : "Save"}
      </Button>
    </div>
  );
};

export default EditBanner;
