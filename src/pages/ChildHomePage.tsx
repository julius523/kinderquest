import { Link } from "react-router-dom";
import { ROUTES } from "../app/constants";

export default function ChildHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 text-center">
      <h1 className="text-4xl font-extrabold text-orange-500 sm:text-5xl">Kinder Quest</h1>
      <p className="text-xl text-slate-600">You are Super Racer!</p>
      <Link
        to={ROUTES.play}
        className="rounded-3xl bg-orange-500 px-12 py-6 text-3xl font-bold text-white shadow-lg active:scale-95"
      >
        Play
      </Link>
      <Link to={ROUTES.parentGate} className="text-sm text-slate-400 underline">
        Parent &amp; Teacher
      </Link>
    </main>
  );
}
