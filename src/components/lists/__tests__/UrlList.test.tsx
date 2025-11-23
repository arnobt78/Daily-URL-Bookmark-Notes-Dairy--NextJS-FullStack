import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { UrlList } from "../UrlList";
import { currentList } from "@/stores/urlListStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

function renderWithProviders(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
}

describe("UrlList Component", () => {
  beforeEach(() => {
    currentList.set({
      id: "test-list",
      urls: [
        {
          id: "1",
          url: "https://example.com/1",
          title: "Example 1",
          createdAt: new Date().toISOString(),
          isFavorite: false,
        },
        {
          id: "2",
          url: "https://example.com/2",
          title: "Example 2",
          createdAt: new Date().toISOString(),
          isFavorite: false,
        },
      ],
    });
  });

  it("renders the list of URLs", () => {
    renderWithProviders(<UrlList />);

    expect(screen.getByText("Example 1")).toBeInTheDocument();
    expect(screen.getByText("Example 2")).toBeInTheDocument();
  });

  it("handles real-time updates correctly", () => {
    renderWithProviders(<UrlList />);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("list-updated", {
          detail: {
            listId: "test-list",
            action: "list_updated",
          },
        })
      );
    });

    // Add assertions to verify the component's behavior after the event
  });

  // dnd-kit drag-and-drop test
  it("allows reordering URLs via drag-and-drop", async () => {
    renderWithProviders(<UrlList />);

    // Find the draggable items by their text
    const firstItem = screen.getByText("Example 1");
    const secondItem = screen.getByText("Example 2");

    // Simulate drag-and-drop: move Example 1 below Example 2
    // dnd-kit uses pointer events, so we simulate them
    await act(async () => {
      fireEvent.pointerDown(firstItem);
      fireEvent.pointerMove(secondItem);
      fireEvent.pointerUp(secondItem);
    });

    // After drag, Example 2 should now appear before Example 1 in the DOM
    const items = screen.getAllByText(/Example/);
    expect(items[0]).toHaveTextContent("Example 2");
    expect(items[1]).toHaveTextContent("Example 1");
  });
});
