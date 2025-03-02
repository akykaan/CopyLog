import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import CardItems from "@/screens/CardItems";
import { RootState } from "@/store";
import {
  addItem,
  copyBoardSlice,
  deleteItem,
  togglePin,
} from "@/features/clipBoard";
import SearchComp from "./Search";
import Header from "./Header";

function CopyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const clipboardHistory = useSelector((state: RootState) =>
    copyBoardSlice.selectors.selectClipboardItems({ clipboard: state.board })
  );

  useEffect(() => {
    const handleClipboardUpdate = (text: string) => {
      const id = uuidv4();
      const data = {
        id,
        text,
        pinned: false,
      };

      dispatch(addItem(data));
    };
    window.electron?.onClipboardUpdate(handleClipboardUpdate);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteItem(id));
    },
    [dispatch]
  );

  const filteredHistory = useMemo(() => {
    if (searchQuery.trim() === "") {
      return clipboardHistory;
    }
    return clipboardHistory.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clipboardHistory, searchQuery]);

  const handlePinCopyItem = useCallback(
    (id: string) => {
      dispatch(togglePin(id));
    },
    [dispatch]
  );

  const Body = () => {
    return (
      <div className="p-4 mb-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-400">
        <div className="space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <div key={item.id} className="">
                <CardItems
                  item={item}
                  index={index}
                  handleDelete={handleDelete}
                  handlePinCopyItem={handlePinCopyItem}
                />
              </div>
            ))
          ) : (
            <div className="w-full bg-transparent text-gray-400">
              No items found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black">
        <div className="min-h-screen backdrop-blur-xl bg-black/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjEiIGZpbGw9IiNmZmZmZmYxMCIvPjwvc3ZnPg==')] bg-repeat">
          <div className="min-h-screen shadow-lg bg-gray-500/0.5 border border-gray-700/50 backdrop-blur-sm transform transition-all duration-200">
            <Header />
            <SearchComp setSearchQuery={setSearchQuery} />
            <Body />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default CopyList;
