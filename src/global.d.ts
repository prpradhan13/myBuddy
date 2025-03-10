export {};

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: unknown,
        callback: (error: unknown, result: unknown) => void
      ) => {
        open: () => void;
      };
    };
  }
}