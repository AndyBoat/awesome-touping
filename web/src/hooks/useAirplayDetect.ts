import { useEffect, useMemo, useRef, useState } from "react";

const useAirplayDetect = () => {
  const littleVideo = useRef<HTMLVideoElement>(
    document.createElement("video")
  ).current;

  const [isAirplayDeviceDetect, setIsAirplayDeviceDetect] = useState(false);

  useEffect(() => {
    littleVideo.addEventListener(
      "webkitplaybacktargetavailabilitychanged",
      function (event) {
        console.info("event triggered!: ", event);
        switch ((event as any).availability) {
          case "available":
            setIsAirplayDeviceDetect(true);
            break;
          case "not-available":
            setIsAirplayDeviceDetect(false);
            break;
        }
      }
    );
  }, []);

  return isAirplayDeviceDetect;
};

export default useAirplayDetect;
