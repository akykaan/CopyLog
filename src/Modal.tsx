import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { Button } from "./components/ui/button";
import { Check, Copy } from "lucide-react";
import { resetCopyStatus, setCopyStatus } from "./features/copyItemSlice";
import { RootState } from "./store";
import { useSelector } from "react-redux";

interface ClipboardItem {
  id: string;
  text: string;
  pinned: boolean;
}

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
  

  const handleOnClickCopyIcon = async (item: ClipboardItem, index: number) => {
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
    <TooltipProvider>
      <div className="min-h-screen bg-gray-900">
        <div className="min-h-screen bg-black/10">
          <div className="min-h-screen shadow-lg border border-gray-700/50 transform transition-all duration-200">
            <div className="p-4 mb-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-400">
              <div className="space-y-3">
                {clipboarditems &&
                  clipboarditems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`max-h-[250px] overflow-y-auto p-4 mt-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/40
    border-gray-700/50 border backdrop-blur-md transition-all duration-200 group relative
    scrollbar-thin scrollbar-thumb-gray-500
    scrollbar-track-gray-700 hover:scrollbar-thumb-gray-400 ${
      item.pinned
        ? "ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'"
        : ""
    }`}
                    >
                      {/* Tooltipler - En Üstte */}
                      <div className="flex justify-between items-center mb-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOnClickCopyIcon(item, index)}
                            >
                              {isCopy[index] ? (
                                <Check color="green" />
                              ) : (
                                <div className="relative group">
                                  <Copy
                                    className="w-4 h-4"
                                    onClick={() =>
                                      handleOnClickCopyIcon(item, index)
                                    }
                                  />
                                </div>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy to clipboard</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* İçerik - Tooltiplerin Altında */}
                      <div className="min-w-0 text-left">
                        <div className="font-mono text-sm break-all">
                          <pre className="no-drag whitespace-pre-wrap text-gray-200">
                            {item.text}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default Panel;