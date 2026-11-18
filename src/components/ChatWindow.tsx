import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { InputBar } from "./InputBar";
import type { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatWindow({ messages, loading, onSend, disabled }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat">
      <div className="chat__messages" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            className="bubble bubble--assistant bubble--typing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bubble__avatar">
              <span className="dot-pulse" />
            </div>
            <div className="bubble__content">
              <div className="typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <InputBar onSend={onSend} loading={loading} disabled={disabled} />
    </div>
  );
}