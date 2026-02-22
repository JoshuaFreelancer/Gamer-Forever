// src/utils/giantPlatformIcons.jsx
import { Joystick } from "lucide-react";
import {
  FaPlaystation,
  FaXbox,
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaGlobe,
} from "react-icons/fa";
import {
  SiNintendoswitch,
  SiIos,
  SiSega,
  SiAtari,
  SiCommodore,
} from "react-icons/si";
import clsx from "clsx";

export const getGiantPlatformIcon = (slug) => {
  const s = slug.toLowerCase();
  const baseClasses =
    "w-36 h-36 md:w-40 md:h-40 transition-all duration-500 text-gray-700/50 group-hover:scale-110 group-hover:-rotate-6";

  if (
    s.includes("playstation") ||
    s.includes("ps-") ||
    s.includes("psp") ||
    s.includes("vita")
  )
    return (
      <FaPlaystation
        className={clsx(
          baseClasses,
          "group-hover:text-[#00439C] group-hover:drop-shadow-[0_0_25px_rgba(0,67,156,0.8)]",
        )}
      />
    );
  if (s.includes("xbox"))
    return (
      <FaXbox
        className={clsx(
          baseClasses,
          "group-hover:text-[#107C10] group-hover:drop-shadow-[0_0_25px_rgba(16,124,16,0.8)]",
        )}
      />
    );
  if (s.includes("pc") || s.includes("windows"))
    return (
      <FaWindows
        className={clsx(
          baseClasses,
          "group-hover:text-[#0078D7] group-hover:drop-shadow-[0_0_25px_rgba(0,120,215,0.8)]",
        )}
      />
    );
  if (s.includes("mac") || s.includes("apple"))
    return (
      <FaApple
        className={clsx(
          baseClasses,
          "group-hover:text-gray-200 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        )}
      />
    );
  if (s.includes("linux"))
    return (
      <FaLinux
        className={clsx(
          baseClasses,
          "group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]",
        )}
      />
    );
  if (
    s.includes("nintendo") ||
    s.includes("wii") ||
    s.includes("gamecube") ||
    s.includes("game-boy") ||
    s.includes("snes") ||
    s.includes("nes") ||
    s.includes("ds")
  )
    return (
      <SiNintendoswitch
        className={clsx(
          baseClasses,
          "group-hover:text-[#E60012] group-hover:drop-shadow-[0_0_25px_rgba(230,0,18,0.8)]",
        )}
      />
    );
  if (s.includes("android"))
    return (
      <FaAndroid
        className={clsx(
          baseClasses,
          "group-hover:text-[#3DDC84] group-hover:drop-shadow-[0_0_25px_rgba(61,220,132,0.8)]",
        )}
      />
    );
  if (s.includes("ios"))
    return (
      <SiIos
        className={clsx(
          baseClasses,
          "group-hover:text-gray-200 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        )}
      />
    );
  if (
    s.includes("sega") ||
    s.includes("genesis") ||
    s.includes("dreamcast") ||
    s.includes("game-gear")
  )
    return (
      <SiSega
        className={clsx(
          baseClasses,
          "group-hover:text-[#0089CF] group-hover:drop-shadow-[0_0_25px_rgba(0,137,207,0.8)]",
        )}
      />
    );
  if (s.includes("atari"))
    return (
      <SiAtari
        className={clsx(
          baseClasses,
          "group-hover:text-red-500 group-hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]",
        )}
      />
    );
  if (s.includes("commodore") || s.includes("amiga"))
    return (
      <SiCommodore
        className={clsx(
          baseClasses,
          "group-hover:text-blue-300 group-hover:drop-shadow-[0_0_25px_rgba(147,197,253,0.8)]",
        )}
      />
    );
  if (s.includes("web"))
    return (
      <FaGlobe
        className={clsx(
          baseClasses,
          "group-hover:text-blue-400 group-hover:drop-shadow-[0_0_25px_rgba(96,165,250,0.8)]",
        )}
      />
    );

  return (
    <Joystick
      className={clsx(
        baseClasses,
        "group-hover:text-jinx-pink group-hover:drop-shadow-[0_0_25px_rgba(255,0,255,0.8)]",
      )}
    />
  );
};
