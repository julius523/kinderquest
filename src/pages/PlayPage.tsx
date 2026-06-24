import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhaserGame } from "../game/PhaserGame";
import { VideoRewardModal } from "../components/child/VideoRewardModal";
import { speak } from "../services/textToSpeechService";
import { useSettingsStore } from "../state/settingsStore";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { ROUTES } from "../app/constants";

export default function PlayPage() {
  const navigate = useNavigate();
  const youtubeEnabled = useSettingsStore((state) => state.settings.youtubeEnabled);
  const { profile, loading } = useActiveProfile();
  const [showVideoReward, setShowVideoReward] = useState(false);

  if (loading || !profile?.id) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-white">
        <p className="text-xl text-slate-500">Loading Super Racer&apos;s garage…</p>
      </main>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <PhaserGame onExitToHome={() => navigate(ROUTES.childHome)} activeProfileId={profile.id} />

      {youtubeEnabled && !showVideoReward && (
        <button
          type="button"
          onMouseEnter={() => speak("Watch a Video")}
          onFocus={() => speak("Watch a Video")}
          onClick={() => setShowVideoReward(true)}
          className="fixed bottom-4 left-4 z-40 rounded-full bg-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg active:scale-90"
        >
          Watch a Video
        </button>
      )}

      {showVideoReward && (
        <VideoRewardModal skill="letters" onClose={() => setShowVideoReward(false)} />
      )}
    </div>
  );
}
