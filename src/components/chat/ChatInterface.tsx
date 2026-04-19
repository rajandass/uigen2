"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/lib/contexts/chat-context";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Bot } from "lucide-react";

interface ChatInterfaceProps {
  user?: { id: string; email: string } | null;
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const guardedSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!user) {
      e.preventDefault();
      setAuthDialogOpen(true);
      return;
    }
    handleSubmit(e);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4 shadow-sm">
            <Bot className="h-7 w-7 text-blue-600" />
          </div>
          <p className="text-neutral-900 font-semibold text-lg mb-2">Start a conversation to generate React components</p>
          <p className="text-neutral-500 text-sm max-w-sm">I can help you create buttons, forms, cards, and more</p>
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden">
          <div className="pr-4">
            <MessageList messages={messages} isLoading={status === "streaming"} />
          </div>
        </ScrollArea>
      )}
      <div className="mt-4 flex-shrink-0">
        {!user && (
          <p className="text-center text-sm text-neutral-400 mb-2">
            <button onClick={() => setAuthDialogOpen(true)} className="text-blue-500 hover:underline">Sign in</button> to generate components
          </p>
        )}
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={guardedSubmit}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode="signin"
      />
    </div>
  );
}
