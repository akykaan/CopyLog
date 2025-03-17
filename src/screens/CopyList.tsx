import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { TooltipProvider } from "@/components/ui/tooltip";
import { addItem } from "@/features/clipBoard";
import SearchComp from "./Search";
import Header from "./Header";
import Body from "./Body";

function CopyList() {
  const dispatch = useDispatch();

  // const clipboardHistory = useSelector((state: RootState) =>
  //   copyBoardSlice.selectors.selectClipboardItems({ board: state.board })
  // );

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

  // const filteredHistory = useMemo(() => {
  //   if (searchQuery.trim() === "") {
  //     return clipboardHistory;
  //   }
  //   return clipboardHistory.filter((item) =>
  //     item.text.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // }, [clipboardHistory, searchQuery]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black">
        <div className="min-h-screen backdrop-blur-xl bg-black/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjEiIGZpbGw9IiNmZmZmZmYxMCIvPjwvc3ZnPg==')] bg-repeat">
          <div className="min-h-screen shadow-lg bg-gray-500/0.5 border border-gray-700/50 backdrop-blur-sm transform transition-all duration-200">
            <Header />
            <SearchComp />
            <Body
            // filteredHistory={filteredHistory}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default CopyList;
