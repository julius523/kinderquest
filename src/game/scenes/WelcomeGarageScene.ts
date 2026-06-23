import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { getProfile } from "../../db/repositories/profileRepo";
import { startSession } from "../../db/repositories/sessionRepo";
import { detectDeviceType } from "../../utils/device";
import { prefersReducedMotion } from "../systems/motionPreference";

export class WelcomeGarageScene extends Phaser.Scene {
  constructor() {
    super("WelcomeGarageScene");
  }

  create(): void {
    const { width, height } = this.scale;
    this.drawScenery(width, height);

    this.add
      .text(width / 2, height * 0.1, "Kinder Quest", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "46px",
        fontStyle: "bold",
        color: "#ff5a36",
        stroke: "#ffffff",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const superRacer = this.add.image(width * 0.35, height * 0.46, "tex_car_red").setScale(1.3);
    this.add
      .text(width * 0.35, height * 0.46 + 78, "Super Racer", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#7c2d12",
      })
      .setOrigin(0.5);

    const captainTurbo = this.add.image(width * 0.65, height * 0.46, "tex_car_blue").setScale(1.1);
    this.add
      .text(width * 0.65, height * 0.46 + 78, "Captain Turbo", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#7c2d12",
      })
      .setOrigin(0.5);

    if (!prefersReducedMotion()) {
      this.tweens.add({
        targets: [superRacer, captainTurbo],
        y: "+=10",
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    const welcomeText = this.add
      .text(width / 2, height * 0.7, "You are Super Racer!", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#7c2d12",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    void this.speakPersonalizedWelcome(welcomeText, superRacer);

    createBigButton(this, width / 2, height * 0.83, "Start Mission", () => {
      void this.startMission();
    });

    createBigButton(
      this,
      width / 2,
      height * 0.94,
      "Two Player",
      () => {
        void this.startMission("two_player");
      },
      { color: 0x3bb2ff, width: 220, height: 60, fontSize: "20px" },
    );
  }

  private async speakPersonalizedWelcome(
    welcomeText: Phaser.GameObjects.Text,
    superRacer: Phaser.GameObjects.Image,
  ): Promise<void> {
    const activeProfileId = this.registry.get("activeProfileId") as number | undefined;
    const profile = activeProfileId ? await getProfile(activeProfileId) : undefined;
    const name = profile?.name ?? "Super Racer";

    welcomeText.setText(`Welcome, ${name}! You are Super Racer!`);
    speak(`Welcome to Kinder Quest, ${name}! You are Super Racer!`);

    if (profile && profile.avatar.unlockedSuits.length > 0) {
      const cape = this.add
        .image(superRacer.x, superRacer.y - 6, "tex_cape")
        .setTint(0x2563eb)
        .setScale(superRacer.scale * 0.9)
        .setDepth(superRacer.depth - 1);
      superRacer.setDepth(cape.depth + 1);
    }
  }

  private drawScenery(width: number, height: number): void {
    const horizonY = height * 0.82;

    const sky = this.add.graphics();
    sky.fillGradientStyle(0xffd9b8, 0xffd9b8, 0xfff7ed, 0xfff7ed, 1);
    sky.fillRect(0, 0, width, horizonY);

    const ground = this.add.graphics();
    ground.fillStyle(0x86efac, 1);
    ground.fillRect(0, horizonY, width, height - horizonY);

    this.add.image(width * 0.1, height * 0.14, "tex_sun").setScale(1.1);
    this.add.image(width * 0.85, height * 0.1, "tex_cloud").setTint(0xffe4d1).setScale(1.2);

    [0.06, 0.94].forEach((fx) => {
      this.add.image(width * fx, horizonY + 16, "tex_bush").setScale(1).setTint(0x4ade80);
    });
  }

  private async startMission(mode: "solo" | "two_player" = "solo"): Promise<void> {
    const activeProfileId = this.registry.get("activeProfileId") as number | undefined;
    if (!activeProfileId) return;

    const session = await startSession(activeProfileId, detectDeviceType());
    this.registry.set("childProfileId", activeProfileId);
    this.registry.set("sessionId", session.id);
    this.registry.set("sessionMode", mode);

    if (mode === "two_player") {
      this.scene.start("FriendshipTrackScene");
      return;
    }

    this.scene.start("WorldMapScene");
  }
}
