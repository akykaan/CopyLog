import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { copyBoardSlice, setSearchText } from "@/features/clipBoard";

// interface SearchProps {
//   setSearchQuery: (query: string) => void;
// }

const SearchComp = React.memo(function SearchSearchComp() {
  const dispatch = useDispatch();
  const searchText = useSelector(copyBoardSlice.selectors.selectSearchText);
  return (
    <div
      className="px-4 py-3 bg-gray-800/20 border-b border-gray-700/50 flex items-center justify-between
    backdrop-blur-md"
    >
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          value={searchText}
          // onChange={(e) => setSearchQuery(e.target.value.trim())}
          onChange={(e) => dispatch(setSearchText(e.target.value))}
          placeholder="Search clipboard..."
          // className="mb-4 mt-4 h-[50px] w-[550px] pl-9"
          className="no-drag pl-9 bg-gray-900/30 border-gray-700/50 focus-visible:ring-blue-400/50"
        />
      </div>
    </div>
  );
});

export default SearchComp;
