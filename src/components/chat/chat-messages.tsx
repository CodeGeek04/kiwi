"use client";

import { useEffect, useRef } from "react";
import type { Message } from "./chat-container";
import { MessageBubble } from "./message-bubble";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🥝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to Kiwi
          </h2>
          <p className="text-gray-600 mb-4">
            Your personal CRM assistant. I can help you manage leads, tasks, and
            notes through conversation.
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Try saying:</p>
            <p className="italic">&quot;Add a new lead called Acme Corp&quot;</p>
            <p className="italic">
              &quot;Create a task to follow up with John tomorrow&quot;
            </p>
            <p className="italic">&quot;What tasks do I have today?&quot;</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if the last message is an empty assistant message (still streaming)
  const lastMessage = messages[messages.length - 1];
  const isStreamingEmpty =
    isLoading && lastMessage?.role === "assistant" && !lastMessage.content;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isStreamingEmpty && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
