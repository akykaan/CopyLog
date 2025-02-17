import { useCallback, useEffect, useMemo, useState } from "react";
import CardItems from "./CardItems";
import { v4 as uuidv4 } from "uuid";
import SearchComp from "./Search";
import { Minus, Sparkles, Square, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";

interface ClipboardItem {
  id: string;
  text: string;
  pinned: boolean;
}

function CopyList() {
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleClipboardUpdate = (text: string) => {
      setClipboardHistory((prevHistory) => {
        if (
          text.trim().length > 0 &&
          !prevHistory.some((item) => item.text === text)
        ) {
          const pinnedItems = prevHistory.filter((item) => item.pinned);
          const nonPinnedItems = prevHistory.filter((item) => !item.pinned);
          return [
            ...pinnedItems,
            { id: uuidv4(), text, pinned: false },
            ...nonPinnedItems,
          ];
        }
        return prevHistory;
      });
    };

    window.electron?.onClipboardUpdate(handleClipboardUpdate);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setClipboardHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      const itemId = newHistory.findIndex((item) => item.id === id);
      newHistory.splice(itemId, 1);
      return newHistory;
    });
  }, []);

  const filteredHistory = useMemo(() => {
    if (searchQuery.trim() === "") {
      return clipboardHistory;
    }
    return clipboardHistory.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clipboardHistory, searchQuery]);

  const sortHistory = (items: ClipboardItem[]) => {
    return [...items].sort((a, b) =>
      a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
    );
  };

  const handlePinCopyItem = useCallback((id: string) => {
    setClipboardHistory((prevHistory) => {
      const itemId = prevHistory.findIndex((item) => item.id === id);
      const item = prevHistory[itemId];
      prevHistory[itemId] = item.pinned
        ? { ...item, pinned: false }
        : { ...item, pinned: true };

      return sortHistory(prevHistory);
    });
  }, []);

  const handleMinimize = () => {
    window.electron?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electron?.maximizeWindow();
  };

  const handleClose = () => {
    window.electron?.closeWindow();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black">
        <div className="min-h-screen backdrop-blur-xl bg-black/20 p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjEiIGZpbGw9IiNmZmZmZmYxMCIvPjwvc3ZnPg==')] bg-repeat">
          <div className="max-w-2xl mx-auto rounded-2xl bg-gray-800/30 shadow-lg border border-gray-700/50 overflow-hidden backdrop-blur-3xl transform transition-all duration-200">
            <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700/50 flex items-center justify-between backdrop-blur-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-gray-200">
                  CopyLog
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handleMinimize}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleMaximize}>
                  <Square className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={handleClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <SearchComp setSearchQuery={setSearchQuery} />
            <div
              className="p-4 mb-4 max-h-[calc(100vh-180px)] overflow-y-auto
              bg-gradient-to-b from-transparent to-gray-900/20
              min-h-[200px]
            scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-400"
            >
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
                  <div className="w-full h-[200px] text-gray-400">
                    No items found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default CopyList;
