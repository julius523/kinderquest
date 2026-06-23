import { useRoutes } from "react-router-dom";
import { AppProviders } from "./app/providers";
import { routes } from "./app/routes";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
