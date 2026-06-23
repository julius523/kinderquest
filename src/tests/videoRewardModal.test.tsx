import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { VideoRewardModal } from "../components/child/VideoRewardModal";
import * as youtubeService from "../services/youtubeService";

describe("VideoRewardModal", () => {
  it("shows a friendly message and no search box when there are no approved videos", async () => {
    vi.spyOn(youtubeService, "fetchApprovedVideos").mockResolvedValue([]);

    render(<VideoRewardModal skill="letters" onClose={() => {}} />);

    await waitFor(() => expect(screen.getByText(/no approved videos yet/i)).toBeInTheDocument());
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("only lets the child pick from the approved list — tapping a video opens the embed, not a search", async () => {
    vi.spyOn(youtubeService, "fetchApprovedVideos").mockResolvedValue([
      { videoId: "abc123", channelId: "UCxyz", title: "Letter Sounds Song", thumbnailUrl: "" },
    ]);

    render(<VideoRewardModal skill="letters" onClose={() => {}} />);

    const videoButton = await screen.findByText("Letter Sounds Song");
    fireEvent.click(videoButton);

    const iframe = await screen.findByTitle("Letter Sounds Song");
    expect(iframe).toHaveAttribute("src", expect.stringContaining("youtube.com/embed/abc123"));
  });

  it("calls onClose when Close is tapped", async () => {
    vi.spyOn(youtubeService, "fetchApprovedVideos").mockResolvedValue([]);
    const onClose = vi.fn();

    render(<VideoRewardModal skill="letters" onClose={onClose} />);
    await waitFor(() => expect(screen.getByText(/no approved videos yet/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
