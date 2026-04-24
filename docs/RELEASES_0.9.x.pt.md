# Notas de release Nexus 0.9.x (0.9.0 -> 0.9.20)

Consolidado da linha `0.9.x`, versão por versão, usando apenas evidência pública verificável.

## Fontes verificadas

- Versões publicadas no npm: `@nexus_js/cli`, `@nexus_js/server`, `@nexus_js/compiler`, `@nexus_js/graphql`
- Tags no GitHub: `v0.9.20` até `v0.9.12`, além de `v0.9.3`
- `CHANGELOG.md` oficial (entradas explícitas para `0.9.0` e `0.9.3`)
- `RELEASE_NOTES_0.9.3.md`
- Comparação GitHub: `v0.9.3...v0.9.20`

> Observação: algumas versões intermediárias (`0.9.1`, `0.9.2`, `0.9.5`, `0.9.7`, `0.9.9`) não possuem release notes públicas detalhadas. Foram marcadas como **notas públicas limitadas** para evitar suposições.

---

## Matriz por versão

| Versão | Status de evidência | Melhorias documentadas |
|---|---|---|
| `0.9.20` | Alta | Navegação runtime evita reinjetar stylesheets já presentes em `<head>`. |
| `0.9.19` | Alta | Validadores de cache de assets estáticos (`ETag`, `Last-Modified`) + deduplicação de stylesheet SSR no servidor. |
| `0.9.18` | Média | Etapa de publicação/alinhamento de pacotes 0.9.x. |
| `0.9.17` | Alta | Pre-warm de CSS em dev antes do broadcast de reload HMR. |
| `0.9.16` | Alta | Recuperação do build de CSS agregada após erros transitórios de compilação. |
| `0.9.15` | Alta | `/_nexus/styles.css`: `ETag + no-cache` para reduzir FOUC em hard refresh. |
| `0.9.14` | Alta | Alinhamento da linha de versões de pacotes após drift. |
| `0.9.13` | Alta | Publicação da linha com correções de compiler/CLI. |
| `0.9.12` | Alta | Fix no `collectLibUsage` do compiler para parsing misto runtime + `$lib`. |
| `0.9.11` | Alta | Fixes de chunks transitivos `$lib` + rewrite de manifest na saída. |
| `0.9.10` | Alta | Rewrite de `$lib` para `/_nexus/lib/*` + bundles hashed/tree-shaken para islands. |
| `0.9.9` | Baixa | Release de patch na sequência de hardening bridge/tenancy. |
| `0.9.8` | Média | Evolução de tenancy resolver + isolamento bridge/vault namespaces. |
| `0.9.7` | Baixa | Release intermediária de estabilização bridge/tenancy. |
| `0.9.6` | Média | Evolução de bridge seguro / modelo canônico. |
| `0.9.5` | Baixa | Release intermediária de estabilização após 0.9.4. |
| `0.9.4` | Média | Início do ciclo de hardening pós-0.9.3. |
| `0.9.3` | Alta | GraphQL + Legacy Bridge + Deployment Stack. |
| `0.9.2` | Baixa | Etapa de manutenção pré-0.9.3 (sem entrada pública detalhada). |
| `0.9.1` | Baixa | Etapa de manutenção pré-0.9.3 (sem entrada pública detalhada). |
| `0.9.0` | Alta | Marco base da linha 0.9 antes da expansão GraphQL/Bridge. |

---

## Recomendação de atualização

```bash
npm install @nexus_js/cli@0.9.20 @nexus_js/server@0.9.20 @nexus_js/compiler@0.9.20 @nexus_js/graphql@0.9.20
```

