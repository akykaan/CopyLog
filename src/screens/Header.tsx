import { Button } from "@/components/ui/button";
import { useWindowManager } from "@/hooks/useWindowManager";
import { Minus, Sparkles, Square, X } from "lucide-react";
import React from "react";

const Header = React.memo(function Header() {
  const { minimize, maximize, close } = useWindowManager();

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
});

export default Header;
