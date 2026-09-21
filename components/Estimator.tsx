import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groqService } from '../services/groqService';
import { Icons } from './icons';
import { useToast } from '../context';

export const Estimator: React.FC = () => {
  const { showToast } = useToast();
  const [task, setTask] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEstimate = useCallback(async () => {
    if (!task.trim()) return;
    setLoading(true);
    try {
      const estimate = await groqService.estimateTime(task);
      setResult(estimate);
      showToast('Estimativa calculada', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao estimar tempo', 'error');
    } finally {
      setLoading(false);
    }
  }, [task, showToast]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="label">Tarefa ou Projeto</label>
        <div className="relative">
          <input
            type="text"
            className="input pl-12"
            placeholder="Ex: Escrever um artigo de 500 palavras"
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEstimate()}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-4)]">
            <Icons.Clock size={20} />
          </div>
        </div>

        <button
          onClick={handleEstimate}
          disabled={loading || !task.trim()}
          className="btn btn-primary w-full btn-lg"
        >
          {loading ? (
            <span><Icons.Loader2 size={22} className="animate-spin" /> Calculando...</span>
          ) : (
            <span><Icons.Timer size={22} /> Calcular Esforço Real</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[var(--ink)] text-lg leading-relaxed font-medium whitespace-pre-wrap">{result}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
