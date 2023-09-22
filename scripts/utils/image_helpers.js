import imageCompression from "https://cdn.skypack.dev/browser-image-compression";

export const imageToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
  });

export const compressImage = async (image) => {
  const options = {
    maxSizeMB: 0.07,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  };

  try {
    return await imageCompression(image, options);
  } catch (error) {
    throw new Error("Error compressing the image: " + error);
  }
};
