// src/utils/imageCrop.js
import FallbackImage from "../assets/images/pink_paint.webp";

/**
 * 1. RECORTA IMÁGENES (600x400 para tarjetas)
 */
export const getCroppedImageUrl = (url, width = 600, height = 400) => {
  if (!url) return FallbackImage;
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + `crop/${width}/${height}/` + url.slice(index);
};

/**
 * 2. REDIMENSIONA (Valores estándar de RAWG: 420, 640, 1280)
 */
export const getResizedImageUrl = (url, width) => {
  if (!url) return FallbackImage;
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + `resize/${width}/-/` + url.slice(index);
};

/**
 * 3. GENERADOR RESPONSIVO (Solo con tamaños soportados)
 */
export const getResponsiveSrcSet = (url) => {
  if (!url) return "";

  return `
    ${getResizedImageUrl(url, 420)} 420w,
    ${getResizedImageUrl(url, 640)} 640w,
    ${getResizedImageUrl(url, 1280)} 1280w,
    ${url} 1920w
  `;
};
