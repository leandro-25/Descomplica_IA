
export type ToolType = 'magic-todo' | 'compiler' | 'estimator' | 'consultant' | 'formalizer';

export interface TaskItem {
  id: string;
  text: string;
  isCompleted: boolean;
  subTasks?: TaskItem[];
  isMagicLoading?: boolean;
  isExpanded?: boolean;
  estimatedMinutes?: number;
  timeLabel?: string;
}

export interface ConsultantResult {
  pros: string[];
  cons: string[];
  conclusion: string;
}

/**
 * Interface for the recipe tool output
 */
export interface ChefRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}
