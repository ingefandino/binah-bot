import { motion } from "framer-motion";
import { Activity, CheckCircle2, AlertTriangle, Clock, Mail, Trash2 } from "lucide-react";
import type { Metrics, ConsultationLog } from "../types";
import { sendConsultationEmail } from "../services/emailService";

interface Props {
  metrics: Metrics;
  logs: ConsultationLog[];
  onClear: () => void;
}

export function MetricsPanel({ metrics, logs, onClear }: Props) {
  const rate = Math.round(metrics.resolutionRate * 100);
  return (
    <motion.aside
      className="metrics"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <h2 className="metrics__title">
        <Activity size={16} /> Métricas de atención
      </h2>

      <div className="metrics__grid">
        <Stat label="Consultas" value={metrics.totalConsultations} icon={<Activity size={14} />} />
        <Stat label="Resueltas" value={metrics.resolvedCount} icon={<CheckCircle2 size={14} />} tone="ok" />
        <Stat label="Escaladas" value={metrics.escalatedCount} icon={<AlertTriangle size={14} />} tone="warn" />
        <Stat label="Tiempo prom." value={`${metrics.avgLatencyMs} ms`} icon={<Clock size={14} />} />
      </div>

      <div className="metrics__bar">
        <div className="metrics__bar-fill" style={{ width: `${rate}%` }} />
        <span className="metrics__bar-label">Tasa de resolución: {rate}%</span>
      </div>

      <div className="metrics__logs">
        <div className="metrics__logs-header">
          <span>Últimas consultas</span>
          {logs.length > 0 && (
            <button className="metrics__clear" onClick={onClear} title="Limpiar">
              <Trash2 size={13} />
            </button>
          )}
        </div>
        {logs.length === 0 && <p className="metrics__empty">Aún no hay consultas.</p>}
        {logs.slice(0, 6).map((log) => (
          <motion.div
            key={log.id}
            className="metrics__log"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="metrics__log-q">{log.question}</p>
            <div className="metrics__log-actions">
              <span className={`metrics__pill ${log.resolved ? "ok" : "warn"}`}>
                {log.resolved ? "Resuelta" : "Escalada"}
              </span>
              <button
                className="metrics__mail"
                onClick={() => sendConsultationEmail(log.question, log.answer)}
                title="Enviar por correo"
              >
                <Mail size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
}

function Stat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "ok" | "warn";
}) {
  return (
    <div className={`stat stat--${tone ?? "neutral"}`}>
      <div className="stat__icon">{icon}</div>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}