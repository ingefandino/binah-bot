import { useEffect } from "react";
import { motion } from "framer-motion";
import { useChat } from "./hooks/useChat";
import { useMetrics } from "./hooks/useMetrics";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { MetricsPanel } from "./components/MetricsPanel";
import { config, isLiveAI } from "./config/env";
import "./index.css";

export default function App() {
  const {
    messages,
    logs,
    contextLoaded,
    loading,
    error,
    initContext,
    sendMessage,
    clearLogs,
  } = useChat();
  const metrics = useMetrics(logs);

  useEffect(() => {
    initContext();
  }, [initContext]);

  return (
    <div className="app">
      <Header />
      {!isLiveAI() && (
        <motion.div
          className="banner banner--warn"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Modo demo: configura <code>API_KEY</code> en <code>.env</code> para respuestas reales del modelo{" "}
          <strong>{config.ai.model}</strong>.
        </motion.div>
      )}
      {error && (
        <motion.div className="banner banner--error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.div>
      )}
      <main className="app__main">
        <motion.section
          className="app__chat"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ChatWindow messages={messages} loading={loading} onSend={sendMessage} disabled={!contextLoaded} />
        </motion.section>
        <MetricsPanel metrics={metrics} logs={logs} onClear={clearLogs} />
      </main>
      <footer className="app__footer">
        Prototipo de atención al cliente con IA · Contexto: contexto.md · Logs en localStorage
      </footer>
    </div>
  );
}