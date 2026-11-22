import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge Kern's own text sizes, otherwise it mistakes text-caption, text-2xs, text-h1 and
// text-display for colours and drops them whenever a colour class (text-brand, text-muted-foreground …) follows.
const twMerge = extendTailwindMerge({ extend: { classGroups: { "font-size": [{ text: ["2xs", "caption", "h2", "h1", "display"] }] } } });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
