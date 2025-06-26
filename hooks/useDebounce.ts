import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a value. This delays updating the value until after a specified delay.
 * Useful for scenarios like search inputs where frequent updates can be avoided.
 *
 * @param {any} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds for the debounce.
 * @returns {any} - The debounced value.
 */
export default function useDebounce(value: string, delay: number): string {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value.trim());
    }, delay);

    // Clear the timer if the value or delay changes, or when the component unmounts.
    // This ensures the debounced value is updated only after the delay period without interruptions.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect only when value or delay changes.

  return debouncedValue;
}
