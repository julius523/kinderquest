import { useParams } from "react-router-dom";

export default function ParentSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-800">Session {sessionId}</h1>
      <p className="text-slate-500">Coming soon.</p>
    </main>
  );
}
