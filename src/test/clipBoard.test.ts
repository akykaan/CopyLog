// import reducer, { addItem } from "@/features/clipBoard";
// import { ClipboardItem, ClipboardState } from "@/features/clipBoard";

// describe("copyBoardSlice - addItem", () => {
//   it("should add a new unique item to the clipboard", () => {
//     const initialState: ClipboardState = {
//       items: [],
//       searchText: "",
//     };

//     const newItem: ClipboardItem = {
//       id: "1",
//       text: "First clipboard text",
//       pinned: false,
//     };

//     const newState = reducer(initialState, addItem(newItem));

//     expect(newState.items.length).toBe(1);
//     expect(newState.items[0]).toEqual(newItem);
//   });

//   it("should NOT add duplicate items based on text", () => {
//     // 2 defa aynı şeyin kopyalanması durumunda sadece bir tanesi eklenmelidir.
//     const initialState: ClipboardState = {
//       items: [
//         {
//           id: "1",
//           text: "First clipboard text",
//           pinned: false,
//         },
//       ],
//       searchText: "",
//     };

//     const duplicateItem: ClipboardItem = {
//       id: "2",
//       text: "First clipboard text", // text üzerinden kontrol ediliyor
//       pinned: false,
//     };

//     const newState = reducer(initialState, addItem(duplicateItem));

//     expect(newState.items.length).toBe(1); // var olan item 1 olarak kalmalı çünkü diğer item'in text'i ile aynı
//     expect(newState.items[0].id).toBe("1");
//   });

//   it("should add multiple different items", () => {
//     const initialState: ClipboardState = {
//       items: [],
//       searchText: "",
//     };

//     const itemsToAdd: ClipboardItem[] = [
//       { id: "1", text: "First", pinned: false },
//       { id: "2", text: "Second", pinned: false },
//       { id: "3", text: "Third", pinned: false },
//     ];

//     let newState = initialState;

//     for (const item of itemsToAdd) {
//       newState = reducer(newState, addItem(item));
//     }

//     expect(newState.items.length).toBe(3);
//   });
// });

// describe("stres test for addItem", () => {
//   it("should add 500 unique items", async () => {
//     // 500 öğe ekle
//     const initialState: ClipboardState = {
//       items: [],
//       searchText: "",
//     };

//     let state = initialState;

//     for (let i = 0; i < 500; i++) {
//       const newItem: ClipboardItem = {
//         id: i.toString(),
//         text: `Clipboard text example ${i}`,
//         pinned: false,
//       };

//       state = reducer(state, addItem(newItem));
//     }

//     expect(state.items.length).toBe(500); // 500 öğe olmalı
//     // expect(state.items[0].text).toBe("Clipboard text example 499"); // En son eklenen öğe
//   });
// });
