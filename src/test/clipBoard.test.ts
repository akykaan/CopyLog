import reducer, {
  addItem,
  deleteItem,
  ClipboardItem,
  ClipboardState,
  initialState,
} from "@/features/clipBoard";
import { MAX_ITEMS, MAX_TEXT_LENGTH } from "@/types/ipc";

const makeItem = (id: string, text: string, pinned = false): ClipboardItem => ({
  id,
  text,
  pinned,
});

describe("copyBoardSlice - addItem", () => {
  it("should add a new unique item to the clipboard", () => {
    const newState = reducer(initialState, addItem(makeItem("1", "First text")));
    expect(newState.items.length).toBe(1);
    expect(newState.items[0]).toEqual(makeItem("1", "First text"));
  });

  it("should NOT add duplicate items based on text", () => {
    let state = reducer(initialState, addItem(makeItem("1", "Same text")));
    state = reducer(state, addItem(makeItem("2", "Same text")));
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe("1");
  });

  it("should add multiple different items", () => {
    let state = initialState;
    state = reducer(state, addItem(makeItem("1", "First")));
    state = reducer(state, addItem(makeItem("2", "Second")));
    state = reducer(state, addItem(makeItem("3", "Third")));
    expect(state.items.length).toBe(3);
  });

  it("should truncate text longer than MAX_TEXT_LENGTH", () => {
    const longText = "x".repeat(MAX_TEXT_LENGTH + 100);
    const state = reducer(initialState, addItem(makeItem("1", longText)));
    expect(state.items[0].text.length).toBe(MAX_TEXT_LENGTH);
  });

  it("should cap the history at MAX_ITEMS", () => {
    let state: ClipboardState = initialState;
    for (let i = 0; i < MAX_ITEMS + 50; i++) {
      state = reducer(state, addItem(makeItem(i.toString(), `Clipboard ${i}`)));
    }
    expect(state.items.length).toBe(MAX_ITEMS);
  });

  it("should keep pinned items when capping the history", () => {
    let state: ClipboardState = initialState;
    state = reducer(state, addItem(makeItem("pinned-1", "Pinned value", true)));
    for (let i = 0; i < MAX_ITEMS; i++) {
      state = reducer(state, addItem(makeItem(`x${i}`, `Clipboard ${i}`)));
    }
    expect(state.items.some((item) => item.id === "pinned-1")).toBe(true);
    expect(state.items.length).toBe(MAX_ITEMS);
  });
});

describe("copyBoardSlice - deleteItem", () => {
  it("should delete an existing item", () => {
    let state = reducer(initialState, addItem(makeItem("1", "First")));
    state = reducer(state, addItem(makeItem("2", "Second")));
    state = reducer(state, deleteItem("1"));
    expect(state.items.map((item) => item.id)).toEqual(["2"]);
  });

  it("should NOT delete the last item when id is not found", () => {
    let state = reducer(initialState, addItem(makeItem("1", "Only item")));
    state = reducer(state, deleteItem("non-existent-id"));
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe("1");
  });
});