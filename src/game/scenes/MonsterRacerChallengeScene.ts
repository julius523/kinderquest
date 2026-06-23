import Phaser from "phaser";
import { speak } from "../../services/textToSpeechService";
import { runChoiceActivity } from "../systems/runChoiceActivity";
import { pickRandomActivity } from "../../data/activityLibrary";
import { prefersReducedMotion } from "../systems/motionPreference";
import type { SkillName } from "../../types/game";

const REVIEW_SKILLS: SkillName[] = ["letters", "counting", "shapes", "colors"];

/** Monster Racer mixed up the track — a silly review challenge pulled from
 * a skill the child has already practiced. Monster Racer is always goofy,
 * never scary, and the child is always the one helping. */
export class MonsterRacerChallengeScene extends Phaser.Scene {
  constructor() {
    super("MonsterRacerChallengeScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#fef3c7");
    const { width, height } = this.scale;

    const skill = REVIEW_SKILLS[Math.floor(Math.random() * REVIEW_SKILLS.length)];
    const activity = pickRandomActivity(skill);

    if (!activity) {
      speak("Monster Racer will be back soon!");
      return;
    }

    speak("Monster Racer mixed up the track. Can you help?");

    const monster = this.add.image(width * 0.85, height * 0.85, "tex_car").setScale(1.6).setTint(0x854d0e);
    if (!prefersReducedMotion()) {
      this.tweens.add({ targets: monster, angle: { from: -6, to: 6 }, yoyo: true, repeat: -1, duration: 400 });
    }

    runChoiceActivity(this, activity, [0xf59e0b, 0xd97706, 0xb45309], {
      onCorrect: () => {
        speak("You helped Monster Racer learn!");
        this.tweens.add({
          targets: monster,
          y: monster.y - 30,
          duration: 250,
          yoyo: true,
          repeat: 3,
        });
      },
    });
  }
}
