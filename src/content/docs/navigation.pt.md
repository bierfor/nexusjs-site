# Navegação SPA

**Exata** navegação de cliente que parece SPA mas é dirigida pelo servidor.

```svelte
<a href="/about" data-nexus-link>Ir para about</a>

<script>
  // ou imperativamente
  import { goto } from '@nexus_js/runtime';
  goto('/dashboard', { replace: true });
</script>
```

O framework faz um fetch no servidor para a nova página, morph o DOM (preservando estado de islands e $pretext), e atualiza o histórico. Sem bundle de router no lado cliente.

Veja store.md para como $pretext sobrevive ao morph, islands.md para estado que vive dentro de islands, e server-actions.md para actions que retornam `{ redirect: '...' }` (a camada de navegação as respeita).

Tudo acima (data-nexus-link, goto, regras de morphing, preservação de estado) é a implementação exata no runtime usada pelo próprio site de docs. Use-os exatamente como mostrado. As islands mantêm seu estado.

## Links declarativos

Tags `<a>` padrão são interceptadas automaticamente quando `@nexus_js/runtime` está carregado. O framework faz fetch da nova página, morph o DOM, e preserva estado de islands.

## Navegação programática

```ts
import { navigate } from '@nexus_js/runtime';

navigate('/dashboard');
navigate('/dashboard', { replace: true });
```

## Estratégias de prefetch

| Estratégia | Comportamento |
|------------|---------------|
| `hover` | Prefetch no hover do link |
| `visible` | Prefetch quando o link entra no viewport |
| `eager` | Prefetch imediatamente |

## Rotas type-safe

O compilador gera um manifest de rotas que habilita autocompletar e validação para `navigate('/path')`.
