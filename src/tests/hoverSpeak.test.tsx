import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpeakButton } from "../components/audio/SpeakButton";
import { BigButton } from "../components/child/BigButton";
import { CommunicationBoard } from "../components/child/CommunicationBoard";
import * as tts from "../services/textToSpeechService";

describe("hover-to-speak", () => {
  it("SpeakButton speaks on mouse hover, not just click", () => {
    const speakSpy = vi.spyOn(tts, "speak");
    render(
      <SpeakButton speakText="Play" onClick={() => {}}>
        Play
      </SpeakButton>,
    );

    fireEvent.mouseEnter(screen.getByText("Play"));
    expect(speakSpy).toHaveBeenCalledWith("Play");
  });

  it("BigButton speaks on mouse hover, not just click", () => {
    const speakSpy = vi.spyOn(tts, "speak");
    render(<BigButton label="Start Mission" onClick={() => {}} />);

    fireEvent.mouseEnter(screen.getByText("Start Mission"));
    expect(speakSpy).toHaveBeenCalledWith("Start Mission");
  });

  it("CommunicationBoard phrases speak on hover", () => {
    const speakSpy = vi.spyOn(tts, "speak");
    render(<CommunicationBoard onSelect={() => {}} />);

    fireEvent.mouseEnter(screen.getByText("help please"));
    expect(speakSpy).toHaveBeenCalledWith("help please");
  });
});
