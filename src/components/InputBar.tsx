import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export function InputBar({ onSend, loading, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || loading || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="inputbar">
      <div className="inputbar__field">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Escribe tu consulta..."
          disabled={loading || disabled}
          aria-label="Consulta"
        />
        <AnimatePresence>
          {value.trim() && !loading && (
            <motion.button
              key="send"
              className="inputbar__send"
              onClick={submit}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label="Enviar"
            >
              <Send size={18} />
            </motion.button>
          )}
        </AnimatePresence>
        {loading && (
          <div className="inputbar__spinner">
            <Loader2 size={18} className="spin" />
          </div>
        )}
      </div>
    </div>
  );
}