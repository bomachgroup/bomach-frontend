"use client";

import { useState, useEffect, useCallback } from "react";

export interface MessageItem {
  id: string;
  text: string;
  type: "success" | "error" | "warning" | "info";
}

let addMessageExternal: ((msg: Omit<MessageItem, "id">) => void) | null = null;

/**
 * Call this from anywhere to show a toast notification.
 * Usage: showMessage({ text: "Done!", type: "success" })
 */
export function showMessage(msg: Omit<MessageItem, "id">) {
  if (addMessageExternal) {
    addMessageExternal(msg);
  }
}

export default function MessageNotification() {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const addMessage = useCallback((msg: Omit<MessageItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setMessages((prev) => [...prev, { ...msg, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    addMessageExternal = addMessage;
    return () => {
      addMessageExternal = null;
    };
  }, [addMessage]);

  const dismissMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  if (messages.length === 0) return null;

  return (
    <div style={{ position: "fixed", zIndex: 10000, right: "2vh", top: 0 }}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`alert alert-${msg.type === "error" ? "danger" : msg.type} alert-dismissible alertDisplay`}
          style={{ marginTop: "5vh", maxWidth: "75vw" }}
        >
          <a
            href="#"
            className="close closeAlertBtn"
            data-dismiss="alert"
            aria-label="close"
            onClick={(e) => {
              e.preventDefault();
              dismissMessage(msg.id);
            }}
          >
            &times;
          </a>
          {msg.text}
        </div>
      ))}
    </div>
  );
}
