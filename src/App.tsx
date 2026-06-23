import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { routes } from "./app/routes";
import { ensureSeeded } from "./db/seed";
import { useSettingsStore } from "./state/settingsStore";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  useEffect(() => {
    ensureSeeded();
    useSettingsStore.getState().hydrate();
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
