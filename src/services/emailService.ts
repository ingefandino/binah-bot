import { config } from "../config/env";

/**
 * Sends a consultation record by email.
 * Uses EmailJS when configured, otherwise falls back to mailto: (opens the user's mail client).
 */
export async function sendConsultationEmail(question: string, answer: string): Promise<void> {
  const subject = encodeURIComponent(`Consulta de atención al cliente - ${config.app.companyName}`);
  const body = encodeURIComponent(
    `Consulta:\n${question}\n\nRespuesta del asistente:\n${answer}\n\n---\nEnviado desde el prototipo de atención al cliente con IA.`
  );

  if (config.emailjs.enabled) {
    // EmailJS path (requires @emailjs/browser installed). Kept dynamic to avoid hard dependency.
    try {
      const moduleName = "@emailjs/browser";
      const mod: any = await import(/* @vite-ignore */ moduleName).catch(() => null);
      if (mod) {
        await mod.send(
          config.emailjs.serviceId,
          config.emailjs.templateId,
          { question, answer, company: config.app.companyName },
          config.emailjs.publicKey
        );
        return;
      }
    } catch (err) {
      console.warn("[emailService] EmailJS failed, falling back to mailto:", err);
    }
  }

  // Fallback: open the user's mail client with a pre-filled message.
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}