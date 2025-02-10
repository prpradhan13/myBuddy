import { useEffect, useState } from "react";

export const getInitialLetter = (fullName?: string) => {
  if (!fullName) return "";
  const nameParts = fullName.split(" ");
  return nameParts.length === 1
    ? fullName.slice(0, 2).toUpperCase()
    : nameParts
        .map((name: string) => name[0])
        .join("")
        .toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const useDebounce = (value: string, delay = 300) => {
  const [debounceText, setDebounceText] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceText(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceText;
};

export const calculateAverageRating = (reviews: { rating: number }[] = []) => {
  if (!reviews.length) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};
