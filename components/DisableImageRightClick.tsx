"use client";

import { useEffect } from "react";

export function DisableImageRightClick() {
  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === "IMG") {
        e.preventDefault();

        // Optional: Show a custom message
        // alert("Right-clicking on images is disabled");

        return false;
      }
    };

    // Prevent dragging of images
    const preventDrag = (e: DragEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners when component mounts
    document.addEventListener(
      "contextmenu",
      preventRightClick as EventListener
    );
    document.addEventListener("dragstart", preventDrag as EventListener);

    // Clean up when component unmounts
    return () => {
      document.removeEventListener(
        "contextmenu",
        preventRightClick as EventListener
      );
      document.removeEventListener("dragstart", preventDrag as EventListener);
    };
  }, []);

  return null; // This component doesn't render anything
}
