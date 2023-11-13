import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Campaign = {
  campname: string | undefined
  description: string | undefined
  launchDate: Date | undefined,
  id: string | undefined
}
