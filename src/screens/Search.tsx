import React from "react";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { copyBoardSlice, setSearchText } from "../features/clipBoard";
import { Input } from "@/components/ui/input";

const SearchComp = React.memo(function SearchSearchComp() {
  const dispatch = useDispatch();
  const searchText = useSelector(copyBoardSlice.selectors.selectSearchText);
  return (
    <div className="px-4 py-3 bg-gray-800/20 border-b border-gray-700/50">
      <div className="relative flex-1 max-w-fit">
        <Input
          type="text"
          value={searchText}
          onChange={(e) => dispatch(setSearchText(e.target.value))}
          placeholder="Search clipboard..."
          className="no-drag pl-9 bg-gray-900 border border-gray-700 focus-visible:ring-blue-400" 
        />
        <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
});

export default SearchComp;
