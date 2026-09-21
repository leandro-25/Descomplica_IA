import Groq from 'groq-sdk';
import { ConsultantResult } from '../types';

const MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-120b',
  'groq/compound-mini',
  'groq/compound',
];

let rotation = 0;
const nextModel = () => MODELS[rotation++ % MODELS.length];

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function parseJson<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1]) as T;
      } catch { /* ignora */ }
    }
    return fallback;
  }
}

function cleanMarkdown(input: string): string {
  return input
    .replace(/<\s*thinking[\s\S]*?<\s*\/\s*thinking\s*>/gi, '')
    .replace(/<\s*\/?\s*think\s*>/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/(^|\s)---+(\s|$)/gm, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripThinking(text: string): string {
  return text
    .replace(/<\s*thinking[\s\S]*?<\s*\/\s*thinking\s*>/gi, '')
    .replace(/<\s*\/?\s*think\s*>/gi, '')
    .trim();
}

async function generate(prompt: string, json = false): Promise<string> {
  const messages = [{ role: 'user', content: prompt }];
  const model = nextModel();

  const tryCall = (withJson: boolean) =>
    client.chat.completions.create({
      model,
      messages,
      temperature: 0.8,
      ...(model.startsWith('qwen/') ? { reasoning_effort: 'none' } : {}),
      ...(withJson ? { response_format: { type: 'json_object' } } : {}),
    });

  try {
    const response = await tryCall(json);
    return stripThinking(response.choices[0]?.message?.content || '');
  } catch (error) {
    if (json) {
      const response = await tryCall(false);
      return stripThinking(response.choices[0]?.message?.content || '');
    }
    throw error;
  }
}

export const groqService = {
  async breakDownTask(task: string, spiciness: number): Promise<string[]> {
    const prompt = `Você é um assistente de disfunção executiva.
      Divida a tarefa: "${task}" em etapas menores.
      Nível de detalhamento: ${spiciness}/5.
      No nível 5, inclua até os mínimos detalhes (ex: "abrir o navegador", "pegar a chave").
      Responda em Português do Brasil apenas com um objeto JSON nesta exata forma:
      {"steps": ["passo 1", "passo 2", ...]}`;
    const result = parseJson<{ steps?: string[] }>(await generate(prompt, true), {});
    return Array.isArray(result) ? result : (result.steps || []);
  },

  async estimateTaskTimeDetailed(task: string, subtasks: string[] = []): Promise<{
    mainMinutes: number;
    mainLabel: string;
    subtasksEstimates: { minutes: number; label: string }[];
  }> {
    const subCtx = subtasks.length > 0 ? `Etapas: ${subtasks.join(', ')}` : 'Sem etapas definidas.';
    const prompt = `Estime o tempo para: "${task}".
      ${subCtx}

      REGRAS PARA REALISMO (MUITO IMPORTANTE):
      1. O tempo total (mainMinutes) DEVE ser a soma de todas as sub-tarefas mais um "Imposto de Transição" de 15 a 20%.
      2. Dividir tarefas AUMENTA o tempo total real, pois começar e parar gasta energia mental.
      3. Seja extremamente generoso com o tempo (neurodivergentes costumam subestimar por 2x).
      4. JAMAIS repita o nome da tarefa nos labels. Use apenas durações formatadas (ex: "1h 20m").

      Responda em JSON com as chaves: mainMinutes (int), mainLabel (string), subtasksEstimates (array de { minutes: int, label: string }).`;
    return parseJson(await generate(prompt, true), {
      mainMinutes: 0,
      mainLabel: '—',
      subtasksEstimates: [],
    });
  },

  async judgeTone(text: string): Promise<ConsultantResult> {
    const prompt = `Analise o dilema: "${text}". Seja um consultor pragmático e acolhedor.
      Responda em JSON com as chaves: pros (array de strings), cons (array de strings), conclusion (string).`;
    return parseJson(await generate(prompt, true), { pros: [], cons: [], conclusion: '' });
  },

  async estimateTime(task: string): Promise<string> {
    const prompt = `Dê uma estimativa de tempo honesta e generosa para: "${task}" em Português-BR.
      FORMATO OBRIGATÓRIO (economia de tokens):
      - Resposta clara e direta, entre 5 e 15 linhas.
      - Apenas texto simples, lista curta ou tabela pequena quando realmente ajudar.
      - Sem emojis, sem markdown pesado, sem headings, sem "por quê?" em tabela.
      Exemplo de formato:
      Estimativa total: 2 a 3 horas.
      Divisão: revisão do código (~30 min), organização geral...`;
    return generate(prompt);
  },

  async compileTasks(brainDump: string): Promise<string[]> {
    const prompt = `Extraia uma lista de tarefas organizada deste texto: "${brainDump}"
      Responda em Português do Brasil apenas com um objeto JSON nesta exata forma:
      {"tasks": ["tarefa 1", "tarefa 2", ...]}`;
    const result = parseJson<{ tasks?: string[] }>(await generate(prompt, true), {});
    return Array.isArray(result) ? result : (result.tasks || []);
  },

  async formalizeText(text: string, tone: string): Promise<string> {
    const emailMode = tone.toLowerCase().includes('e-mail');
    const prompt = `Reescreva o texto abaixo para soar ${tone}. Mantenha o mesmo sentido e as informações originais.
      - Responda APENAS com o texto reescrito. Nada de introduções como "Aqui está uma versão", explicações, dicas ou observações depois.
      - Não use markdown (sem #, **, *cursiva*, tabelas) e sem emojis.
      ${emailMode
        ? '- Como é um e-mail, escreva um e-mail completo: assunto, saudação, corpo e despedida, sem aspas nem símbolos de markdown.'
        : '- Escreva em parágrafo(s) normal(is) e direto(is).'}
      Texto original: "${text}"`;
    return cleanMarkdown((await generate(prompt)).trim());
  },
};