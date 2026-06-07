# Referência do CLI

**Comandos exatos** e o que eles fazem.

| Comando exato que você digita   | Coisa exata que acontece |
|---------------------------------|------------------------|
| `nexus dev --port 3000`        | Inicia servidor dev, observa .nx/.ts, HMR, serve /_nexus/global.css etc. |
| `nexus build`                  | Produz bundles otimizados de server + cliente em `.nexus/output/` |
| `nexus start`                  | Executa o servidor de produção a partir da saída do build |
| `nexus audit`                  | Executa scan CVE OSV + vazamento de segredos + checks de deps não usadas (igual ao build-time) |
| `nexus fix`                    | Aplica fixes seguros automaticamente do audit |
| `nexus studio`                 | Dashboard em tempo real (islands, actions, cache, store) |
| `nexus test`                   | Executa Vitest com helpers para SSR + island + action |
| `nexus routes`                 | Imprime a árvore de rotas resolvida |
| `nexus check`                  | Type-check sem rodar o servidor |

Durante `nexus dev` e `nexus build` você obtém **erros estruturados exatos**:

```text
◆ NX-101  Unclosed {#if}
  src/routes/checkout/+page.nx:18:3
  hint: Add {/if} or use {:else if}
```

`formatCompileError` / `formatCompileWarning` + frames são usados automaticamente pelo CLI e pelo servidor dev.

## nexus.config.ts exato (o que você copia)

```ts
export default {
  server: { port: 3000 },
  security: {
    hardened: true,
    csp: { additionalScriptSrc: [] },
  },
  css: { entry: './src/global.css' },
};
```

Veja as outras páginas desta lista (especialmente security.md para a história exata de hardened + cspNonce, e as novas páginas dedicadas) para mais uso exato de tudo que o CLI conecta. Todos os comandos acima estão implementados em @nexus_js/cli e são os usados para desenvolver e buildar este mesmo site de documentação.
