import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { finishActivity } from "../../services/activityEngine";
import { FAMILY_MEMBERS, getFamilyMember, type FamilyMember } from "../../data/familyMembers";
import { getActivityById } from "../../data/activityLibrary";

export class FriendshipTrackScene extends Phaser.Scene {
  private partner!: FamilyMember;

  constructor() {
    super("FriendshipTrackScene");
  }

  create(data: { partnerId?: string }): void {
    this.partner =
      getFamilyMember(data.partnerId ?? "") ??
      FAMILY_MEMBERS[Math.floor(Math.random() * FAMILY_MEMBERS.length)];
    this.cameras.main.setBackgroundColor("#fdf2f8");
    this.showPartnerTurn();
  }

  private showPartnerTurn(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.18, "Your Turn", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#9d174d",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.3, this.partner.displayName, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "32px",
        fontStyle: "bold",
        color: "#831843",
      })
      .setOrigin(0.5);

    speak(`${this.partner.displayName}'s turn.`);

    const car = this.add.image(width / 2, height * 0.5, "tex_car_green").setScale(1.7);
    this.tweens.add({
      targets: car,
      x: width * 0.7,
      duration: 1400,
      yoyo: true,
      onComplete: () => this.time.delayedCall(300, () => this.showChildTurn()),
    });
  }

  private showChildTurn(): void {
    this.children.removeAll();
    this.cameras.main.setBackgroundColor("#fdf2f8");
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.18, "My Turn", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#9d174d",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.3, "Super Racer", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "32px",
        fontStyle: "bold",
        color: "#831843",
      })
      .setOrigin(0.5);

    speak("Now your turn. Say, my turn!");

    const car = this.add.image(width / 2, height * 0.5, "tex_car_red").setScale(1.7);

    createBigButton(
      this,
      width / 2,
      height * 0.8,
      "My turn! Go!",
      () => {
        this.tweens.add({
          targets: car,
          x: width * 0.7,
          duration: 1000,
          onComplete: () => void this.complete(),
        });
      },
      { color: 0xff5a36, width: 240 },
    );
  }

  private async complete(): Promise<void> {
    const childProfileId = this.registry.get("childProfileId") as number;
    const sessionId = this.registry.get("sessionId") as number;

    const fallbackActivity = getActivityById("turn_king")!;
    const { reward } = await finishActivity({
      childProfileId,
      sessionId,
      activity: { ...fallbackActivity, partnerId: this.partner.id },
      attempts: 1,
      correctAttempts: 1,
      promptLevelUsed: "independent",
      responseMode: "tap",
    });

    speak("Great taking turns!");
    this.scene.start("RewardRaceScene", { reward, returnScene: "WorldMapScene" });
  }
}
