import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Check, Copy } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { resetCopyStatus, setCopyStatus } from "@/features/copyItemSlice";
import { ClipboardItem } from "../../features/clipBoard.ts";

function Panel() {
  const dispatch = useDispatch();

  const [clipboarditems, setClipboarditems] = useState<ClipboardItem[]>([]);
  const isCopy = useSelector((state: RootState) => state.copy.isCopy);

  useEffect(() => {
    let isMounted = true;

    const fetchState = async () => {
      const state = await window.electron?.getStateFromMain();
      if (isMounted) {
        setClipboarditems(state.board.items);
      }
    };

    fetchState();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = async (item: ClipboardItem, index: number) => {
    try {
      await navigator.clipboard.writeText(item.text);
      dispatch(setCopyStatus({ id: index, status: item.pinned }));
      setTimeout(() => {
        dispatch(resetCopyStatus({ id: index }));
      }, 3000);
    } catch (err) {
      console.error("Kopyalama işlemi başarısız:", err);
    }
  };

  return (
    <div className="no-drag min-h-screen bg-gray-900 text-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-4">
        {clipboarditems?.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl bg-gray-800 hover:bg-gray-800/40
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
    </div>
  );
}

export default Panel;
