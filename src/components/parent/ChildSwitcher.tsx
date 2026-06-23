import type { ChildProfile } from "../../types/child";

type ChildSwitcherProps = {
  profiles: ChildProfile[];
  activeProfileId?: number;
  onSelect: (profileId: number) => void;
};

/** Only rendered when there's more than one child profile — lets a
 * parent pick whose data the dashboard/printables/exports show. */
export function ChildSwitcher({ profiles, activeProfileId, onSelect }: ChildSwitcherProps) {
  if (profiles.length <= 1) return null;

  return (
    <select
      value={activeProfileId ?? ""}
      onChange={(event) => onSelect(Number(event.target.value))}
      className="mb-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
    >
      {profiles.map((profile) => (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      ))}
    </select>
  );
}
