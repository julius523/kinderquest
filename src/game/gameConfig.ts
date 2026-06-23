import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { WelcomeGarageScene } from "./scenes/WelcomeGarageScene";
import { WorldMapScene } from "./scenes/WorldMapScene";
import { LetterLagoonScene } from "./scenes/LetterLagoonScene";
import { NumberSpeedwayScene } from "./scenes/NumberSpeedwayScene";
import { ShapeHarborScene } from "./scenes/ShapeHarborScene";
import { ColorCityScene } from "./scenes/ColorCityScene";
import { ListeningLaneScene } from "./scenes/ListeningLaneScene";
import { DrawingDockScene } from "./scenes/DrawingDockScene";
import { RewardRaceScene } from "./scenes/RewardRaceScene";

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#ffffff",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: parent.clientWidth || window.innerWidth,
      height: parent.clientHeight || window.innerHeight,
    },
    scene: [
      BootScene,
      PreloadScene,
      WelcomeGarageScene,
      WorldMapScene,
      LetterLagoonScene,
      NumberSpeedwayScene,
      ShapeHarborScene,
      ColorCityScene,
      ListeningLaneScene,
      DrawingDockScene,
      RewardRaceScene,
    ],
  };
}
