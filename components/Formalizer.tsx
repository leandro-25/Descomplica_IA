import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groqService } from '../services/groqService';
import { Icons } from './icons';
import { useToast } from '../context';

export const Formalizer: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [tone, setTone] = useState('mais profissional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const tones = [
    'mais profissional',
    'mais educado',
    'menos agressivo',
    'mais fácil de ler',
    'mais conciso',
    'mais amigável',
    'como um e-mail formal',
    'para um grupo de amigos',
    'correção ortográfica gentil',
  ];

  const handleFormalize = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const output = await groqService.formalizeText(text, tone);
      setResult(output);
      showToast('Texto ajustado com sucesso', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao ajustar texto', 'error');
    } finally {
      setLoading(false);
    }
  }, [text, tone, showToast]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(result);
    showToast('Copiado para a área de transferência', 'success');
  }, [result, showToast]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="label">Texto Original</label>
        <textarea
          className="textarea"
          placeholder="Ex: Eu preciso dizer ao meu chefe que vou me atrasar de novo..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
        />

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="flex-1">
            <label className="label mb-2">Tom de Voz</label>
            <select
              className="select"
              value={tone}
              onChange={e => setTone(e.target.value)}
            >
              {tones.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleFormalize}
            disabled={loading || !text.trim()}
            className="btn btn-primary btn-lg"
          >
            {loading ? (
              <span><Icons.Loader2 size={16} className="animate-spin" /> Processando...</span>
            ) : (
              <span><Icons.Sparkles size={16} /> Ajustar Tom</span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="card p-6 relative group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={copyToClipboard}
                className="btn btn-icon btn-ghost text-[var(--gold)] hover:bg-[var(--gold-soft)]"
                aria-label="Copiar resultado"
              >
                <Icons.Copy size={16} />
              </button>
            </div>
            <p className="text-[var(--ink)] text-lg leading-relaxed font-medium whitespace-pre-wrap pr-10">{result}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
