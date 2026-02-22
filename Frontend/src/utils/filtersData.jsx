// src/utils/filtersData.jsx
import { Monitor } from "lucide-react";
import { FaPlaystation, FaXbox, FaAndroid } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";

export const SORT_OPTIONS = [
  { label: "Relevancia", value: "" },
  { label: "Fecha de Agregado", value: "-added" },
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Fecha de Lanzamiento", value: "-released" },
  { label: "Rating Promedio", value: "-rating" },
];

export const PLATFORM_FAMILIES = [
  {
    name: "PC / OS",
    icon: <Monitor size={16} />,
    platforms: [
      { id: "4", label: "PC" },
      { id: "5", label: "macOS" },
      { id: "6", label: "Linux" },
    ],
  },
  {
    name: "PlayStation",
    icon: <FaPlaystation size={16} />,
    platforms: [
      { id: "187", label: "PlayStation 5" },
      { id: "18", label: "PlayStation 4" },
      { id: "16", label: "PlayStation 3" },
      { id: "15", label: "PlayStation 2" },
      { id: "27", label: "PlayStation 1" },
      { id: "19", label: "PS Vita" },
    ],
  },
  {
    name: "Xbox",
    icon: <FaXbox size={16} />,
    platforms: [
      { id: "186", label: "Xbox Series S/X" },
      { id: "1", label: "Xbox One" },
      { id: "14", label: "Xbox 360" },
      { id: "80", label: "Xbox Original" },
    ],
  },
  {
    name: "Nintendo",
    icon: <SiNintendoswitch size={16} />,
    platforms: [
      { id: "7", label: "Nintendo Switch" },
      { id: "10", label: "Wii U" },
      { id: "11", label: "Wii" },
      { id: "105", label: "GameCube" },
      { id: "8", label: "Nintendo 3DS" },
      { id: "9", label: "Nintendo DS" },
    ],
  },
  {
    name: "Móviles",
    icon: <FaAndroid size={16} />,
    platforms: [
      { id: "21", label: "Android" },
      { id: "3", label: "iOS" },
    ],
  },
];
