import { useNavigate } from "react-router-dom";
import { ROUTES } from "../app/constants";
import { ReadAloudText } from "../components/audio/ReadAloudText";
import { SpeakButton } from "../components/audio/SpeakButton";

export default function ChildHomePage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 text-center">
      <h1 className="text-4xl font-extrabold text-orange-500 sm:text-5xl">Kinder Quest</h1>
      <ReadAloudText
        as="p"
        className="text-xl text-slate-600"
        text="Welcome to Kinder Quest. You are Super Racer!"
        showRepeatButton={false}
      />
      <SpeakButton
        speakText="Play"
        onClick={() => navigate(ROUTES.play)}
        className="rounded-3xl bg-orange-500 px-12 py-6 text-3xl font-bold text-white shadow-lg active:scale-95"
      >
        Play
      </SpeakButton>
      <SpeakButton
        speakText="Parent and Teacher"
        onClick={() => navigate(ROUTES.parentGate)}
        className="text-sm text-slate-400 underline"
      >
        Parent &amp; Teacher
      </SpeakButton>
    </main>
  );
}
