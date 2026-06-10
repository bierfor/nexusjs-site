# Referência do CLI

**Comandos exatos** e o que eles fazem.

| Comando | O que faz |
|---------|-----------|
| `nexus dev` | Inicia servidor dev com HMR e observação de arquivos |
| `nexus build` | Compila a app para produção em `.nexus/output/` |
| `nexus start` | Executa o servidor de produção (requer `NEXUS_SECRET`) |
| `nexus check` | Type-check no projeto sem rodar o servidor |
| `nexus audit` | Executa checks de segurança (scan CVE, vazamento de segredos, deps não usadas) |
| `nexus studio` | Abre o dashboard em tempo real |
| `nexus routes` | Imprime a árvore de rotas resolvida |
| `nexus add` | Adiciona pacotes, rotas ou scaffolding ao projeto |
| `nexus bridge` | Abre o CLI do database bridge |
| `nexus fix` | Auto-correção de lint e formatação |

Durante `nexus dev` e `nexus build` você obtém **erros estruturados exatos**:

```text
◆ NX-101  Unclosed {#if}
  src/routes/checkout/+page.nx:18:3
  hint: Add {/if} or use {:else if}
```

`formatCompileError` / `formatCompileWarning` + frames são usados automaticamente pelo CLI e pelo servidor dev.

## Opções

| Opção | Alias | Descrição |
|-------|-------|-----------|
| `--port` | `-p` | Porta a usar (padrão é `server.port` em `nexus.config.ts` ou `3000`) |
| `--host` | | Host a usar (padrão é `localhost`) |
| `--ci` | | Modo CI para `nexus audit` (não interativo) |
| `--json` | | Saída JSON para `nexus audit` |
| `--fix` | | Auto-fix para `nexus audit` |
| `--dry-run` | | Pré-visualização de mudanças para `nexus fix` |
| `--force` | | Forçar operação para `nexus fix` |
| `--root` | | Caminho raíz do projeto |

Exemplos:

```bash
nexus dev --port 3000
nexus start --host 0.0.0.0
nexus audit --ci --json
nexus fix --dry-run
```

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
