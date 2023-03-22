import { useMemo } from "react";

const useSafariCheck = () => {
  const isSafari = useMemo(
    () => "WebKitPlaybackTargetAvailabilityEvent" in window,
    []
  );
  return isSafari;
};

export default useSafariCheck;
