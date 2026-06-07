# Loja de Estado Global

Uso **exato** de $pretext e store global.

```svelte
<script>
  // acesso reativo exato a dados do servidor que sobreviveram à hidratação
  const user = $pretext.user;
  let theme = $sync('theme', 'light');   // veja runes.md
</script>

<p>Bem-vindo, {user.name}</p>
```

Em load() você retorna o que quiser:

```ts
export async function load(ctx) {
  return {
    user: await getCurrentUser(ctx),
    // fica disponível como $pretext.user no cliente (e pretext.user no servidor)
  };
}
```

Veja navigation.md para o morphing SPA exato que mantém este estado vivo, e islands.md para como as islands o leem/escrevem. A rune $pretext e as regras de mesclagem estão implementadas exatamente no runtime e usadas ao longo dos exemplos do site de docs. O estado nunca se perde durante navegação SPA.

## Store global

```svelte
<script>
  import { createStore } from '@nexus_js/runtime';

  const store = createStore('app', {
    theme: 'light',
    sidebarOpen: false,
  });

  store.subscribe('theme', (value) => {
    document.documentElement.setAttribute('data-theme', value);
  });
</script>
```

## Modos de persistência

| Modo | Comportamento |
|------|---------------|
| `memory` | Apenas em memória (padrão) |
| `session` | Persiste através de navegação SPA |
| `local` | Persiste através de sessões do navegador |

## Sincronização cross-island

Duas islands na mesma página podem compartilhar estado via o store sem prop drilling ou event bubbling.
