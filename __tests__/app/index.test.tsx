import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "../../app/index";

describe("HomeScreen", () => {
  it("renders the app title", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText("Saving Calender")).toBeTruthy();
    });
  });

  it("renders the streak badge", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("streak-badge")).toBeTruthy();
    });
  });

  it("renders the add record button", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("add-record-btn")).toBeTruthy();
    });
  });
});
