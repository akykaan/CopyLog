import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Minus, Sparkles, Square, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import CardItems from "@/screens/CardItems";
import { useWindowManager } from "@/hooks/useWindowManager";
import { RootState } from "@/store";
import { addItem, deleteItem, togglePin } from "@/features/clipBoard";
import SearchComp from "./Search";

function CopyList() {
  const [searchQuery, setSearchQuery] = useState("");
  const clipboardHistoryX = useSelector(
    (state: RootState) => state.board.items
  );
  const dispatch = useDispatch();
  const { minimize, maximize, close } = useWindowManager();

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
      return clipboardHistoryX;
    }
    return clipboardHistoryX.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clipboardHistoryX, searchQuery]);

  const handlePinCopyItem = useCallback(
    (id: string) => {
      dispatch(togglePin(id));
    },
    [dispatch]
  );

  const Header = () => {
    return (
      <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700/50 flex items-center justify-between backdrop-blur-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="text-sm font-medium text-gray-200">CopyLog</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={minimize}>
            <Minus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={maximize}>
            <Square className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={close}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

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
