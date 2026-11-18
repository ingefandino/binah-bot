import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <motion.div
      className={`bubble bubble--${isUser ? "user" : "assistant"}`}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      layout
    >
      <div className="bubble__avatar">{isUser ? <User size={16} /> : <Bot size={16} />}</div>
      <div className="bubble__content">
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {message.latencyMs !== undefined && (
          <span className="bubble__meta">{message.latencyMs} ms</span>
        )}
      </div>
    </motion.div>
  );
}