import type { DeviceType } from "../types/game";

export function detectDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;
  if (/iPhone|Android.*Mobile/i.test(ua)) return "phone";
  if (/iPad|Android(?!.*Mobile)/i.test(ua)) return "tablet";

  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  return width <= 1366 ? "laptop" : "desktop";
}
