import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams } from "react-router-dom";

function Meeting() {
  const { roomName } = useParams();

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 70px)",
      }}
    >
      <JitsiMeeting
        domain="lg.jdeiut.ir"
        roomName={roomName || "test-room"}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.width = "100%";
          iframeRef.style.height = "100%";
        }}
      />
    </div>
  );
}

export default Meeting;