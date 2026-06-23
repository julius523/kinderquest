import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhaserGame } from "../game/PhaserGame";
import { VideoRewardModal } from "../components/child/VideoRewardModal";
import { useSettingsStore } from "../state/settingsStore";
import { ROUTES } from "../app/constants";

export default function PlayPage() {
  const navigate = useNavigate();
  const youtubeEnabled = useSettingsStore((state) => state.settings.youtubeEnabled);
  const [showVideoReward, setShowVideoReward] = useState(false);

  return (
    <div className="relative h-screen w-screen">
      <PhaserGame onExitToHome={() => navigate(ROUTES.childHome)} />

      {youtubeEnabled && !showVideoReward && (
        <button
          type="button"
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
