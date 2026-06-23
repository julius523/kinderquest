import { useNavigate } from "react-router-dom";
import { PhaserGame } from "../game/PhaserGame";
import { ROUTES } from "../app/constants";

export default function PlayPage() {
  const navigate = useNavigate();

  return <PhaserGame onExitToHome={() => navigate(ROUTES.childHome)} />;
}
