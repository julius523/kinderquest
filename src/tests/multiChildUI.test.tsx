import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfilePicker } from "../components/child/ProfilePicker";
import { ChildSwitcher } from "../components/parent/ChildSwitcher";
import { EngagementTrendChart } from "../components/parent/EngagementTrendChart";
import { createDefaultChildProfile } from "../types/child";
import { createEmptySession } from "../types/activity";

function profile(name: string, id: number) {
  return { ...createDefaultChildProfile(name, 5), id };
}

describe("ProfilePicker", () => {
  it("renders one avatar per profile and reports the tapped profile's id", () => {
    const onSelect = vi.fn();
    render(<ProfilePicker profiles={[profile("King", 1), profile("Londyn", 2)]} onSelect={onSelect} />);

    expect(screen.getByText("King")).toBeInTheDocument();
    expect(screen.getByText("Londyn")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Londyn").closest("button")!);
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});

describe("ChildSwitcher", () => {
  it("renders nothing for a single-child family", () => {
    const { container } = render(
      <ChildSwitcher profiles={[profile("King", 1)]} activeProfileId={1} onSelect={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a selectable option per profile when there is more than one", () => {
    const onSelect = vi.fn();
    render(
      <ChildSwitcher
        profiles={[profile("King", 1), profile("Londyn", 2)]}
        activeProfileId={1}
        onSelect={onSelect}
      />,
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});

describe("EngagementTrendChart", () => {
  it("asks for more data when fewer than two sessions exist", () => {
    render(<EngagementTrendChart sessions={[]} />);
    expect(screen.getByText(/at least two sessions/i)).toBeInTheDocument();
  });

  it("reports an upward trend when engagement improved across sessions", () => {
    const older = { ...createEmptySession(1, "laptop"), startedAt: 1000, engagementScore: 40 };
    const newer = { ...createEmptySession(1, "laptop"), startedAt: 2000, engagementScore: 70 };

    render(<EngagementTrendChart sessions={[older, newer]} />);
    expect(screen.getByText(/trending up/i)).toBeInTheDocument();
    expect(screen.getByText(/40.*70/)).toBeInTheDocument();
  });

  it("reports a downward trend when engagement dropped across sessions", () => {
    const older = { ...createEmptySession(1, "laptop"), startedAt: 1000, engagementScore: 80 };
    const newer = { ...createEmptySession(1, "laptop"), startedAt: 2000, engagementScore: 50 };

    render(<EngagementTrendChart sessions={[older, newer]} />);
    expect(screen.getByText(/trending down/i)).toBeInTheDocument();
  });
});
