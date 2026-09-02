import { JitsiMeeting } from "@jitsi/react-sdk";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

type MeetingConfig = {
  roomName: string;
  subject: string;
  domain: string;
  startWithAudioMuted: boolean;
  startWithVideoMuted: boolean;
};

function normalizeJitsiDomain(value: string) {
  const raw = value.trim();
  const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  return url.host;
}

function Meeting() {
  const { roomName } = useParams();
  const [config, setConfig] = useState<MeetingConfig | null>(null);
  const [error, setError] = useState("");
  const [apiReady, setApiReady] = useState(false);
  const [conferenceJoined, setConferenceJoined] = useState(false);
  const [connectionSlow, setConnectionSlow] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeetingConfig() {
      if (!roomName) {
        setError("شناسه اتاق معتبر نیست.");
        return;
      }

      try {
        const response = await api.get(
          `/meetings/${encodeURIComponent(roomName)}/config`,
          { signal: controller.signal }
        );
        const meetingConfig = response.data.data as MeetingConfig;

        setConfig({
          ...meetingConfig,
          domain: normalizeJitsiDomain(meetingConfig.domain),
        });
      } catch {
        if (!controller.signal.aborted) {
          setError("دریافت تنظیمات یا آدرس زیرساخت جلسه ناموفق بود.");
        }
      }
    }

    loadMeetingConfig();
    return () => controller.abort();
  }, [roomName]);

  useEffect(() => {
    if (!config || apiReady) return;

    const timeout = window.setTimeout(() => {
      setConnectionSlow(true);
    }, 20000);

    return () => window.clearTimeout(timeout);
  }, [config, apiReady]);

  const configOverwrite = useMemo(
    () =>
      config
        ? {
            subject: config.subject,
            startWithAudioMuted: config.startWithAudioMuted,
            startWithVideoMuted: config.startWithVideoMuted,
          }
        : {},
    [config]
  );

  if (error) {
    return (
      <main
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#dc2626",
          background: "#0f172a",
        }}
      >
        {error}
      </main>
    );
  }

  if (!config) {
    return (
      <main
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#e2e8f0",
          background: "#0f172a",
        }}
      >
        در حال دریافت تنظیمات جلسه...
      </main>
    );
  }

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#0f172a",
        zIndex: 1300,
      }}
    >
      {!conferenceJoined && (
        <div
          role="status"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            padding: "8px 12px",
            borderRadius: 8,
            color: connectionSlow ? "#fef3c7" : "#e2e8f0",
            background: "rgba(15, 23, 42, 0.86)",
          }}
        >
          {connectionSlow
            ? "اتصال طولانی شده است؛ دسترسی شبکه یا سرویس Meeting را بررسی کنید."
            : apiReady
              ? "در حال ورود به اتاق..."
              : "در حال اتصال به زیرساخت جلسه..."}
        </div>
      )}

      <JitsiMeeting
        domain={config.domain}
        roomName={config.roomName}
        configOverwrite={configOverwrite}
        onApiReady={(externalApi) => {
          setApiReady(true);
          setConnectionSlow(false);

          const iframe = externalApi.getIFrame() as HTMLIFrameElement;
          iframe.allow =
            "camera; microphone; display-capture; fullscreen; autoplay";
          iframe.setAttribute("allowfullscreen", "true");

          externalApi.on("videoConferenceJoined", () => {
            setConferenceJoined(true);
          });
          externalApi.on("errorOccurred", () => {
            setConnectionSlow(true);
          });
        }}
        getIFrameRef={(parentNode) => {
          parentNode.style.width = "100%";
          parentNode.style.height = "100%";
        }}
      />
    </main>
  );
}

export default Meeting;