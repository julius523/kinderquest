import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { routes } from "./app/routes";
import { ensureSeeded } from "./db/seed";
import { useSettingsStore } from "./state/settingsStore";
import { unlockSpeechSynthesis } from "./services/textToSpeechService";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  useEffect(() => {
    ensureSeeded();
    useSettingsStore.getState().hydrate();

    // iOS Safari (and some other browsers) require speechSynthesis to be
    // used inside a real user gesture once before it'll work from async
    // code anywhere else on the page — see unlockSpeechSynthesis().
    const unlock = () => {
      unlockSpeechSynthesis();
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
