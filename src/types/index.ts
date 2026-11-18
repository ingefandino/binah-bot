export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  latencyMs?: number;
}

export interface ConsultationLog {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
  latencyMs: number;
  resolved: boolean;
  escalated: boolean;
}

export interface Metrics {
  totalConsultations: number;
  resolvedCount: number;
  escalatedCount: number;
  avgLatencyMs: number;
  resolutionRate: number; // 0..1
}

export interface AIResponse {
  content: string;
  latencyMs: number;
}