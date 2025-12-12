"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🥝</span>
        <h1 className="text-xl font-semibold text-gray-900">Kiwi</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            title="Dashboard"
            className="flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          title="New Chat"
          className="flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden sm:inline">New Chat</span>
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
