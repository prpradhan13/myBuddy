/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cloudinary } from "@cloudinary/url-gen";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

export const openCloudinaryUploadWidget = (
  onSuccess: (publicId: string) => void
) => {
  if (!window.cloudinary) {
    alert("Cloudinary not loaded!");
    return;
  }

  const uploadWidget = window.cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      resourceType: "auto",
      clientAllowedFormats: ["jpg", "jpeg", "mp4", "mov"],
      showAdvancedOptions: true,
      cropping: false,
      maxFileSize: 100000000,
      maxDuration: 30,
    },
    (error: unknown, result: unknown) => {
      if (error && error instanceof Error) {
        console.error("Upload Error: ", error);
        alert("Error uploading video. Please try again.");
        return;
      }

      if (
        result &&
        typeof result === "object" &&
        "event" in result &&
        "info" in result &&
        (result as any).event === "success"
      ) {
        const publicId = (result as any).info.public_id;
        onSuccess(publicId);
      }
    }
  );

  uploadWidget.open();
};