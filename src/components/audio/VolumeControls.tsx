import { useSettingsStore } from "../../state/settingsStore";
import { speak } from "../../services/textToSpeechService";

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
      {label}
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}

/** Parent-only audio/accessibility settings: mute, volumes, speech rate,
 * reduced motion, and whether speech recognition / parent-confirmed speech
 * are enabled. */
export function VolumeControls() {
  const { settings, setSettings } = useSettingsStore();

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow">
      <Toggle
        label="Read words aloud"
        checked={settings.readAloudEnabled}
        onChange={(value) => setSettings({ readAloudEnabled: value })}
      />
      <Slider
        label="Voice volume"
        value={settings.voiceVolume}
        onChange={(value) => {
          setSettings({ voiceVolume: value });
          speak("This is how loud my voice will be.", { volume: value });
        }}
      />
      <Slider
        label="Music volume"
        value={settings.musicVolume}
        onChange={(value) => setSettings({ musicVolume: value })}
      />
      <Slider
        label="Sound effects volume"
        value={settings.soundEffectsVolume}
        onChange={(value) => setSettings({ soundEffectsVolume: value })}
      />
      <Slider
        label="Speech rate"
        value={settings.speechRate}
        onChange={(value) => {
          setSettings({ speechRate: value });
          speak("This is how fast I will talk.", { rate: value });
        }}
      />
      <Toggle
        label="Reduced motion"
        checked={settings.reducedMotionEnabled}
        onChange={(value) => setSettings({ reducedMotionEnabled: value })}
      />
      <Toggle
        label="Allow voice recognition"
        checked={settings.speechRecognitionEnabled}
        onChange={(value) => setSettings({ speechRecognitionEnabled: value })}
      />
      <Toggle
        label="Allow parent-confirmed speech"
        checked={settings.parentConfirmationEnabled}
        onChange={(value) => setSettings({ parentConfirmationEnabled: value })}
      />
    </div>
  );
}
