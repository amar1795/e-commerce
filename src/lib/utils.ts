import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const getUniqueColors = (variants) => {
  const colors = variants?.map(variant => variant?.color);
  return [...new Set(colors)];
};

