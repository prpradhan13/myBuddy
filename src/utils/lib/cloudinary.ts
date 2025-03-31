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
  onSuccess: (publicId: string, type: "image" | "video") => void
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
      clientAllowedFormats: ["jpg", "jpeg", "png", "mp4", "mov"],
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
        const resourceType = (result as any).info.resource_type;

        if (resourceType === "image") {
          onSuccess(publicId, "image");
        } else if (resourceType === "video") {
          onSuccess(publicId, "video");
        } else {
          console.warn("Unsupported file type uploaded");
        }
      }
    }
  );

  uploadWidget.open();
};

interface CloudinaryOptions {
  transformations?: string;
}

export const getCloudinaryUrl = (publicId: string, options: CloudinaryOptions = {}) => {
  const transformations = options?.transformations || "c_fill,w_200,h_200";

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};