import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToolType } from './types';
import { MagicTodo } from './components/MagicTodo';
import { Compiler } from './components/Compiler';
import { Estimator } from './components/Estimator';
import { Consultant } from './components/Consultant';
import { Formalizer } from './components/Formalizer';
import { Icons, IconName } from './components/icons';
import { ToastProvider, ToastPortal } from './context';

const tools = [
  { id: 'magic-todo', name: 'Magic To-Do', icon: 'Wand2' as IconName, accent: 'todo', description: 'Quebre tarefas grandes em passos simples' },
  { id: 'compiler', name: 'Compiler', icon: 'LayoutList' as IconName, accent: 'compiler', description: 'Transforme ideias vagas em ação' },
  { id: 'estimator', name: 'Estimator', icon: 'Clock' as IconName, accent: 'estimator', description: 'Descubra quanto tempo leva' },
  { id: 'consultant', name: 'Consultant', icon: 'MessageCircleQuestion' as IconName, accent: 'consultant', description: 'Explore diferentes perspectivas' },
  { id: 'formalizer', name: 'Formalizer', icon: 'AlignLeft' as IconName, accent: 'formalizer', description: 'Ajuste o tom do seu texto' },
];

const AppContent: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [compilerPreload, setCompilerPreload] = useState('');
  const [magicTodoPreload, setMagicTodoPreload] = useState<string[]>([]);
  const [commandValue, setCommandValue] = useState('');
  const commandRef = useRef<HTMLTextAreaElement>(null);

  const handleSendToCompiler = (text: string) => {
    setCompilerPreload(text);
    setActiveTool('compiler');
  };

  const handleSendToMagicTodo = (payload: string | string[]) => {
    const tasks = Array.isArray(payload) ? payload : [payload];
    setMagicTodoPreload(tasks);
    setActiveTool('magic-todo');
  };

  const handleCommandSubmit = () => {
    if (!commandValue.trim()) return;
    setCompilerPreload(commandValue);
    setCommandValue('');
    setActiveTool('compiler');
  };

  const activeToolData = tools.find(t => t.id === activeTool);

  const renderTool = () => {
    switch (activeTool) {
      case 'magic-todo':
        return <MagicTodo preloadTasks={magicTodoPreload} onClearPreload={() => setMagicTodoPreload([])} />;
      case 'compiler':
        return <Compiler preloadValue={compilerPreload} onClearPreload={() => setCompilerPreload('')} onSendToMagicTodo={handleSendToMagicTodo} />;
      case 'estimator':
        return <Estimator />;
      case 'consultant':
        return <Consultant onSendToCompiler={handleSendToCompiler} />;
      case 'formalizer':
        return <Formalizer />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="mark">
            <Icons.Sparkles size={14} />
          </div>
          <span className="name">Descomplica<span className="dot">.</span></span>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Ferramentas">
          {tools.map((tool) => {
            const Icon = Icons[tool.icon];
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(isActive ? null : tool.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>Descomplica AI</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <div className="content-inner">
          <AnimatePresence mode="wait">
            {!activeTool ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="dash-hero">
                  <h1>O que voce precisa fazer?</h1>
                  <p className="subtitle">Descreva sua tarefa ou escolha uma ferramenta ao lado.</p>

                  <div className="notebook-input">
                    <textarea
                      ref={commandRef}
                      placeholder="Ex: Preciso organizar o aniversário da minha filha, mas nao sei nem por onde comecar..."
                      value={commandValue}
                      onChange={e => setCommandValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommandSubmit(); } }}
                      rows={5}
                    />
                    <div className="input-actions">
                      <button
                        className="btn btn-primary"
                        onClick={handleCommandSubmit}
                        disabled={!commandValue.trim()}
                      >
                        <Icons.Sparkles size={16} />
                        Transformar em Plano
                      </button>
                    </div>
                  </div>
                </div>

                <div className="tools-section">
                  <div className="tools-section-title">Ferramentas</div>
                  <div className="tool-list">
                    {tools.map((tool) => {
                      const Icon = Icons[tool.icon];
                      return (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTool(tool.id)}
                          className="tool-row"
                          data-accent={tool.accent}
                        >
                          <div className="tool-row-icon">
                            <Icon size={18} />
                          </div>
                          <div className="tool-row-body">
                            <h3>{tool.name}</h3>
                            <p>{tool.description}</p>
                          </div>
                          <div className="tool-row-arrow">
                            <Icons.ArrowRight size={14} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tool-view"
                className="tool-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="tool-view-header">
                  <button
                    onClick={() => setActiveTool(null)}
                    className="back-link"
                    aria-label="Voltar"
                  >
                    <Icons.ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                    Voltar
                  </button>
                  <h2>{activeToolData!.name}</h2>
                  <p>{activeToolData!.description}</p>
                </div>
                {renderTool()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ToastPortal />
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;
