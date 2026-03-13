import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { AuthProvider } from "../../contexts/AuthContext";
import { RecordsProvider } from "../../contexts/RecordsContext";
import HomeScreen from "../../app/(tabs)/index";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AuthProvider>
      <RecordsProvider>{ui}</RecordsProvider>
    </AuthProvider>,
  );
}

describe("HomeScreen", () => {
  it("renders the streak hero", async () => {
    renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("streak-hero")).toBeTruthy();
    });
  });

  it("renders today's net section", async () => {
    renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("today-net")).toBeTruthy();
    });
  });

  it("renders the quick record grid", async () => {
    renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("quick-record-grid")).toBeTruthy();
    });
  });

  it("renders the more button for custom records", async () => {
    renderWithProviders(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("quick-more")).toBeTruthy();
    });
  });
});
