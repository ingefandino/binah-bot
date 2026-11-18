import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL variables from .env (no prefix filter) so the app can use
  // non-VITE_ names like API_KEY, BASE_URL, MODEL, etc.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      __API_KEY__: JSON.stringify(env.API_KEY ?? ""),
      __BASE_URL__: JSON.stringify(env.BASE_URL ?? ""),
      __MODEL__: JSON.stringify(env.MODEL ?? ""),
      __EMAILJS_SERVICE_ID__: JSON.stringify(env.EMAILJS_SERVICE_ID ?? ""),
      __EMAILJS_TEMPLATE_ID__: JSON.stringify(env.EMAILJS_TEMPLATE_ID ?? ""),
      __EMAILJS_PUBLIC_KEY__: JSON.stringify(env.EMAILJS_PUBLIC_KEY ?? ""),
      __APP_NAME__: JSON.stringify(env.APP_NAME ?? ""),
      __COMPANY_NAME__: JSON.stringify(env.COMPANY_NAME ?? ""),
    },
  };
});