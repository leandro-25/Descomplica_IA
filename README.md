# Descomplica AI

> Suíte de ferramentas com IA para disfunção executiva, organização de tarefas e comunicação assertiva.

O **Descomplica AI** ajuda a sair do "não sei por onde começar" e transformar ideias vagas em planos acionáveis. Ele quebra tarefas grandes em passos pequenos, extrai to-dos de um desabafo, estima tempo de forma realista, analisa decisões com prós e contras e ajusta o tom de textos.

## ✨ Ferramentas

| Ferramenta | O que faz | Ideal para |
|---|---|---|
| **Magic To-Do** | Quebra uma tarefa grande em subtarefas com nível de detalhamento ajustável (1–5), com estimativa de tempo por etapa | Procrastinação, tarefas que parecem grandes demais |
| **Compiler** | Extrai uma lista organizada de tarefas a partir de um texto livre / brain dump e envia para o Magic To-Do | Descarregar a mente e organizar em seguida |
| **Estimator** | Calcula estimativas de tempo generosas e realistas, com soma das subtarefas + imposto de transição (15–20%) | Planejamento que costuma subestimar tempo |
| **Consultant** | Analisa um dilema e retorna prós, contras e conclusão pragmática e acolhedora | Decisões, diferentes perspectivas |
| **Formalizer** | Reescreve textos em 9 tons (profissional, educado, conciso, e-mail formal, correção gentil, etc.), sem markdown nem emojis | E-mails, mensagens profissionais, comunicação difícil |

Fluxo integrado: Dashboard → Compiler → Magic To-Do → Estimator. O Consultant pode enviar o plano para o Compiler, e o Compiler pode enviar tarefas para o Magic To-Do.

## 🧱 Stack

- **React 19 + TypeScript + Vite 6**
- **Tailwind CSS + Framer Motion** (UI responsiva, sidebar desktop / bottom-bar mobile, toasts, skeletons, `prefers-reduced-motion`)
- **Groq SDK (`groq-sdk`)** para inferência LLM no browser
- Design system próprio em `index.html` (tokens de cor, tipografia Space Grotesk + DM Sans)

## 🤖 IA — Modelos e resiliência

`services/groqService.ts` centraliza todas as chamadas:

- Rotação automática com fallback entre modelos:
  `qwen/qwen3.8-27b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`, `openai/gpt-oss-120b`, `groq/compound-mini`, `groq/compound`
- `response_format: json_object` com fallback para texto + parsing tolerante (`parseJson`)
- Sanitização de saída (`cleanMarkdown`, `stripThinking`): remove `<think>`, markdown pesado e emojis
- Prompts em Português-BR com regras explícitas de realismo (Estimator) e formato (Formalizer)

## 🚀 Como rodar localmente

### Pré-requisitos

- **Node.js 18+** (recomendado LTS)
- Uma **GROQ_API_KEY** gratuita em https://console.groq.com/keys

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a chave da API

Crie/edite o arquivo `.env.local` na raiz:

```env
GROQ_API_KEY=sua_chave_aqui
```

> O `vite.config.ts` expõe a chave via `process.env.GROQ_API_KEY` com `loadEnv` e habilita `dangerouslyAllowBrowser: true` no SDK. **Uso recomendado apenas para desenvolvimento/protótipo** — em produção, mova as chamadas para um backend/proxy para não expor a chave.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

### Outros scripts

```bash
npm run build    # build de produção (saída em dist/)
npm run preview  # preview local do build
```

No Windows há também atalhos `start.bat`, `build.bat` e `preview.bat`.

## 📁 Estrutura do projeto

```
.
├── App.tsx                 # Shell: sidebar, dashboard, roteamento interno das ferramentas
├── index.tsx               # Bootstrap React
├── index.html              # Tokens CSS, layout, importmap
├── types.ts                # ToolType, TaskItem, ConsultantResult
├── components/
│   ├── MagicTodo.tsx       # Quebra de tarefas + estimativas
│   ├── Compiler.tsx        # Brain dump → lista de tarefas
│   ├── Estimator.tsx       # Estimativa de tempo detalhada
│   ├── Consultant.tsx      # Prós / contras / conclusão
│   ├── Formalizer.tsx      # Ajuste de tom
│   └── icons.tsx           # Ícones
├── services/
│   └── groqService.ts      # Cliente Groq, rotação de modelos, prompts
├── context/                # ToastProvider / ToastPortal
├── vite.config.ts          # Vite + React + env GROQ_API_KEY
└── .env.local              # GROQ_API_KEY (não commitar)
```

## ♿ UX e acessibilidade

- Navegação por teclado, `aria-labels`, foco visível
- Feedback via toasts de sucesso/erro
- Estados vazios, loading e skeletons
- Layout responsivo: sidebar fixa no desktop, barra inferior no mobile

## 🔒 Segurança

- Não commite o `.env.local` (já previsto no `.gitignore`)
- Para deploy público, use variáveis de ambiente do provedor e um proxy server-side para a Groq

## 📄 Licença

Projeto acadêmico — FATEC. Defina uma licença (ex.: MIT) antes de publicar.
