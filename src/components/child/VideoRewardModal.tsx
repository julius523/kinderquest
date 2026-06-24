import { useEffect, useState } from "react";
import { fetchApprovedVideos } from "../../services/youtubeService";
import { speak } from "../../services/textToSpeechService";
import { BigButton } from "./BigButton";
import type { YouTubeVideoResult } from "../../types/youtube";
import type { SkillName } from "../../types/game";

type VideoRewardModalProps = {
  skill: SkillName;
  onClose: () => void;
};

/** Parent-controlled video break. Only ever shown when the parent has
 * enabled YouTube in Settings, and only ever lists videos already
 * filtered to approved channels by fetchApprovedVideos. There is no
 * search box here — the child can only pick from this list. */
export function VideoRewardModal({ skill, onClose }: VideoRewardModalProps) {
  const [videos, setVideos] = useState<YouTubeVideoResult[]>([]);
  const [selected, setSelected] = useState<YouTubeVideoResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    speak("Pick a video to watch.");
    fetchApprovedVideos(skill).then((results) => {
      setVideos(results);
      setLoading(false);
    });
  }, [skill]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-3xl bg-white p-6">
        {selected ? (
          <>
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${selected.videoId}?autoplay=1`}
                title={selected.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <BigButton label="Back" variant="secondary" onClick={() => setSelected(null)} />
          </>
        ) : loading ? (
          <p className="text-center text-slate-400">Loading videos…</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-slate-400">
            No approved videos yet. Ask a grown-up to add some in Settings.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {videos.map((video) => (
              <button
                key={video.videoId}
                type="button"
                onMouseEnter={() => speak(video.title)}
                onFocus={() => speak(video.title)}
                onClick={() => {
                  speak(video.title);
                  setSelected(video);
                }}
                className="flex flex-col gap-1 rounded-2xl border border-slate-200 p-2 text-left"
              >
                {video.thumbnailUrl && (
                  <img src={video.thumbnailUrl} alt="" className="rounded-xl" />
                )}
                <span className="text-sm font-semibold text-slate-700">{video.title}</span>
              </button>
            ))}
          </div>
        )}

        <BigButton label="Close" variant="primary" onClick={onClose} />
      </div>
    </div>
  );
}
