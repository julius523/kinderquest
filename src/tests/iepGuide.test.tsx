import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { IEP_STRATEGIES, STRUGGLE_GUIDE, HOME_PRACTICE_IDEAS } from "../data/iepGuide";
import IEPGuidePage from "../pages/IEPGuidePage";

describe("IEP guide content", () => {
  it("every strategy has a why, a how, and a concrete in-app tie-in", () => {
    expect(IEP_STRATEGIES.length).toBeGreaterThanOrEqual(6);
    for (const strategy of IEP_STRATEGIES) {
      expect(strategy.why.length).toBeGreaterThan(20);
      expect(strategy.how.length).toBeGreaterThan(20);
      expect(strategy.inApp.length).toBeGreaterThan(10);
    }
  });

  it("never tells parents to use shaming language with the child (the 'inApp' tie-ins describe what the app itself does, so must stay clean)", () => {
    const bannedPatterns = [/\bbad\b/, /\bfailed\b/, /try harder/, /\bpunish/];
    const inAppText = IEP_STRATEGIES.map((s) => s.inApp).join(" ").toLowerCase();

    for (const pattern of bannedPatterns) {
      expect(pattern.test(inAppText)).toBe(false);
    }
  });

  it("the struggle guide always pairs a sign with an actionable response", () => {
    for (const row of STRUGGLE_GUIDE) {
      expect(row.sign.length).toBeGreaterThan(5);
      expect(row.tryThis.length).toBeGreaterThan(5);
    }
  });

  it("offers a real list of concrete, transferable home practice ideas", () => {
    expect(HOME_PRACTICE_IDEAS.length).toBeGreaterThanOrEqual(6);
    for (const idea of HOME_PRACTICE_IDEAS) {
      expect(idea.length).toBeGreaterThan(15);
    }
  });
});

describe("IEPGuidePage", () => {
  it("renders behind the parent gate (shows the gate, not the guide, until unlocked)", () => {
    render(
      <MemoryRouter>
        <IEPGuidePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/grown-ups only/i)).toBeInTheDocument();
    expect(screen.queryByText("Core Strategies")).not.toBeInTheDocument();
  });
});
