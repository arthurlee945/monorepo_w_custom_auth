import { useEffect, useState } from "react";

//------------custom
import { medias } from "global-constants";

const { mobile, tablet } = medias;

export const useViewPortTracker = () => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    let prevWidth: number | undefined = undefined;
    const handleVPTrack = () => {
      let currentWidth = window.innerWidth;
      if (
        prevWidth &&
        ((currentWidth > tablet && prevWidth > tablet) ||
          (currentWidth <= tablet && currentWidth > mobile && prevWidth <= tablet && prevWidth > mobile) ||
          (currentWidth <= mobile && prevWidth <= mobile))
      )
        return;

      if (currentWidth > tablet) {
        setViewport("desktop");
      } else if (currentWidth > mobile && tablet >= currentWidth) {
        setViewport("tablet");
      } else {
        setViewport("mobile");
      }
      prevWidth = currentWidth;
    };
    window.addEventListener("resize", handleVPTrack);
    window.dispatchEvent(new Event("resize"));
    return () => {
      window.removeEventListener("resize", handleVPTrack);
    };
  }, []);

  return viewport;
};
