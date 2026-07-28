import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Guards against open-redirect: only a same-origin relative path (starting
// with a single "/") is safe to hand to router.push() after login.
export function isSafeRedirectPath(path: string): boolean {
  return /^\/(?!\/|\\)/.test(path);
}
