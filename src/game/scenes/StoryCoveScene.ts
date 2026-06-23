import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { createBigButton } from "../systems/uiFactory";
import { finishActivity } from "../../services/activityEngine";
import { STORIES, type Story } from "../../data/stories";
import { getActivityById } from "../../data/activityLibrary";

export class StoryCoveScene extends Phaser.Scene {
  private story!: Story;
  private pageIndex = 0;

  constructor() {
    super("StoryCoveScene");
  }

  create(data: { story?: Story }): void {
    this.story = data.story ?? STORIES[Math.floor(Math.random() * STORIES.length)];
    this.pageIndex = 0;
    this.cameras.main.setBackgroundColor("#f0f9ff");
    this.showPage();
  }

  private showPage(): void {
    this.children.removeAll();
    this.cameras.main.setBackgroundColor("#f0f9ff");

    const { width, height } = this.scale;
    const page = this.story.pages[this.pageIndex];

    this.add
      .text(width / 2, height * 0.06, this.story.title, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#0c4a6e",
      })
      .setOrigin(0.5);

    const illustration = this.add.circle(width / 2, height * 0.32, 70, 0xbae6fd);
    illustration.setStrokeStyle(4, 0x0284c7);
    this.add.image(width / 2, height * 0.32, "tex_star").setScale(1.6).setTint(0x0284c7);

    this.add
      .text(width / 2, height * 0.52, page.text, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "24px",
        color: "#0c4a6e",
        align: "center",
        wordWrap: { width: width * 0.8 },
      })
      .setOrigin(0.5);

    speak(page.text);

    if (page.question) {
      this.showQuestion();
    } else {
      createBigButton(this, width / 2, height * 0.85, "Next", () => this.advance(), {
        color: 0x0284c7,
      });
    }
  }

  private showQuestion(): void {
    const { width, height } = this.scale;
    const question = this.story.pages[this.pageIndex].question!;

    speak(question.spokenPrompt);
    const spacing = width / (question.choices.length + 1);

    question.choices.forEach((choice, index) => {
      createBigButton(
        this,
        spacing * (index + 1),
        height * 0.85,
        choice,
        () => {
          speak(choice);
          this.advance();
        },
        { width: Math.min(180, spacing - 16), height: 76, color: 0x0ea5e9, fontSize: "18px" },
      );
    });
  }

  private advance(): void {
    this.pageIndex += 1;
    if (this.pageIndex >= this.story.pages.length) {
      void this.complete();
      return;
    }
    this.showPage();
  }

  private async complete(): Promise<void> {
    const childProfileId = this.registry.get("childProfileId") as number;
    const sessionId = this.registry.get("sessionId") as number;

    const fallbackActivity = getActivityById("story_super_racer_break")!;
    const { reward } = await finishActivity({
      childProfileId,
      sessionId,
      activity: { ...fallbackActivity, skill: "story_time", id: `story_${this.story.id}` },
      attempts: 1,
      correctAttempts: 1,
      promptLevelUsed: "independent",
      responseMode: "tap",
    });

    this.scene.start("RewardRaceScene", { reward });
  }
}
