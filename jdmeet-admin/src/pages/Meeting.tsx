import { JitsiMeeting } from "@jitsi/react-sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

type MeetingConfig = {
  roomName: string;
  subject: string;
  domain: string;
  startWithAudioMuted: boolean;
  startWithVideoMuted: boolean;
};

function Meeting() {
  const { roomName } = useParams();
  const [config, setConfig] = useState<MeetingConfig | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeetingConfig() {
      if (!roomName) {
        setError("شناسه اتاق معتبر نیست.");
        return;
      }

      try {
        const response = await api.get(
          `/meetings/${encodeURIComponent(roomName)}/config`
        );
        setConfig(response.data.data);
      } catch {
        setError("دریافت تنظیمات جلسه ناموفق بود.");
      }
    }

    loadMeetingConfig();
  }, [roomName]);

  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
  if (!config) return <p>در حال آماده‌سازی جلسه...</p>;

  return (
    <div style={{ width: "100%", height: "calc(100vh - 70px)" }}>
      <JitsiMeeting
        domain={config.domain}
        roomName={config.roomName}
        configOverwrite={{
          subject: config.subject,
          startWithAudioMuted: config.startWithAudioMuted,
          startWithVideoMuted: config.startWithVideoMuted,
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.width = "100%";
          iframeRef.style.height = "100%";
        }}
      />
    </div>
  );
}

export default Meeting;