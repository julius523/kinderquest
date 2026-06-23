import type { ApprovedYouTubeChannel } from "../../types/youtube";

type YouTubeChannelToggleProps = {
  channel: ApprovedYouTubeChannel;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export function YouTubeChannelToggle({ channel, enabled, onToggle }: YouTubeChannelToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow">
      <div>
        <p className="font-semibold text-slate-700">{channel.name}</p>
        <p className="text-xs text-slate-400">{channel.tags.join(", ")}</p>
      </div>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => onToggle(event.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}
