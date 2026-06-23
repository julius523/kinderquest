import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { popIn } from "./feedback";

export type BigButtonOptions = {
  width?: number;
  height?: number;
  color?: number;
  spokenText?: string;
  fontSize?: string;
  entranceDelay?: number;
};

/**
 * A large, read-aloud, touch-friendly button native to the Phaser canvas.
 * Speaks its label on hover/tap, animates on press, pops in on creation,
 * and never penalizes the child for tapping — there is no "wrong" state
 * at the button level.
 */
export function createBigButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onTap: () => void,
  options: BigButtonOptions = {},
): Phaser.GameObjects.Container {
  const width = options.width ?? 260;
  const height = options.height ?? 90;
  const color = options.color ?? 0xff5a36;
  const spokenText = options.spokenText ?? label;

  const container = scene.add.container(x, y);

  const bg = scene.add.graphics();
  bg.fillStyle(color, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, 24);
  bg.lineStyle(4, 0xffffff, 1);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 24);
  bg.setInteractive(
    new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
    Phaser.Geom.Rectangle.Contains,
  );

  const text = scene.add
    .text(0, 0, label, {
      fontFamily: "system-ui, sans-serif",
      fontSize: options.fontSize ?? "28px",
      fontStyle: "bold",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: width - 20 },
    })
    .setOrigin(0.5);

  container.add([bg, text]);
  popIn(scene, container, options.entranceDelay ?? 0);

  const announce = () => speak(spokenText);

  bg.on("pointerover", announce);
  bg.on("pointerdown", () => {
    announce();
    scene.tweens.add({ targets: container, scale: 0.92, duration: 80, yoyo: true });
    onTap();
  });

  return container;
}
