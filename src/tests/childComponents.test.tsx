import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommunicationBoard } from "../components/child/CommunicationBoard";
import { FirstThenBoard } from "../components/child/FirstThenBoard";
import { VisualSchedule } from "../components/child/VisualSchedule";
import { CalmChoiceBoard } from "../components/child/CalmChoiceBoard";
import { RewardUnlockModal } from "../components/child/RewardUnlockModal";
import { COMMUNICATION_PHRASES } from "../data/communicationPhrases";
import { DEFAULT_SESSION_SCHEDULE } from "../data/visualSchedules";
import * as tts from "../services/textToSpeechService";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CommunicationBoard", () => {
  it("renders every required AAC phrase", () => {
    render(<CommunicationBoard onSelect={() => {}} />);
    for (const phrase of COMMUNICATION_PHRASES) {
      expect(screen.getByText(phrase.text)).toBeInTheDocument();
    }
  });

  it("speaks and reports the tapped phrase", () => {
    const speakSpy = vi.spyOn(tts, "speak");
    const onSelect = vi.fn();
    render(<CommunicationBoard onSelect={onSelect} />);

    fireEvent.click(screen.getByText("help please"));

    expect(speakSpy).toHaveBeenCalledWith("help please");
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "help_please" }));
  });
});

describe("FirstThenBoard", () => {
  it("reads First/Then text correctly on mount", () => {
    const speakSpy = vi.spyOn(tts, "speak");
    render(
      <FirstThenBoard
        first={{ icon: "pencil", text: "Trace 3 lines" }}
        then={{ icon: "car", text: "Race Super Racer" }}
      />,
    );
    expect(speakSpy.mock.calls[0][0]).toBe("First, Trace 3 lines. Then, Race Super Racer.");
    expect(screen.getByText("Trace 3 lines")).toBeInTheDocument();
    expect(screen.getByText("Race Super Racer")).toBeInTheDocument();
  });
});

describe("VisualSchedule", () => {
  it("marks completed items and highlights the current item", () => {
    render(
      <VisualSchedule
        items={DEFAULT_SESSION_SCHEDULE}
        currentItemId="game_1"
        completedIds={["hello", "first_mission"]}
      />,
    );
    const current = screen.getByRole("button", { current: true });
    expect(current).toHaveTextContent("Game");

    const completed = screen.getByText("Hello").closest("button");
    expect(completed?.querySelector("svg")).toBeInTheDocument();
  });
});

describe("CalmChoiceBoard", () => {
  it("walks through choose-strategy then ready/more-break flow", () => {
    const onComplete = vi.fn();
    render(<CalmChoiceBoard onComplete={onComplete} />);

    fireEvent.click(screen.getByText("Jump 5 times"));
    expect(screen.getByText("I'm ready")).toBeInTheDocument();

    fireEvent.click(screen.getByText("I'm ready"));
    expect(onComplete).toHaveBeenCalledWith("ready", "jump_5");
  });
});

describe("RewardUnlockModal", () => {
  it("displays the reward name and specific praise text", () => {
    render(
      <RewardUnlockModal
        reward={{
          id: "red_rocket_car",
          name: "Red Rocket Car",
          category: "car",
          rarity: "common",
          unlockSkill: "letters",
          praiseText: "You found the letter. You unlocked the Red Rocket Car!",
        }}
        onContinue={() => {}}
      />,
    );
    expect(screen.getByText("Red Rocket Car")).toBeInTheDocument();
    expect(
      screen.getByText("You found the letter. You unlocked the Red Rocket Car!"),
    ).toBeInTheDocument();
  });
});
