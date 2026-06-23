import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createGameConfig } from "./gameConfig";

type PhaserGameProps = {
  onExitToHome: () => void;
};

/** Mounts the Phaser game canvas into the React tree once, and tears it down
 * cleanly on unmount. Scenes reach back into React via the game registry. */
export function PhaserGame({ onExitToHome }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const game = new Phaser.Game(createGameConfig(containerRef.current));
    game.registry.set("onExitToHome", onExitToHome);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gameRef.current?.registry.set("onExitToHome", onExitToHome);
  }, [onExitToHome]);

  return <div ref={containerRef} className="h-screen w-screen overflow-hidden bg-white" />;
}
