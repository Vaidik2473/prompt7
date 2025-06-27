import { PiCheck, PiCopyDuotone } from "react-icons/pi";
import { Button } from "./button";
import React from "react";

// Copy Button Component
interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = "",
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`relative overflow-hidden transition-all duration-200 hover:bg-gray-50 ${className}`}
    >
      <div className="relative w-4 h-4">
        {/* Copy Icon */}
        <PiCopyDuotone
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            isCopied
              ? "opacity-0 scale-75 rotate-90"
              : "opacity-100 scale-100 rotate-0"
          }`}
        />

        {/* Check Icon */}
        <PiCheck
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 text-green-600 ${
            isCopied
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-75 -rotate-90"
          }`}
        />
      </div>

      <span>{isCopied ? "Copied!" : "Copy"}</span>
    </Button>
  );
};
