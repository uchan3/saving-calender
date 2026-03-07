import React from "react";
import { render, screen } from "@testing-library/react-native";
import HomeScreen from "../../app/index";

describe("HomeScreen", () => {
  it("renders the app title", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Saving Calender")).toBeTruthy();
  });
});
