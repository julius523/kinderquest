import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { getDefaultProfile } from "../../db/repositories/profileRepo";
import { startSession } from "../../db/repositories/sessionRepo";
import { detectDeviceType } from "../../utils/device";

export class WelcomeGarageScene extends Phaser.Scene {
  constructor() {
    super("WelcomeGarageScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#fff7ed");

    this.add.image(width * 0.15, height * 0.2, "tex_cloud").setTint(0xffe4d1).setScale(1.4);
    this.add.image(width * 0.85, height * 0.15, "tex_cloud").setTint(0xffe4d1).setScale(1.1);

    this.add
      .text(width / 2, height * 0.12, "Kinder Quest", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "44px",
        fontStyle: "bold",
        color: "#ff5a36",
      })
      .setOrigin(0.5);

    const superRacer = this.add.image(width * 0.35, height * 0.45, "tex_car").setScale(1.5);
    superRacer.setTint(0xff5a36);
    this.add
      .text(width * 0.35, height * 0.45 + 70, "Super Racer", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#7c2d12",
      })
      .setOrigin(0.5);

    const captainTurbo = this.add.image(width * 0.65, height * 0.45, "tex_car").setScale(1.2);
    captainTurbo.setTint(0xd32f2f);
    this.add
      .text(width * 0.65, height * 0.45 + 70, "Captain Turbo", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#7c2d12",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [superRacer, captainTurbo],
      y: "+=10",
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add
      .text(width / 2, height * 0.65, "You are Super Racer!", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "22px",
        color: "#334155",
      })
      .setOrigin(0.5);

    speak("Welcome to Kinder Quest. You are Super Racer!");

    createBigButton(this, width / 2, height * 0.8, "Start Mission", () => {
      void this.startMission();
    });

    createBigButton(
      this,
      width / 2,
      height * 0.91,
      "Two Player",
      () => {
        void this.startMission("two_player");
      },
      { color: 0x3bb2ff, width: 220, height: 64, fontSize: "22px" },
    );
  }

  private async startMission(mode: "solo" | "two_player" = "solo"): Promise<void> {
    const profile = await getDefaultProfile();
    if (!profile?.id) return;

    const session = await startSession(profile.id, detectDeviceType());
    this.registry.set("childProfileId", profile.id);
    this.registry.set("sessionId", session.id);
    this.registry.set("sessionMode", mode);

    this.scene.start("WorldMapScene");
  }
}
