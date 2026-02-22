// src/utils/storeIcons.jsx
import {
  FaSteam,
  FaPlaystation,
  FaXbox,
  FaAppStoreIos,
  FaGooglePlay,
} from "react-icons/fa";
import { SiNintendoswitch, SiEpicgames, SiGogdotcom } from "react-icons/si";
import { ShoppingCart } from "lucide-react";

export const getStoreIcon = (slug, iconSize = 20) => {
  const s = slug?.toLowerCase() || "";

  if (s.includes("steam")) return <FaSteam size={iconSize} />;
  if (s.includes("epic")) return <SiEpicgames size={iconSize} />;
  if (s.includes("gog")) return <SiGogdotcom size={iconSize} />;
  if (s.includes("playstation")) return <FaPlaystation size={iconSize} />;
  if (s.includes("xbox")) return <FaXbox size={iconSize} />;
  if (s.includes("nintendo")) return <SiNintendoswitch size={iconSize} />;
  if (s.includes("apple") || s.includes("ios"))
    return <FaAppStoreIos size={iconSize} />;
  if (s.includes("google") || s.includes("android"))
    return <FaGooglePlay size={iconSize} />;

  return <ShoppingCart size={iconSize} />;
};
