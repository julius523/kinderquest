import { ParentLayout } from "../components/parent/ParentLayout";
import { VolumeControls } from "../components/audio/VolumeControls";

export default function ParentSettingsPage() {
  return (
    <ParentLayout>
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Settings</h1>
        <VolumeControls />
      </div>
    </ParentLayout>
  );
}
