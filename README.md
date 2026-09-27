# Descomplica AI

[![Licença MIT](https://img.shields.io/badge/licença-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vite.dev/)
[![Groq](https://img.shields.io/badge/LLM-Groq-f55241.svg)](https://console.groq.com/)

> Suíte de ferramentas com IA para disfunção executiva, organização de tarefas e comunicação assertiva.

O **Descomplica AI** transforma ideias vagas em planos acionáveis: quebra tarefas grandes em passos pequenos, extrai to-dos de um desabafo, estima tempo de forma realista, analisa decisões com prós e contras e ajusta o tom de textos. Frontend 100% client-side com React 19 + Vite e inferência LLM via Groq.

## 📸 Demonstração

> 📷 Prints de tela ainda não foram adicionados ao repositório. Enquanto isso, rode localmente (seção [🚀 Como usar](#-como-usar)) para ver a aplicação em `http://localhost:3000`.

Fluxo integrado: **Dashboard → Compiler → Magic To-Do**, com atalhos entre ferramentas (Consultant → Compiler, Compiler → Magic To-Do). O Estimator funciona de forma independente para tarefas avulsas.

## ✨ Funcionalidades

| Ferramenta | O que faz | Ideal para |
|---|---|---|
| **Magic To-Do** | Quebra uma tarefa grande em subtarefas com nível de detalhamento ajustável (slider 1–5, padrão 3; no nível 5 inclui até microações como "abrir o navegador"). Estima o tempo de cada etapa com "imposto de transição" de 15–20%, soma tudo, aplica margem de 25% e projeta em dias (base 6h/dia) | Procrastinação, tarefas que parecem grandes demais |
| **Compiler** | Extrai uma lista organizada de tarefas a partir de um texto livre / brain dump e envia a lista para o Magic To-Do | Descarregar a mente e organizar em seguida |
| **Estimator** | Calcula o esforço real de uma tarefa/projeto avulso ("Calcular Esforço Real") e devolve uma estimativa honesta e generosa em texto simples de 5 a 15 linhas | Planejamento rápido de uma tarefa isolada |
| **Consultant** | Analisa um dilema e retorna prós, contras e conclusão pragmática; pode enviar o plano ao Compiler | Decisões, diferentes perspectivas |
| **Formalizer** | Reescreve textos em 9 tons — mais profissional, mais educado, menos agressivo, mais fácil de ler, mais conciso, mais amigável, e-mail formal, grupo de amigos, correção ortográfica gentil — sem markdown nem emojis | E-mails, mensagens profissionais, comunicação difícil |

Recursos transversais:

- Dashboard com campo de comando que envia o texto direto ao Compiler
- Encadeamento entre ferramentas (Compiler → Magic To-Do, Consultant → Compiler)
- Feedback via toasts (`aria-live="polite"`, `role="alert"`) e estados de loading
- Navegação por teclado (`Enter` para enviar, `aria-labels`, foco visível)
- Layout responsivo: sidebar fixa no desktop, barra inferior no mobile
- Animações com Framer Motion e suporte a `prefers-reduced-motion`
- Saída da IA sanitizada: remove tags de raciocínio, markdown pesado e emojis

## 🛠️ Tecnologias

**Frontend**

- [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) (JSX via `react-jsx`, `noEmit`)
- [Vite 6](https://vite.dev/) + `@vitejs/plugin-react`
- [Tailwind CSS](https://tailwindcss.com/) via Play CDN (`cdn.tailwindcss.com` no `index.html`)
- [Framer Motion 13](https://www.framer.com/motion/) para animações
- Design system próprio em CSS variável dentro de `index.html` (tokens de cor, `--font-display: Space Grotesk`, `--font-body: DM Sans`)

**IA**

- [Groq SDK](https://console.groq.com/) (`groq-sdk` 1.6) rodando no browser (`dangerouslyAllowBrowser: true`)
- Modelos com rotação round-robin e fallback: `qwen/qwen3.8-27b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`, `openai/gpt-oss-120b`, `groq/compound-mini`, `groq/compound`
- `response_format: json_object` com retry em texto puro + parsing tolerante (`parseJson` extrai JSON de blocos de código se preciso)

**Ferramentas**

- Node.js 18+ (LTS), npm
- Atalhos Windows: `start.bat`, `build.bat`, `preview.bat`

## 📦 Instalação

**Pré-requisitos**

- Node.js 18 ou superior
- Uma chave gratuita da Groq: https://console.groq.com/keys

```bash
# 1. Clone o repositório
git clone https://github.com/leandro-25/Descomplica_IA.git
cd Descomplica_IA

# 2. Instale as dependências
npm install
```

## ⚙️ Configuração

Crie o arquivo `.env.local` na raiz do projeto:

```env
GROQ_API_KEY=sua_chave_aqui
```

Detalhes importantes:

- O `vite.config.ts` usa `loadEnv` e injeta a chave via `define: { 'process.env.GROQ_API_KEY': ... }` — o Vite não expõe variáveis automaticamente, então o nome deve ser exatamente `GROQ_API_KEY`
- O `.env.local` está coberto pelo `.gitignore` (`*.local`) — nunca commite sua chave
- Por rodar no browser, a chave é visível ao usuário final: use apenas em desenvolvimento/protótipo. Em produção, mova as chamadas para um backend/proxy

Sem a chave, a aplicação abre normalmente, mas as ações de IA falharão com toast de erro.

## 🚀 Como usar

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

No Windows, `start.bat` instala dependências (se ausentes) e inicia o dev server.

O servidor dev sobe em **http://localhost:3000** (`host: 0.0.0.0`, port 3000 no `vite.config.ts`).

**Fluxo sugerido**

1. Escreva um desabafo/brain dump no campo de comando do Dashboard → vai para o **Compiler**
2. O Compiler extrai a lista de tarefas e envia ao **Magic To-Do** (botão "Enviar ao Magic To-Do")
3. No Magic To-Do, ajuste o nível de detalhamento (1–5), quebre as tarefas e peça a estimativa de tempo (por tarefa ou de todas de uma vez) para ver soma, margem de 25% e projeção em dias
4. Para uma tarefa avulsa, use o **Estimator** ("Calcular Esforço Real")
5. Use o **Consultant** para dilemas (envie o plano ao Compiler) e o **Formalizer** para ajustar o tom de mensagens

## 📁 Estrutura do projeto

```
.
├── App.tsx                  # Shell: sidebar, dashboard, comando e roteamento interno
├── index.tsx                # Bootstrap do React
├── index.html               # Tokens CSS, layout, Tailwind CDN, fontes, importmap
├── types.ts                 # ToolType, TaskItem, ConsultantResult, ChefRecipe
├── components/
│   ├── MagicTodo.tsx        # Quebra de tarefas + slider de detalhamento (1–5)
│   ├── Compiler.tsx         # Brain dump → lista de tarefas → Magic To-Do
│   ├── Estimator.tsx        # Esforço real de uma tarefa avulsa (texto)
│   ├── Consultant.tsx       # Prós / contras / conclusão → Compiler
│   ├── Formalizer.tsx       # 9 tons de reescrita
│   └── icons.tsx            # Ícones SVG
├── services/
│   └── groqService.ts       # Cliente Groq, rotação de modelos, prompts, sanitização
├── context/
│   ├── ToastContext.tsx     # ToastProvider + toasts acessíveis
│   └── index.ts             # Exportações (useToast)
├── vite.config.ts           # Porta 3000, alias @, env GROQ_API_KEY
├── tsconfig.json            # TypeScript (ES2022, react-jsx, noEmit)
├── package.json             # Scripts (dev/build/preview) e dependências
├── start.bat / build.bat / preview.bat   # Atalhos Windows
├── metadata.json            # Metadados do projeto
├── .agents/skills/          # Skills locais de editor/agentes
├── LICENSE                  # Licença MIT
├── README.md                # Esta documentação
└── .env.local               # GROQ_API_KEY (não commitar)
```

> A aplicação não usa diretório `src/` — os arquivos ficam na raiz. Alias `@` aponta para a raiz do projeto.

## 🧪 Testes

**Ainda não há testes automatizados.** O projeto não possui suíte de testes, linter configurado nem CI — os scripts disponíveis são apenas `dev`, `build` e `preview`.

Verificação manual recomendada antes de cada contribuição:

```bash
npx tsc --noEmit   # checagem de tipos (tsconfig já está com noEmit)
npm run build      # garante que o build de produção passa
```

Se quiser adicionar testes, sugestões de próximo passo: `Vitest` + `@testing-library/react` para os componentes, com `npm i -D vitest`.

## 🚢 Deploy

Não há pipeline de CI/CD configurado (sem `.github/workflows`, Dockerfile ou arquivos de config de hospedagem).

O build é estático (`vite build` → pasta `dist/`), então qualquer host de estáticos serve:

```bash
npm run build
npm run preview   # confira o build localmente antes de subir
```

Opções comuns:

- **Vercel / Netlify**: framework "Vite", build `npm run build`, output `dist`
- **GitHub Pages**: publique a pasta `dist` (atenção ao `base` do Vite, se o repo for `username.github.io/Descomplica_IA`)

⚠️ **Antes de um deploy público**: a `GROQ_API_KEY` é embutida no bundle. Configure a variável no painel do provedor e troque as chamadas por um proxy server-side para não expor a chave.

## 🗺️ Roadmap

Itens planejados (ainda não implementados):

- [ ] Backend/proxy para as chamadas da Groq (esconder a chave em produção)
- [ ] Persistência local das tarefas (`localStorage`) — hoje o estado é perdido ao recarregar
- [ ] Suíte de testes (Vitest + Testing Library) e linter (ESLint/Prettier)
- [ ] CI com build + typecheck automáticos no GitHub Actions
- [ ] Screenshots/GIFs do fluxo de uso na seção de demonstração
- [ ] Estimativa de tempo automática ao quebrar tarefas (hoje é disparada por clique)
- [ ] Modo offline / PWA e carregamento da chave via variáveis de ambiente no deploy
- [ ] Publicar a primeira versão estável (`v0.1.0`) no GitHub

## 🤝 Contribuindo

Contribuições são bem-vindas sob a licença MIT do projeto. Fluxo sugerido:

1. Faça um fork e crie uma branch: `git checkout -b feature/minha-melhoria`
2. Instale as dependências: `npm install`
3. Configure `.env.local` com sua `GROQ_API_KEY`
4. Faça suas alterações seguindo o estilo do projeto (componentes em TSX, prompts em Português-BR em `groqService.ts`, feedback via `useToast`)
5. Valide: `npx tsc --noEmit` e `npm run build`
6. Abra um Pull Request descrevendo o problema e a solução

Dicas de estilo:

- Prompts e textos de UI em Português do Brasil
- Reaproveite os tokens CSS do `index.html` e as classes utilitárias do Tailwind
- Sempre retorne feedback ao usuário via toast (sucesso/erro)

## 📄 Licença

Este projeto está sob a licença **MIT** — veja o arquivo [`LICENSE`](./LICENSE) para os detalhes.

Projeto acadêmico — **FATEC**. Copyright (c) 2026 Leandro.
