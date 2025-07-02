import * as React from "react";

export function useIsMouseAvailable(mobileBreakpoint = 768) {
  const [isMouseAvailable, setIsMouseAvailable] = React.useState(false);

  React.useEffect(() => {
    // Check for devices with fine pointer (e.g., mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsMouseAvailable(mediaQuery.matches);

    // Add a listener for changes
    const handleMediaChange = (e: MediaQueryListEvent) =>
      setIsMouseAvailable(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup the listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return !!isMouseAvailable;
}
