// src/utils/platformIcons.jsx
import {
  FaSteam,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaAndroid,
  FaLinux,
} from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";
import { Gamepad2 } from "lucide-react";

export const getPlatformIcon = (slug, iconSize = 24) => {
  const s = slug?.toLowerCase() || "";

  if (s.includes("pc")) return <FaSteam size={iconSize} />;
  if (s.includes("playstation")) return <FaPlaystation size={iconSize} />;
  if (s.includes("xbox")) return <FaXbox size={iconSize} />;
  if (s.includes("nintendo")) return <SiNintendoswitch size={iconSize} />;
  if (s.includes("linux")) return <FaLinux size={iconSize} />;
  if (s.includes("mac") || s.includes("os") || s.includes("apple"))
    return <FaApple size={iconSize} />;
  if (s.includes("android")) return <FaAndroid size={iconSize} />;

  return <Gamepad2 size={iconSize} />;
};
