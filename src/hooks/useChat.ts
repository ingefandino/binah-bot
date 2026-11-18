import { useCallback, useState } from "react";
import { askAI } from "../services/aiService";
import { loadContext } from "../services/contextLoader";
import { sendConsultationEmail } from "../services/emailService";
import type { ChatMessage, ConsultationLog } from "../types";

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [logs, setLogs] = useState<ConsultationLog[]>(() => {
    try {
      const raw = localStorage.getItem("consultation_logs");
      return raw ? (JSON.parse(raw) as ConsultationLog[]) : [];
    } catch {
      return [];
    }
  });
  const [context, setContext] = useState<string>("");
  const [contextLoaded, setContextLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initContext = useCallback(async () => {
    if (contextLoaded) return;
    const ctx = await loadContext();
    setContext(ctx);
    setContextLoaded(true);
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: `¡Hola! Soy el asistente virtual de ${__COMPANY_NAME__ || "la empresa"}. ¿En qué puedo ayudarte hoy?`,
        timestamp: Date.now(),
      },
    ]);
  }, [contextLoaded]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      try {
        const history = [...messages, userMsg]
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        const { content, latencyMs } = await askAI(history, context);

        const assistantMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content,
          timestamp: Date.now(),
          latencyMs,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        const log: ConsultationLog = {
          id: uid(),
          question: trimmed,
          answer: content,
          timestamp: Date.now(),
          latencyMs,
          resolved: !/humano|no (está|esta) cubierta|contactar/i.test(content),
          escalated: /humano|contactar/i.test(content),
        };
        setLogs((prev) => {
          const next = [log, ...prev].slice(0, 50);
          try {
            localStorage.setItem("consultation_logs", JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return next;
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        setError(msg);
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: `⚠️ Error: ${msg}`, timestamp: Date.now() },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, context]
  );

  const escalate = useCallback(
    async (question: string, answer: string) => {
      await sendConsultationEmail(question, answer);
    },
    []
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
    try {
      localStorage.removeItem("consultation_logs");
    } catch {
      /* ignore */
    }
  }, []);

  return {
    messages,
    logs,
    context,
    contextLoaded,
    loading,
    error,
    initContext,
    sendMessage,
    escalate,
    clearLogs,
  };
}