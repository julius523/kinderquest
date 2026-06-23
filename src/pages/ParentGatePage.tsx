import { Navigate } from "react-router-dom";
import { ROUTES } from "../app/constants";

/** ParentLayout gates every parent/teacher page inline, so this route just
 * forwards to the dashboard (which will show the gate itself if locked). */
export default function ParentGatePage() {
  return <Navigate to={ROUTES.parentDashboard} replace />;
}
