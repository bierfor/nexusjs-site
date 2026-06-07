Nexus requer Node.js ≥ 22 e pnpm ≥ 9. Este guia mostra **exatamente** os comandos e arquivos que você escreve.

### Pré-requisitos exatos (copie estes)

```bash
node -v   # deve ser 22+
pnpm -v   # deve ser 9+
```

Se faltarem:

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

### Passo a passo: criar e executar (sessão de terminal exata)

```bash
npm create @nexus_js/nexus my-app
cd my-app
pnpm install
pnpm dev
```

Abra http://localhost:3000. Agora você tem um app rodando usando features 0.9.30+ (load/pretext, islands, segurança hardened).

### Arquivos gerados exatos que você verá/editará

- `nexus.config.ts` (edite para porta, CSP, css.entry)
- `src/routes/+page.nx` (sua primeira página — veja quickstart.md para o conteúdo exato)
- `src/routes/+layout.nx` (layout raiz com <!--nexus:head--> e <!--nexus:slot-->)
- `src/global.css` (entrada Tailwind — compilado auto em dev)

### Build de produção (comandos exatos + env requerido)

```bash
pnpm build
NEXUS_SECRET=seu-segredo-de-32-caracteres-aqui pnpm start
```

A saída está em `.nexus/output/`. O `NEXUS_SECRET` é **obrigatório** para modo hardened (assinatura de cookies, etc.). Nunca commite.

### Erros comuns exatos e fixes (copie estes)

- `NEXUS_SECRET is required` → `export NEXUS_SECRET=seu-segredo-de-32-caracteres-aqui` (ou defina no env da plataforma). Isso é obrigatório com `hardened: true`.
- Porta em uso → edite `nexus.config.ts` exatamente:
  ```ts
  export default { server: { port: 3001 } };
  ```
- Estilos não aparecem após refresh → certifique-se de ter `src/global.css` e que esteja declarada:
  ```ts
  export default { css: { entry: './src/global.css' } };
  ```
  Então `pnpm dev` a servirá em `/_nexus/global.css`.

Veja quickstart.md (o primeiro .nx exato que você deve criar), routing.md, server-actions.md, e todas as outras páginas nesta lista para o uso completo, preciso e copy-paste de cada parte do framework. Tudo aqui usa apenas padrões em modo correto.
