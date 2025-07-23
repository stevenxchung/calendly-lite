import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  items: { label: string; onClick: () => void }[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      // If the click is outside the menu, close it
      // (use event.target to check containment)
      // Use a ref for the menu element:
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
      // Otherwise, let the button's onClick fire before unmounting
    }
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", onClose, { once: true });
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onClose);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
        background: "white",
        border: "1px solid #aaa",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        padding: 4,
        borderRadius: 4,
        minWidth: 140,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) => (
        <button
          key={item.label}
          className="block text-left px-3 py-1 w-full hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
