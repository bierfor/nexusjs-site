# Comparação de Frameworks

Como o Nexus se compara com os frameworks full-stack mainstream em 2026.

| Recurso                          | Nexus                            | Next.js                          | SvelteKit               | Astro                  | Vencedor para a maioria |
|----------------------------------|----------------------------------|----------------------------------|-------------------------|------------------------|-------------------------|
| **Arquitetura de Ilhas**         | ✅ Nativa + first-class          | ❌ Não (React em todo lugar)    | ⚠️ Parcial             | ✅ Excelente           | **Nexus / Astro**      |
| **Zero JS por padrão**           | ✅ Sim                           | ❌ Não                          | ⚠️ Parcial             | ✅ Sim                 | **Nexus / Astro**      |
| **Tamanho de bundle (típico)**   | Muito pequeno (Runes + islands)  | Imposto React (mesmo com RSC)   | Pequeno                | Muito pequeno          | **Nexus**              |
| **Modelo de reatividade**        | ✅ Svelte 5 Runes (excelente)    | React (ou compiler)             | Svelte 5 Runes         | Agnóstico ao framework | **Nexus**              |
| **Modelo de carregamento de dados** | ✅ Pretext (explícito, mesclado) | Server Components (confuso)     | funções load()       | Misto                  | **Nexus**              |
| **Segurança incorporada**        | ✅ CSP, CSRF, Vault, Shield, rate limiting, audit | Quase nenhuma (você traz a sua) | Básica                 | Básica                 | **Nexus (de longe)**   |
| **DX de Conteúdo / Markdown**    | ✅ @nexus_js/content (coleções, i18n, plurais, shiki, watch) | Bom (mas geralmente você adiciona MDX + libs) | Bom               | Excelente (content-first) | **Nexus** (após pacote content) |
| **Server Actions**               | ✅ Nativo + seguro por padrão    | ✅ Sim                          | ✅ Sim                 | Limitado               | Nexus (vantagem segurança) |
| **Metadata / SEO**               | Bom (melhorando rápido)          | Excelente (generateMetadata, etc.) | Muito bom             | Excelente              | Next.js (por enquanto) |
| **Otimização de Imagem + Fonte** | Bom (@nexus_js/assets)           | Excelente (first class)         | Bom                    | Excelente              | Next.js / Astro        |
| **Clareza do modelo mental**     | ✅ Explícito (load + pretext)    | ❌ Complexo ("onde isso roda?") | ✅ Limpo              | ✅ Limpo               | **Nexus / SvelteKit**  |
| **Experiência dev e erros**      | Melhorando                       | Muito polido                    | Muito bom              | Excelente              | Next.js (atualmente)   |
| **Ecossistema e contratação**    | Pequeno mas crescendo            | Massivo                         | Médio                  | Crescendo rápido       | Next.js                |
| **Multi-tenant / Enterprise**    | ✅ Fortalezas nativas            | Possível mas glue code          | Possível               | Limitado               | **Nexus**              |

## O Posicionamento Honesto (2026)

**Escolha Next.js se:**
- Você precisa do maior ecossistema React do mundo.
- Seu time já é expert em React e não quer mudar.
- Quer a opção "mais segura" em termos de maturidade e contratação.

**Escolha Nexus se quiser:**
- **Performance real** sem ter que brigar contra o framework (Islands + Runes).
- **Segurança por padrão** em vez de ter que adicionar depois.
- Um modelo mental **mais simples e explícito** que Server Components + caching mágico (use `load()` + `pretext`).
- A melhor experiência possível para sites de conteúdo + um pouco de interatividade (graças a `@nexus_js/content`: coleções, headings para TOC, plurais, async render, watch).
- Excelente DX de erros em compile time (structured CompileError + pretty formatters with frames) — veja 0.9.30 em releases.
- Escapar do "React tax" sem abrir mão de uma grande experiência de componentes.
- Metadata/SEO fácil via `load() { head: {...} }` com injeção automática (request-scoped).

Nexus não tenta ser "Next.js mas com Svelte".  
**Nexus é o que o Next.js deveria ter sido** se tivesse priorizado Islands + segurança + simplicidade mental desde o dia 1.

---

**Atualizado junho 2026** depois da criação de `@nexus_js/content` e o dogfooding completo do site oficial de documentação.
