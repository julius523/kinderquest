import type Phaser from "phaser";
import { prefersReducedMotion } from "./motionPreference";

/** Scale-in entrance with a slight overshoot — used so new buttons/objects
 * feel like they're "popping" onto the screen instead of just appearing. */
export function popIn(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject,
  delay = 0,
  finalScale = 1,
): void {
  const obj = target as unknown as { setScale: (s: number) => void };
  if (prefersReducedMotion()) {
    obj.setScale(finalScale);
    return;
  }

  obj.setScale(0);
  scene.tweens.add({
    targets: target,
    scale: finalScale,
    delay,
    duration: 350,
    ease: "Back.easeOut",
  });
}

/** A quick side-to-side shake — used for a wrong-answer tap. Never red or
 * harsh; just a gentle "try again" wobble, paired with the prompt speech. */
export function shake(scene: Phaser.Scene, target: Phaser.GameObjects.GameObject): void {
  if (prefersReducedMotion()) return;

  const obj = target as unknown as { x: number };
  const originalX = obj.x;

  scene.tweens.add({
    targets: target,
    x: { from: originalX - 10, to: originalX + 10 },
    duration: 60,
    yoyo: true,
    repeat: 3,
    onComplete: () => {
      obj.x = originalX;
    },
  });
}

/** A happy bounce/pulse — used the moment a correct answer is tapped,
 * before the scene transitions away to the reward. */
export function celebrate(scene: Phaser.Scene, target: Phaser.GameObjects.GameObject): void {
  if (prefersReducedMotion()) return;

  scene.tweens.add({
    targets: target,
    scale: 1.25,
    duration: 160,
    yoyo: true,
    ease: "Sine.easeOut",
  });
}
