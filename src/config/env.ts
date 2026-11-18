/**
 * Centralized, validated access to configuration.
 *
 * Variables are read from .env (names WITHOUT the VITE_ prefix) at build time
 * via vite.config.ts (loadEnv + define). This keeps the .env names clean
 * (API_KEY, BASE_URL, MODEL, ...) while still exposing them to the client.
 *
 * Never commit real keys: .env is gitignored, use .env.example as template.
 */

interface AppConfig {
  ai: {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
    enabled: boolean;
  };
  app: {
    name: string;
    companyName: string;
  };
}

function readValue(value: string | undefined, fallback = ""): string {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return fallback;
}

function validateApiKey(key: string): void {
  if (!key || key.startsWith("sk-your") || key === "sk-REEMPLAZA-CON-TU-KEY") {
    console.warn(
      "[config] API_KEY is not set. The app will run in DEMO mode (mocked responses). " +
        "Add a real key to .env to enable live AI."
    );
  }
}

const apiKey = readValue(__API_KEY__);
validateApiKey(apiKey);

export const config: AppConfig = {
  ai: {
    apiKey,
    baseUrl: readValue(__BASE_URL__, "https://api.openai.com/v1"),
    model: readValue(__MODEL__, "gpt-4o-mini"),
  },
  emailjs: {
    serviceId: readValue(__EMAILJS_SERVICE_ID__),
    templateId: readValue(__EMAILJS_TEMPLATE_ID__),
    publicKey: readValue(__EMAILJS_PUBLIC_KEY__),
    enabled:
      readValue(__EMAILJS_SERVICE_ID__) !== "" &&
      readValue(__EMAILJS_TEMPLATE_ID__) !== "" &&
      readValue(__EMAILJS_PUBLIC_KEY__) !== "",
  },
  app: {
    name: readValue(__APP_NAME__, "Asistente de Atención al Cliente"),
    companyName: readValue(__COMPANY_NAME__, "Mi Empresa"),
  },
};

export const isLiveAI = (): boolean =>
  Boolean(config.ai.apiKey) &&
  !config.ai.apiKey.startsWith("sk-your") &&
  config.ai.apiKey !== "sk-REEMPLAZA-CON-TU-KEY";