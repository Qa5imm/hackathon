import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageURL = (key: string) =>
  `https://pub-db2d009c16384a99a96b6d2ce3a59828.r2.dev/${key}`;
