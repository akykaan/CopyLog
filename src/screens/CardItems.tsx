import { Check, Copy, Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { resetCopyStatus, setCopyStatus } from "@/features/copyItemSlice";

interface CardItemsProps {
  item: { id: string; text: string; pinned: boolean };
  index: number;
  handleDelete: (id: string) => void;
  handlePinCopyItem: (id: string) => void;
}

function CardItems({
  item,
  index,
  handleDelete,
  handlePinCopyItem,
}: CardItemsProps) {
  const dispatch = useDispatch();
  const isCopy = useSelector((state: RootState) => state.copy.isCopy);

  const handleOnClickCopyIcon = (
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

  return (
    <div
      className={`max-h-[250px] overflow-y-auto p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/40 
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
              onClick={() => handleDelete(item.id)}
              className={`cursor-pointer ${
                item.pinned
                  ? "opacity-50 hover:opacity-50 transition-opacity duration-300 ease-in-out pointer-events-none"
                  : "opacity-100 hover:opacity-50 transition-opacity duration-300 ease-in-out pointer-events-auto"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePinCopyItem(item.id)}
              className={item.pinned ? "text-blue-400" : ""}
            >
              {item.pinned ? (
                <PinOff className="w-4 h-4" />
              ) : (
                <Pin className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{item.pinned ? "Unpin" : "Pin"}</TooltipContent>
        </Tooltip>

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
                    onClick={() => handleOnClickCopyIcon(item, index)}
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
  );
}
export default CardItems;
