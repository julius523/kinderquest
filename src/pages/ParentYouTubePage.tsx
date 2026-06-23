import { ParentLayout } from "../components/parent/ParentLayout";

export default function ParentYouTubePage() {
  return (
    <ParentLayout>
      <main className="p-8">
        <h1 className="text-2xl font-bold text-slate-800">YouTube Whitelist</h1>
        <p className="text-slate-500">Disabled by default. Coming soon.</p>
      </main>
    </ParentLayout>
  );
}
