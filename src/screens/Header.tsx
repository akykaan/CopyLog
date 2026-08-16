import { Button } from "@/components/ui/button";
import { useWindowManager } from "@/hooks/useWindowManager";
import { Minus, Pin, PinOff, Sparkles, Square, X } from "lucide-react";
import React, { useState } from "react";

const Header = React.memo(function Header() {
  const { minimize, maximize, close } = useWindowManager();
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  const toggleAlwaysOnTop = () => {
    const next = !alwaysOnTop;
    setAlwaysOnTop(next);
    window.electron?.setAlwaysOnTop(next);
  };

  return (
    <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700/50 flex items-center justify-between backdrop-blur-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50">
      <div className="flex items-center space-x-3">
        <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-200">CopyLog</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAlwaysOnTop}
          title="Toggle always on top"
        >
          {alwaysOnTop ? (
            <Pin className="w-4 h-4 text-yellow-400" />
          ) : (
            <PinOff className="w-4 h-4" />
          )}
        </Button>
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
