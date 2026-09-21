import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groqService } from '../services/groqService';
import { ConsultantResult } from '../types';
import { Icons } from './icons';
import { useToast } from '../context';

interface ConsultantProps {
  onSendToCompiler?: (text: string) => void;
}

export const Consultant: React.FC<ConsultantProps> = ({ onSendToCompiler }) => {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ConsultantResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConsult = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await groqService.judgeTone(input);
      setResult(response);
      showToast('Perspectiva gerada', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao consultar', 'error');
    } finally {
      setLoading(false);
    }
  }, [input, showToast]);

  const handleSendToCompiler = useCallback(() => {
    if (onSendToCompiler && result) {
      onSendToCompiler(result.conclusion);
      showToast('Veredito enviado ao Compiler', 'success');
    }
  }, [onSendToCompiler, result, showToast]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="label">Seu Dilema</label>
        <textarea
          className="textarea"
          placeholder="Ex: Devo pedir demissão agora para focar no meu projeto paralelo ou esperar mais 3 meses?"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={5}
        />

        <button
          onClick={handleConsult}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full btn-lg"
        >
          {loading ? (
            <span><Icons.Loader2 size={20} className="animate-spin" /> Analisando...</span>
          ) : (
            <span><Icons.MessageCircleQuestion size={20} /> Obter Perspectiva</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-5 border-l-4 border-[var(--success)]">
                <div className="flex items-center gap-2 text-[var(--success)] font-semibold text-xs mb-3">
                  <Icons.ThumbsUp size={14} />
                  Pros
                </div>
                <ul className="space-y-2">
                  {result.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-[var(--ink-2)] font-medium flex gap-2">
                      <span className="text-[var(--success)]">·</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-5 border-l-4 border-[var(--error)]">
                <div className="flex items-center gap-2 text-[var(--error)] font-semibold text-xs mb-3">
                  <Icons.ThumbsDown size={14} />
                  Contras
                </div>
                <ul className="space-y-2">
                  {result.cons.map((con, i) => (
                    <li key={i} className="text-sm text-[var(--ink-2)] font-medium flex gap-2">
                      <span className="text-[var(--error)]">·</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card p-6 border border-[var(--gold)]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[var(--gold)] font-semibold text-xs">
                  <Icons.Award size={16} />
                  Veredito
                </div>
                {onSendToCompiler && (
                  <button
                    onClick={handleSendToCompiler}
                    className="btn btn-ghost btn-sm text-[var(--gold)] hover:bg-[var(--gold-soft)]"
                  >
                    <Icons.ArrowRight size={12} />
                    Enviar ao Compiler
                  </button>
                )}
              </div>
              <p className="text-xl leading-relaxed font-bold tracking-tight text-[var(--ink)]">
                {result.conclusion}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
