import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "../../app/(tabs)/index";

describe("HomeScreen", () => {
  it("renders the streak hero", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("streak-hero")).toBeTruthy();
    });
  });

  it("renders today's net section", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("today-net")).toBeTruthy();
    });
  });

  it("renders the quick record grid", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("quick-record-grid")).toBeTruthy();
    });
  });

  it("renders the more button for custom records", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("quick-more")).toBeTruthy();
    });
  });
});
