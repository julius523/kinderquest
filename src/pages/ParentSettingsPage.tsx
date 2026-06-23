import { ParentLayout } from "../components/parent/ParentLayout";
import { VolumeControls } from "../components/audio/VolumeControls";
import { ManagePlayers } from "../components/parent/ManagePlayers";
import { useActiveProfile } from "../hooks/useActiveProfile";

export default function ParentSettingsPage() {
  const { profiles, addProfile } = useActiveProfile();

  return (
    <ParentLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <ManagePlayers profiles={profiles} onAddProfile={addProfile} />
        <VolumeControls />
      </div>
    </ParentLayout>
  );
}
