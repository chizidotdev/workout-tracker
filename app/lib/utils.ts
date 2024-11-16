import dateTime from "date-and-time";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  dateObj: Date | string,
  formatString: string = "dddd DD, YYYY",
  utc?: boolean | undefined
): string => {
  if (!dateObj) return "-";

  const date = new Date(dateObj);

  return dateTime.format(date, formatString, utc);
};

export const timeAgo = (date: Date | string): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return formatDate(dateObj, "MMM DD, YYYY");
  }

  if (days > 0) {
    return `${days} days ago`;
  }

  if (hours > 0) {
    return `${hours} hours ago`;
  }

  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }

  return `${seconds} seconds ago`;
};
