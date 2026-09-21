import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groqService } from '../services/groqService';
import { Icons } from './icons';
import { useToast } from '../context';

interface CompilerProps {
  preloadValue?: string;
  onClearPreload?: () => void;
  onSendToMagicTodo?: (payload: string | string[]) => void;
}

export const Compiler: React.FC<CompilerProps> = ({ preloadValue, onClearPreload, onSendToMagicTodo }) => {
  const { showToast } = useToast();
  const [input, setInput] = useState(preloadValue || '');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preloadValue) setInput(preloadValue);
  }, [preloadValue]);

  const handleCompile = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const tasks = await groqService.compileTasks(input);
      setResults(tasks);
      if (onClearPreload) onClearPreload();
      showToast(`${tasks.length} tarefas extraídas`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao compilar tarefas', 'error');
    } finally {
      setLoading(false);
    }
  }, [input, onClearPreload, showToast]);

  const handleSendTask = useCallback((task: string) => {
    if (onSendToMagicTodo) {
      onSendToMagicTodo(task);
      showToast('Tarefa enviada ao Magic To-Do', 'success');
    }
  }, [onSendToMagicTodo, showToast]);

  const handleSendAll = useCallback(() => {
    if (onSendToMagicTodo) {
      onSendToMagicTodo(results);
      showToast('Todas as tarefas enviadas', 'success');
    }
  }, [onSendToMagicTodo, results]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="label">Brain Dump</label>
        <textarea
          className="textarea"
          placeholder="Ex: Preciso organizar o aniversário, comprar bolo, balões, convidar o pessoal do trabalho, mas antes tenho que limpar a sala e ver se o som tá funcionando..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
        />

        <button
          onClick={handleCompile}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full btn-lg"
        >
          {loading ? (
            <span><Icons.Loader2 size={20} className="animate-spin" /> Processando...</span>
          ) : (
            <span><Icons.Sparkles size={20} /> Transformar em Plano</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h3 className="font-bold text-[var(--ink)] flex items-center gap-2">
                <Icons.ListPlus size={18} className="text-[var(--gold)]" />
                Lista de Tarefas
              </h3>
              {onSendToMagicTodo && (
                <button
                  onClick={handleSendAll}
                  className="btn btn-secondary btn-sm"
                >
                  <Icons.Wand2 size={12} />
                  Exportar Tudo
                </button>
              )}
            </div>

            <div className="grid gap-2">
              <AnimatePresence>
                {results.map((task, i) => (
                  <div
                    key={i}
                    className="card-interactive p-4 flex items-center justify-between gap-4"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input type="checkbox" className="sr-only peer" />
                      <span className="checkbox-custom">
                        <Icons.CheckCircle2 size={12} className="check-icon" />
                      </span>
                      <span className="text-sm font-medium text-[var(--ink-2)]">{task}</span>
                    </label>
                    {onSendToMagicTodo && (
                      <button
                        onClick={() => handleSendTask(task)}
                        className="btn btn-icon btn-ghost text-[var(--gold)] hover:bg-[var(--gold-soft)] opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Enviar ao Magic To-Do"
                      >
                        <Icons.ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
