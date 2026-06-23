import { speak } from "../../services/textToSpeechService";
import type { ChildProfile } from "../../types/child";

const AVATAR_COLORS = ["#ff5a36", "#3bb2ff", "#34d399", "#a78bfa", "#f59e0b", "#f472b6"];

type ProfilePickerProps = {
  profiles: ChildProfile[];
  onSelect: (profileId: number) => void;
};

/** "Who's playing?" — shown on the child home screen whenever more than
 * one player profile exists, so siblings sharing a device can each tap
 * their own avatar. Hidden entirely for single-child families. */
export function ProfilePicker({ profiles, onSelect }: ProfilePickerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl font-bold text-slate-700">Who&apos;s playing?</p>
      <div className="flex flex-wrap justify-center gap-4">
        {profiles.map((profile, index) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => {
              speak(profile.name);
              onSelect(profile.id!);
            }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-extrabold text-white shadow-lg"
              style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-slate-600">{profile.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
