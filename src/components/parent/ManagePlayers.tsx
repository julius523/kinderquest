import { useState } from "react";
import type { ChildProfile } from "../../types/child";

type ManagePlayersProps = {
  profiles: ChildProfile[];
  onAddProfile: (name: string, ageYears: number) => Promise<unknown>;
};

export function ManagePlayers({ profiles, onAddProfile }: ManagePlayersProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("4");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    await onAddProfile(trimmed, Number(age) || 5);
    setSaving(false);
    setName("");
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow">
      <h2 className="font-semibold text-slate-700">Players</h2>

      <ul className="flex flex-col gap-1">
        {profiles.map((profile) => (
          <li key={profile.id} className="text-sm text-slate-600">
            {profile.name} · age {profile.ageYears}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-xs font-semibold text-slate-500">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Child's name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs font-semibold text-slate-500">
          Age
          <input
            type="number"
            min={2}
            max={8}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !name.trim()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Add Player
        </button>
      </div>
    </div>
  );
}
