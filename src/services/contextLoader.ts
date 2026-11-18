/**
 * Loads the knowledge base (contexto.md) shipped in /public.
 * This is the "RAG-lite" step: the whole context is injected into the system prompt.
 */
export async function loadContext(): Promise<string> {
  try {
    const res = await fetch("/contexto.md", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text.trim();
  } catch (err) {
    console.error("[contextLoader] Failed to load contexto.md:", err);
    return "";
  }
}