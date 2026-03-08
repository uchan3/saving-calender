import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import RecordForm from "../../components/RecordForm";

describe("RecordForm", () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders type toggle buttons", () => {
    render(<RecordForm date="2026-03-08" onSubmit={mockSubmit} onCancel={mockCancel} />);
    expect(screen.getByTestId("toggle-saving")).toBeTruthy();
    expect(screen.getByTestId("toggle-splurge")).toBeTruthy();
  });

  it("renders preset buttons", () => {
    render(<RecordForm date="2026-03-08" onSubmit={mockSubmit} onCancel={mockCancel} />);
    expect(screen.getByTestId("preset-Coffee")).toBeTruthy();
    expect(screen.getByTestId("preset-Lunch out")).toBeTruthy();
  });

  it("fills amount when a preset is selected", () => {
    render(<RecordForm date="2026-03-08" onSubmit={mockSubmit} onCancel={mockCancel} />);
    fireEvent.press(screen.getByTestId("preset-Coffee"));
    const amountInput = screen.getByTestId("amount-input");
    expect(amountInput.props.value).toBe("500");
  });

  it("submit button is disabled when form is incomplete", () => {
    render(<RecordForm date="2026-03-08" onSubmit={mockSubmit} onCancel={mockCancel} />);
    const submitBtn = screen.getByTestId("submit-btn");
    expect(submitBtn.props.accessibilityState?.disabled).toBe(true);
  });

  it("calls onCancel when cancel is pressed", () => {
    render(<RecordForm date="2026-03-08" onSubmit={mockSubmit} onCancel={mockCancel} />);
    fireEvent.press(screen.getByText("Cancel"));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
