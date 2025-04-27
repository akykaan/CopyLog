import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addItem } from "@/features/clipBoard";
import SearchComp from "./Search";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CardItems from "./CardItems";
import Header from "./Header";

function CopyList() {
  const dispatch = useDispatch();

  const items = useSelector((state: RootState) => state.board.items);

  useEffect(() => {
    window.electron?.sendStateToMain({ board: { items } });
  }, [items]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <SearchComp />
      <CardItems />
    </div>
  );
}

export default CopyList;
