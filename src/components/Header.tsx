import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { config } from "../config/env";

export function Header() {
  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="header__brand">
        <div className="header__logo">
          <Bot size={22} />
        </div>
        <div>
          <h1 className="header__title">{config.app.name}</h1>
          <p className="header__subtitle">{config.app.companyName} · Asistente con IA</p>
        </div>
      </div>
      <div className="header__badge">
        <Sparkles size={14} />
        <span>Contexto cargado</span>
      </div>
    </motion.header>
  );
}