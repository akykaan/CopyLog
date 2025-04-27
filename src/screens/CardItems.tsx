import { Check, Copy, Pin, PinOff, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { resetCopyStatus, setCopyStatus } from "@/features/copyItemSlice";
import { useCallback } from "react";
import { copyBoardSlice, deleteItem, togglePin } from "@/features/clipBoard";

function CardItems() {
  const dispatch = useDispatch();
  const filteredHistory = useSelector(
    copyBoardSlice.selectors.selectFilteredItems
  );
  const isCopy = useSelector((state: RootState) => state.copy.isCopy);

  const handleCopy = (
    item: { id: string; text: string; pinned: boolean },
    index: number
  ) => {
    navigator.clipboard
      .writeText(item.text)
      .then(() => {
        dispatch(setCopyStatus({ id: index, status: item.pinned }));
        setTimeout(() => {
          dispatch(resetCopyStatus({ id: index }));
        }, 3000);
      })
      .catch((err) => {
        console.error("Kopyalama işlemi başarısız:", err);
      });
  };

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteItem(id));
    },
    [dispatch]
  );

  const handlePin = useCallback(
    (id: string) => {
      dispatch(togglePin(id));
    },
    [dispatch]
  );

  return (
    <div>
      {filteredHistory.length === 0 ? (
        <div className="w-full bg-transparent text-gray-400 p-4 mb-4">
          No items found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
          {filteredHistory.map((item, index) => (
            <div
              key={item.id}
              className={`no-drag p-4 rounded-xl bg-gray-800 hover:bg-gray-800/40
           border border-gray-700 transition-all duration-200
           scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700
           flex flex-col justify-between h-48
           ${
             item.pinned
               ? "ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,1)]"
               : ""
           }`}
            >
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={() => handleCopy(item, index)}
                  className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isCopy[index] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handlePin(item.id)}
                  className={`p-1.5 rounded-md ${
                    item.pinned
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-700 text-gray-300 hover:bg-yellow-600 hover:text-white"
                  }`}
                  title={item.pinned ? "Unpin" : "Pin"}
                >
                  {item.pinned ? (
                    <PinOff className="w-4 h-4" />
                  ) : (
                    <Pin className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className={`p-1.5 rounded-md ${
                    item.pinned
                      ? "opacity-50 pointer-events-none"
                      : "opacity-100 hover:opacity-60"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <pre
                className="overflow-auto text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed"
                style={{ scrollbarWidth: "thin" }}
              >
                {item.text}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default CardItems;
