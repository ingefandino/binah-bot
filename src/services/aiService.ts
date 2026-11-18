import { config, isLiveAI } from "../config/env";
import type { AIResponse } from "../types";

const SYSTEM_PROMPT = (context: string) => `Eres un asistente virtual de atención al cliente de ${config.app.companyName}.
Responde de forma clara, breve y amable, usando únicamente la información del contexto proporcionado.
Si la consulta no está cubierta por el contexto, indícalo y sugiere contactar a un humano.
No inventes datos. Siempre ofrece ayuda adicional al final.

CONTEXTO DE CONOCIMIENTO:
${context || "(sin contexto cargado)"}`;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Sends a conversation to an OpenAI-compatible endpoint.
 * Falls back to a deterministic mock when no API key is configured (demo mode).
 */
export async function askAI(history: ChatTurn[], context: string): Promise<AIResponse> {
  const start = performance.now();

  if (!isLiveAI()) {
    // Demo mode: simulate latency + a contextual answer.
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    const last = history[history.length - 1]?.content ?? "";
    const latencyMs = Math.round(performance.now() - start);
    return {
      content:
        `**[Modo demo]** Sin API key configurada. Tu consulta fue: "${last}".\n\n` +
        `Configura API_KEY en .env para obtener respuestas reales del modelo ${config.ai.model}. ` +
        `El contexto cargado tiene ${context.split(/\s+/).length} palabras.`,
      latencyMs,
    };
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT(context) },
    ...history.map((h) => ({ role: h.role, content: h.content })),
  ];

  const res = await fetch(`${config.ai.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ai.apiKey}`,
    },
    body: JSON.stringify({
      model: config.ai.model,
      messages,
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content: string =
    data?.choices?.[0]?.message?.content ?? "No se recibió respuesta del modelo.";
  const latencyMs = Math.round(performance.now() - start);
  return { content, latencyMs };
}