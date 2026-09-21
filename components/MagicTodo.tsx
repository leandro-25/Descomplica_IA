import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groqService } from '../services/groqService';
import { TaskItem } from '../types';
import { Icons } from './icons';
import { useToast } from '../context';

interface MagicTodoProps {
  preloadTasks?: string[];
  onClearPreload?: () => void;
}

export const MagicTodo: React.FC<MagicTodoProps> = ({ preloadTasks, onClearPreload }) => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [spiciness, setSpiciness] = useState(3);
  const [isEstimatingAll, setIsEstimatingAll] = useState(false);

  useEffect(() => {
    if (preloadTasks && preloadTasks.length > 0) {
      const newTasks: TaskItem[] = preloadTasks.map(text => ({
        id: Math.random().toString(36).substring(2, 9),
        text: text.trim(),
        isCompleted: false,
        isExpanded: true,
      }));
      setTasks(prev => [...newTasks, ...prev]);
      if (onClearPreload) onClearPreload();
    }
  }, [preloadTasks, onClearPreload]);

  const addTask = useCallback((text: string) => {
    if (!text.trim()) return;
    const newTask: TaskItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: text.trim(),
      isCompleted: false,
      isExpanded: true,
    };
    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
  }, []);

  const updateTaskRecursive = useCallback((list: TaskItem[], id: string, updater: (task: TaskItem) => TaskItem): TaskItem[] => {
    return list.map(task => {
      if (task.id === id) return updater(task);
      if (task.subTasks) {
        return { ...task, subTasks: updateTaskRecursive(task.subTasks, id, updater) };
      }
      return task;
    });
  }, []);

  const removeTaskRecursive = useCallback((list: TaskItem[], id: string): TaskItem[] => {
    return list
      .filter(task => task.id !== id)
      .map(task => ({
        ...task,
        subTasks: task.subTasks ? removeTaskRecursive(task.subTasks, id) : undefined,
      }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => updateTaskRecursive(prev, id, t => ({ ...t, isCompleted: !t.isCompleted })));
  }, [updateTaskRecursive]);

  const toggleExpand = useCallback((id: string) => {
    setTasks(prev => updateTaskRecursive(prev, id, t => ({ ...t, isExpanded: !t.isExpanded })));
  }, [updateTaskRecursive]);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => removeTaskRecursive(prev, id));
  }, [removeTaskRecursive]);

  const handleMagic = useCallback(async (id: string, text: string) => {
    setTasks(prev => updateTaskRecursive(prev, id, t => ({ ...t, isMagicLoading: true, isExpanded: true })));
    try {
      const subTasksTexts = await groqService.breakDownTask(text, spiciness);
      const newSubTasks: TaskItem[] = subTasksTexts.map(t => ({
        id: Math.random().toString(36).substring(2, 9),
        text: t,
        isCompleted: false,
        isExpanded: true,
      }));
      setTasks(prev => updateTaskRecursive(prev, id, t => ({
        ...t,
        subTasks: [...(t.subTasks || []), ...newSubTasks],
        isMagicLoading: false,
      })));
      showToast(`${subTasksTexts.length} subtarefas criadas`, 'success');
    } catch (error) {
      console.error(error);
      setTasks(prev => updateTaskRecursive(prev, id, t => ({ ...t, isMagicLoading: false })));
      showToast('Erro ao dividir tarefa', 'error');
    }
  }, [spiciness, updateTaskRecursive, showToast]);

  const estimateTimeForSingleTask = useCallback(async (mainTask: TaskItem) => {
    setTasks(prev => updateTaskRecursive(prev, mainTask.id, t => ({
      ...t,
      isMagicLoading: true,
      subTasks: t.subTasks?.map(st => ({ ...st, isMagicLoading: true })),
    })));
    try {
      const subtaskTexts = mainTask.subTasks?.map(st => st.text) || [];
      const result = await groqService.estimateTaskTimeDetailed(mainTask.text, subtaskTexts);
      setTasks(prev => updateTaskRecursive(prev, mainTask.id, t => {
        const updatedParent = {
          ...t,
          estimatedMinutes: result.mainMinutes,
          timeLabel: result.mainLabel,
          isMagicLoading: false,
        };
        if (updatedParent.subTasks && result.subtasksEstimates.length === updatedParent.subTasks.length) {
          updatedParent.subTasks = updatedParent.subTasks.map((st, index) => ({
            ...st,
            estimatedMinutes: result.subtasksEstimates[index].minutes,
            timeLabel: result.subtasksEstimates[index].label,
            isMagicLoading: false,
          }));
        } else if (updatedParent.subTasks) {
          updatedParent.subTasks = updatedParent.subTasks.map(st => ({ ...st, isMagicLoading: false }));
        }
        return updatedParent;
      }));
      showToast('Tempo estimado calculado', 'success');
    } catch (error) {
      console.error(error);
      setTasks(prev => updateTaskRecursive(prev, mainTask.id, t => ({
        ...t,
        isMagicLoading: false,
        subTasks: t.subTasks?.map(st => ({ ...st, isMagicLoading: false })),
      })));
      showToast('Erro ao estimar tempo', 'error');
    }
  }, [updateTaskRecursive, showToast]);

  const handleEstimateAll = useCallback(async () => {
    if (tasks.length === 0) return;
    setIsEstimatingAll(true);
    await Promise.all(tasks.map(task => estimateTimeForSingleTask(task)));
    setIsEstimatingAll(false);
  }, [tasks, estimateTimeForSingleTask]);

  const totalMinutes = useMemo(() => {
    let total = 0;
    tasks.forEach(task => { total += task.estimatedMinutes || 0; });
    return total;
  }, [tasks]);

  const totalWithMargin = Math.round(totalMinutes * 1.25);

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`;
    return `${m} min`;
  };

  const getDaysWorkload = (mins: number) => {
    const MINUTES_PER_DAY = 360;
    const days = mins / MINUTES_PER_DAY;
    if (days < 0.1) return "< 1 hora";
    if (days < 1) return `${(days * 6).toFixed(1)}h de esforço`;
    return `${days.toFixed(1)} dias de foco`;
  };

  const TaskRow: React.FC<{ task: TaskItem; level?: number }> = React.memo(({ task, level = 0 }) => {
    const hasSubtasks = task.subTasks && task.subTasks.length > 0;

    return (
      <div className={`flex flex-col ${level > 0 ? 'ml-6 mt-2' : 'mb-3'}`}>
        <div
          className={`group flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border ${
            level === 0
              ? 'bg-white border-[var(--border)] shadow-sm'
              : 'bg-transparent border-transparent hover:bg-[var(--paper-warm)]'
          } ${task.isCompleted ? 'opacity-40 grayscale' : ''}`}
        >
          <button
            onClick={() => toggleExpand(task.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--paper-deep)] transition-colors ${
              !hasSubtasks && !task.isMagicLoading ? 'invisible' : ''
            }`}
            disabled={!hasSubtasks && !task.isMagicLoading}
            aria-label={task.isExpanded ? 'Recolher' : 'Expandir'}
          >
            <Icons.ChevronDown
              size={14}
              className={`transition-transform duration-200 ${task.isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          <label className="shrink-0 cursor-pointer" htmlFor={`task-${task.id}`}>
            <input
              id={`task-${task.id}`}
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask(task.id)}
              className="sr-only peer"
            />
            <span className={`checkbox-custom ${task.isCompleted ? 'checked' : ''}`}>
              {task.isCompleted && <Icons.CheckCircle2 size={12} className="check-icon" />}
            </span>
          </label>

          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 overflow-hidden min-w-0">
            <span className={`text-sm md:text-base truncate font-medium ${task.isCompleted ? 'line-through text-[var(--ink-4)]' : 'text-[var(--ink)]'}`}>
              {task.text}
            </span>
            {task.timeLabel && !task.isMagicLoading && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--gold-soft)] text-[var(--gold)] text-[11px] font-semibold rounded-md shrink-0">
                <Icons.Clock size={10} />
                {task.timeLabel}
              </span>
            )}
            {task.isMagicLoading && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--paper-warm)] text-[var(--ink-4)] text-[11px] font-semibold rounded-md shrink-0">
                <Icons.Loader2 size={10} className="animate-spin" />
                Processando...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {level === 0 && (
              <button
                onClick={() => estimateTimeForSingleTask(task)}
                disabled={task.isMagicLoading}
                className="btn btn-icon btn-ghost text-[var(--gold)] hover:bg-[var(--gold-soft)]"
                title="Estimar tempo"
                aria-label="Estimar tempo desta tarefa"
              >
                <Icons.Timer size={16} />
              </button>
            )}
            <button
              onClick={() => handleMagic(task.id, task.text)}
              disabled={task.isMagicLoading}
              className="btn btn-icon btn-ghost text-[var(--gold)] hover:bg-[var(--gold-soft)]"
              title="Dividir tarefa com IA"
              aria-label="Dividir tarefa com IA"
            >
              <Icons.Wand2 size={16} />
            </button>
            <button
              onClick={() => removeTask(task.id)}
              className="btn btn-icon btn-ghost text-[var(--ink-4)] hover:text-[var(--error)] hover:bg-red-50"
              title="Remover tarefa"
              aria-label="Remover tarefa"
            >
              <Icons.Trash2 size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {task.isExpanded && hasSubtasks && (
            <motion.div
              className="border-l-2 border-[var(--gold)]/20 ml-3 pl-1 mt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {task.subTasks!.map(sub => <TaskRow key={sub.id} task={sub} level={level + 1} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  });

  TaskRow.displayName = 'TaskRow';

  return (
    <div className="space-y-6 relative">
      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-3 p-1.5 bg-white rounded-xl border border-[var(--border)] shadow-sm">
        <input
          type="text"
          className="flex-1 px-6 py-4 rounded-lg bg-transparent border-none text-lg font-medium placeholder-[var(--ink-4)] focus:outline-none focus:ring-0"
          placeholder="O que você precisa fazer?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask(inputValue)}
        />
        <button
          onClick={() => addTask(inputValue)}
          className="btn btn-primary btn-lg px-8"
          disabled={!inputValue.trim()}
        >
          <Icons.Plus size={20} />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--paper-warm)] p-4 rounded-xl border border-[var(--border)]">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="flex items-center gap-2 text-[var(--ink-3)] font-semibold text-xs shrink-0">
            <Icons.Flame size={14} className="text-[var(--gold)]" />
            Detalhes
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={spiciness}
            onChange={e => setSpiciness(parseInt(e.target.value))}
            className="slider flex-1"
            aria-label="Nível de detalhamento"
          />
          <span className="font-bold text-[var(--gold)] text-lg w-6 text-center">{spiciness}</span>
        </div>

        {tasks.length > 0 && (
          <button
            onClick={handleEstimateAll}
            disabled={isEstimatingAll}
            className="btn btn-secondary px-6 py-3"
          >
            {isEstimatingAll ? (
              <>
                <Icons.Loader2 size={14} className="animate-spin" />
                Estimando...
              </>
            ) : (
              <>
                <Icons.Zap size={14} className="text-[var(--gold)]" />
                <span className="hidden sm:inline">Estimar Todos</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-1">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Icons.Wand2 size={48} strokeWidth={1} className="text-[var(--ink-4)]" />
            </div>
            <p className="empty-title">Sua jornada começa com o primeiro passo</p>
            <p className="empty-desc">Adicione uma tarefa acima e ela será dividida em passos gerenciáveis pela IA.</p>
          </div>
        )}
      </div>

      {/* Total Summary */}
      {totalMinutes > 0 && (
        <div className="card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center md:divide-x md:divide-[var(--border)]">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-[var(--paper-warm)] rounded-lg flex items-center justify-center text-[var(--ink-3)] mx-auto md:mx-0">
                <Icons.Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--ink-3)] mb-1">Tempo Bruto</p>
                <p className="text-2xl font-bold text-[var(--ink)]">{formatMinutes(totalMinutes)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center md:text-left md:px-4">
              <div className="w-12 h-12 bg-[var(--gold-soft)] rounded-lg flex items-center justify-center text-[var(--gold)] mx-auto md:mx-0">
                <Icons.ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--gold)] mb-1">Seguro (+25%)</p>
                <p className="text-2xl font-bold text-[var(--gold)]">{formatMinutes(totalWithMargin)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center md:text-left md:px-4">
              <div className="w-12 h-12 bg-[var(--paper-warm)] rounded-lg flex items-center justify-center text-[var(--ink-4)] mx-auto md:mx-0">
                <Icons.CalendarDays size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--ink-3)] mb-1">Carga de Foco</p>
                <p className="text-2xl font-bold text-[var(--ink)]/80">~ {getDaysWorkload(totalWithMargin)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
