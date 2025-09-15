"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ActionMenu = ({
  actions = [],
  trigger = "⋯",
  align = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords(rect);
    }
    setIsOpen((prev) => !prev);
  };

  const handleActionClick = (action) => {
    if (!action.disabled && action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideMenu = menuRef.current?.contains(e.target);
      const clickedTrigger = triggerRef.current?.contains(e.target);

      if (!clickedInsideMenu && !clickedTrigger) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="admin-button admin-button-ghost"
        style={{
          width: "32px",
          height: "32px",
          padding: 0,
          fontSize: "1.2rem",
        }}
      >
        {trigger}
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top:
                window.innerHeight - coords.bottom < 200 &&
                  coords.top > window.innerHeight - coords.bottom
                  ? coords.top - 130 // open upward
                  : coords.bottom, // open downward
              left: align === "right" ? coords.right - 80 : coords.left,

              overflowY: "auto",
              backgroundColor: "var(--admin-card)",
              border: "1px solid var(--admin-border)",
              borderRadius: "var(--admin-radius)",
              boxShadow: "var(--admin-shadow-lg)",
              zIndex: 9999,
              padding: "0.25rem",
              color: "var(--admin-menu-text)",
            }}
            role="menu"
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled || action.loading}
                className="admin-button admin-button-ghost"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  color:
                    action.variant === "destructive"
                      ? "#dc2626"
                      : "var(--admin-menu-text)",
                  opacity: action.disabled ? 0.5 : 1,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--admin-menu-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {action.icon && (
                  <span style={{ marginRight: "0.5rem" }}>{action.icon}</span>
                )}
                {action.loading ? action.loadingText || action.label : action.label}
              </button>
            ))}
          </div>
          ,
          document.body
        )}
    </div>
  );
};

export default ActionMenu;