import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import RakutenSearchResultItem from "../../components/RakutenSearchResultItem";
import { RakutenSearchResult } from "../../types/rakuten";

describe("RakutenSearchResultItem", () => {
  const mockItem: RakutenSearchResult = {
    itemName: "Wireless Headphones",
    itemPrice: 5000,
    mediumImageUrl: "https://example.com/img.jpg",
    mediumImageUrls: ["https://example.com/img.jpg"],
    itemUrl: "https://example.com/item",
    shopName: "Audio Shop",
    itemCode: "item-001",
    itemCaption: "Great headphones",
    catchcopy: "Best seller",
    reviewCount: 100,
    reviewAverage: 4.5,
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders item name", () => {
    render(<RakutenSearchResultItem item={mockItem} onSelect={mockOnSelect} />);
    expect(screen.getByText("Wireless Headphones")).toBeTruthy();
  });

  it("renders shop name", () => {
    render(<RakutenSearchResultItem item={mockItem} onSelect={mockOnSelect} />);
    expect(screen.getByText("Audio Shop")).toBeTruthy();
  });

  it("renders formatted price", () => {
    render(<RakutenSearchResultItem item={mockItem} onSelect={mockOnSelect} />);
    expect(screen.getByText("\u00A55,000")).toBeTruthy();
  });

  it("renders image when mediumImageUrl is provided", () => {
    render(<RakutenSearchResultItem item={mockItem} onSelect={mockOnSelect} />);
    expect(screen.getByTestId("rakuten-image-item-001")).toBeTruthy();
  });

  it("renders placeholder when mediumImageUrl is null", () => {
    const itemWithoutImage = { ...mockItem, mediumImageUrl: null };
    render(<RakutenSearchResultItem item={itemWithoutImage} onSelect={mockOnSelect} />);
    expect(screen.getByText("No Image")).toBeTruthy();
  });

  it("calls onSelect with the item when pressed", () => {
    render(<RakutenSearchResultItem item={mockItem} onSelect={mockOnSelect} />);
    fireEvent.press(screen.getByTestId("rakuten-item-item-001"));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockItem);
  });
});
