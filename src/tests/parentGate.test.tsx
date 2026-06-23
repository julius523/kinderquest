import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ParentGate } from "../components/parent/ParentGate";

describe("ParentGate", () => {
  it("does not unlock on render alone", () => {
    const onUnlock = vi.fn();
    render(<ParentGate onUnlock={onUnlock} />);
    expect(onUnlock).not.toHaveBeenCalled();
    expect(screen.getByText(/grown-ups only/i)).toBeInTheDocument();
    expect(screen.getByText(/hold the button/i)).toBeInTheDocument();
  });

  it("does not unlock from a quick tap (hold cancelled before 3s)", () => {
    const onUnlock = vi.fn();
    render(<ParentGate onUnlock={onUnlock} />);

    const button = screen.getByText("Hold").closest("button")!;
    fireEvent.pointerDown(button);
    fireEvent.pointerUp(button);

    expect(onUnlock).not.toHaveBeenCalled();
    expect(screen.queryByText(/what is/i)).not.toBeInTheDocument();
  });

  it("shows the math challenge after holding for 3 seconds, and unlocks only on the correct answer", async () => {
    const onUnlock = vi.fn();
    render(<ParentGate onUnlock={onUnlock} />);

    const button = screen.getByText("Hold").closest("button")!;
    fireEvent.pointerDown(button);

    await waitFor(() => expect(screen.getByText(/what is/i)).toBeInTheDocument(), { timeout: 4000 });

    const prompt = screen.getByText(/what is/i).textContent ?? "";
    const match = prompt.match(/(\d+)\s*\+\s*(\d+)/);
    expect(match).not.toBeNull();
    const [, a, b] = match!;
    const correctAnswer = Number(a) + Number(b);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: String(correctAnswer - 1) } });
    fireEvent.click(screen.getByText("Continue"));
    expect(onUnlock).not.toHaveBeenCalled();
    expect(screen.getByText("Try again.")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });
    // A new challenge was generated after the wrong answer — read it again.
    const newPrompt = screen.getByText(/what is/i).textContent ?? "";
    const newMatch = newPrompt.match(/(\d+)\s*\+\s*(\d+)/)!;
    const newAnswer = Number(newMatch[1]) + Number(newMatch[2]);

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: String(newAnswer) } });
    fireEvent.click(screen.getByText("Continue"));

    expect(onUnlock).toHaveBeenCalledTimes(1);
  }, 10000);
});
