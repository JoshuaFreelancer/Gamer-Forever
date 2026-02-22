// src/utils/imageCrop.js
import FallbackImage from "../assets/images/pink_paint.webp"; // Asegúrate de que la ruta coincida con tu estructura

export const getCroppedImageUrl = (url) => {
  if (!url) return FallbackImage;

  const target = "media/";
  const index = url.indexOf(target) + target.length;

  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};
