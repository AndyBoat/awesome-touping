import { useState, useRef, useEffect } from "react";
import useAirplayDetect from "./hooks/useAirplayDetect";
import "./App.css";
import useSafariCheck from "./hooks/useSafariCheck";

function App() {
  const isSafari = useSafariCheck();
  const isAirplayAvailable = useAirplayDetect();
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerAirplay = () => {
    (videoRef.current as any).webkitShowPlaybackTargetPicker &&
      (videoRef.current as any).webkitShowPlaybackTargetPicker();
  };

  return (
    <div className="App">
      <h2>Welcome to use Awesome Touping !</h2>
      {!isSafari && (
        <p>
          😭 You are not using Safari, please open me in Safari, or you can't
          Airplay this video!
        </p>
      )}
      <div className="video-container">
        <video controls muted autoPlay src={"/awesome.mp4"} ref={videoRef} />
      </div>
      {!isAirplayAvailable && <p>😫 No Airplay Device Detected! Check if your smart TV is working! 🏄</p>}
      {isAirplayAvailable && (
        <>
          <p></p>
          <p>
            🎉 Congratulations! Now You can
            <button onClick={() => triggerAirplay()}>Trigger Airplay</button> or
            use the entry in video controls above 👆
          </p>
        </>
      )}
      <p>
        🐛 issue report:
        <a href="https://github.com/AndyBoat/awesome-touping" target="_blank">
          {" Awesome Touping"}
        </a>
      </p>
    </div>
  );
}

export default App;
