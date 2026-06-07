# Assets — Imagens e Fontes

**Uso exato** do pipeline de imagens/fontes zero-JS. Importe de `@nexus_js/assets` e interpole o resultado diretamente em qualquer template .nx. O helper roda no servidor durante o render.

## Uso básico exato de Image() (a linha que você escreve)

```svelte
---
import { Image } from '@nexus_js/assets';
---

{Image({ 
  src: '/hero.jpg', 
  alt: 'Hero image', 
  width: 1200, 
  height: 600 
})}
```

**Exatamente o que isso produz (o HTML que o framework emite):**

```html
<picture>
  <source type="image/avif" srcset="/_nexus/image/... .avif 320w, ... 640w, ..." sizes="...">
  <source type="image/webp" ...>
  <img src="/_nexus/image/... .jpg" width="1200" height="600" alt="Hero image" loading="lazy" decoding="async">
</picture>
```

O otimizador (chamado durante SSR) cria as variantes responsivas on the fly (ou do cache) e retorna o elemento pronto para uso.

### Modo fill / hero exato (imagens estilo background)

```svelte
{Image({ 
  src: '/hero.jpg', 
  alt: '', 
  width: 1920, 
  height: 1080, 
  fill: true,           // torna absolute + object-cover
  class: 'absolute inset-0' 
})}
```

### Dimensões dinâmicas exatas do filesystem (o padrão load())

```ts
// no seu +page.nx ou layout
import { getImageDimensions } from '@nexus_js/assets';
import { resolve } from 'node:path';

export async function load(ctx) {
  const publicDir = resolve(process.cwd(), 'public');
  const dims = await getImageDimensions('/uploads/photo.jpg', publicDir);

  return {
    photo: {
      src: '/uploads/photo.jpg',
      alt: 'User photo',
      ...dims,           // { width, height }
    },
  };
}
```

Então no template:

```svelte
{Image({ 
  src: pretext.photo.src, 
  alt: pretext.photo.alt, 
  width: pretext.photo.width, 
  height: pretext.photo.height 
})}
```

### Uso exato sem otimizar / remoto / SVG

```svelte
<!-- Pula o otimizador completamente (SVGs, GIFs, ou quando quer o original byte-for-byte) -->
{Image({ src: '/logo.svg', alt: 'Logo', width: 200, height: 200, unoptimized: true })}

<!-- Imagens remotas são proxied e otimizadas com segurança (bloqueia IPs privadas etc.) -->
{Image({ src: 'https://example.com/photo.jpg', alt: 'Remote', width: 800, height: 600 })}
```

### Recortes redondos / avatar exatos

```svelte
{Image({ 
  src: '/avatar.jpg', 
  alt: 'Avatar', 
  width: 128, 
  height: 128, 
  round: true 
})}
```

### Otimização exata de fontes (a outra metade do pacote)

```ts
// em load() ou em qualquer lugar
import { preloadFont } from '@nexus_js/assets';

const font = preloadFont({
  family: 'Inter',
  weights: [400, 600],
  subsets: ['latin'],
  display: 'swap',
});
```

Então no template (geralmente no layout raiz):

```svelte
{pretext.font}   <!-- emite o <link rel="preload" as="font"> exato + regras font-face -->
```

Todas as chamadas acima (`Image({...})`, `getImageDimensions`, `preloadFont`) são a API pública exata exportada por `@nexus_js/assets`. São seguras para chamar de `load()` (rodam no servidor). Veja a fonte do pacote ou os exemplos do monorepo para os detalhes precisos de implementação. Combine com os padrões mostrados em quickstart.md, routing.md, e seo.md para páginas completas.

Quando uma imagem deve esticar para preencher seu container:

```ts
---
import { Image } from '@nexus_js/assets';
---

<div style="position:relative;width:100%;height:60vh;">
  {Image({ src: '/hero.jpg', alt: 'Hero', fill: true, objectFit: 'cover', priority: true })}
</div>
```

- `fill` remove atributos `width`/`height` e aplica posicionamento absoluto
- O **pai deve ter `position:relative`**
- `objectFit` padrão é `'cover'`; pode ser `'contain'`, `'fill'`, `'none'`, ou `'scale-down'`
- `objectPosition` padrão é `'center'`

### Priority (imagens above-the-fold)

Para imagens visíveis sem scroll:

```svelte
{Image({ src: '/hero.jpg', alt: 'Hero', width: 1200, height: 600, priority: true })}
```

Isso define:
- `loading="eager"`
- `fetchpriority="high"`
- `decoding="sync"`

Para pré-carregar a imagem no `<head>` e acelerar ainda mais o first paint:

```ts
export async function load(ctx) {
  return {
    head: {
      links: [
        { rel: 'preload', as: 'image', href: '/_nexus/image?src=%2Fhero.jpg&w=1200&q=80' },
      ],
    },
  };
}
```

### Placeholder blur

Para uma experiência de carregamento percebida suave, gere uma preview de baixa qualidade inline:

```ts
import { getBlurDataURL } from '@nexus_js/assets';
import { resolve } from 'node:path';

export async function load(ctx) {
  const publicDir = resolve(process.cwd(), 'public');
  const blurDataURL = await getBlurDataURL('/hero.jpg', publicDir);

  return {
    hero: {
      src: '/hero.jpg',
      alt: 'Hero',
      width: 1200,
      height: 600,
      blurDataURL,
    },
  };
}
```

```nx
{Image(pretext.hero)}
```

A imagem começa com uma preview borrada e fade in quando a imagem completa carrega. Não requer JavaScript — um pequeno handler inline `onload` trata a transição.

### Dimensões automáticas

Se você não sabe o tamanho da imagem no momento de authoring, leia em runtime:

```ts
import { getImageDimensions } from '@nexus_js/assets';
import { resolve } from 'node:path';

export async function load(ctx) {
  const publicDir = resolve(process.cwd(), 'public');
  const dims = await getImageDimensions('/uploads/photo.jpg', publicDir);

  return {
    photo: {
      src: '/uploads/photo.jpg',
      alt: 'User photo',
      ...dims,
    },
  };
}
```

### Modo sem otimizar

Pula o otimizador para SVGs, GIFs, ou quando precisa do arquivo original intacto:

```nx
{Image({ src: '/logo.svg', alt: 'Logo', width: 200, height: 200, unoptimized: true })}
```

Isso emite um `<img>` plano com o `src` original, pulando `/_nexus/image` completamente.

### Imagens remotas

URLs externas são proxied com segurança através do otimizador:

```nx
{Image({ src: 'https://example.com/photo.jpg', alt: 'Remote', width: 800, height: 600 })}
```

Verificações de segurança bloqueiam automaticamente IPs privadas, localhost, e protocolos não HTTP(S).

### Recorte redondo (avatars)

```nx
{Image({ src: '/avatar.jpg', alt: 'User', size: 64, round: true })}
```

`size` é um shorthand que define tanto `width` quanto `height`.

## Por que usar `Image()` em vez de `<img>`?

| Recurso | `<img>` | `Image()` |
|---------|---------|-----------|
| Negociação AVIF/WebP | ❌ Manual | ✅ `<picture>` automático |
| srcset responsivo | ❌ Manual | ✅ Breakpoints automáticos |
| Lazy loading | ⚠️ Atributo manual | ✅ Lazy por padrão, eager para priority |
| Placeholder blur | ❌ Não embutido | ✅ LQIP inline + fade-in |
| Prevenção de layout shift | ⚠️ width/height manual | ✅ Força dimensões |
| Proxy remoto | ❌ Não embutido | ✅ Proxy seguro `/_nexus/image` |
| Modo fill | ❌ CSS manual | ✅ Props `fill` + `objectFit` |

## Referência completa de `ImageProps`

| Prop | Tipo | Default | Descrição |
|------|------|---------|-------------|
| `src` | `string` | **obrigatório** | Caminho local ou URL remota |
| `alt` | `string` | **obrigatório** | Descrição acessível |
| `width` | `number` | — | Largura intrínseca |
| `height` | `number` | — | Altura intrínseca |
| `size` | `number` | — | Shorthand quadrado |
| `sizes` | `string` | auto | Atributo sizes responsivo |
| `priority` | `boolean` | `false` | Carregamento eager above-the-fold |
| `round` | `boolean` | `false` | Recorte circular |
| `class` | `string` | — | Classe CSS |
| `quality` | `number` | `80` | Compressão 1–100 |
| `formats` | `ImageFormat[]` | `['avif','webp','original']` | Prioridade de formatos |
| `placeholder` | `'blur' \| 'empty' \| 'none'` | `'blur'` | Estratégia de carregamento |
| `blurDataURL` | `string` | — | Preview base64 inline |
| `fetchpriority` | `'high' \| 'low' \| 'auto'` | auto | Hint de prioridade do browser |
| `fill` | `boolean` | `false` | Preencher container pai |
| `objectFit` | `string` | `'cover'` | CSS object-fit |
| `objectPosition` | `string` | `'center'` | CSS object-position |
| `unoptimized` | `boolean` | `false` | Pular otimizador |
| `style` | `string` | — | Estilos inline adicionais |

## Endpoint do otimizador de imagens

O framework monta automaticamente `/_nexus/image` tanto em dev quanto em produção. Você não precisa configurá-lo manualmente.

Parâmetros de query:
- `src` — caminho de imagem local (ex. `/hero.jpg`)
- `url` — URL de imagem remota
- `w` — largura alvo (clamp 1–8192)
- `f` — formato de saída (`avif`, `webp`, `png`, `jpg`, `original`)
- `q` — qualidade 1–100
- `blur=1` — gera um LQIP tiny em vez da imagem completa

## Fontes

Use Google Fonts ou self-host. O compilador inlines o CSS crítico de fontes e pré-carrega arquivos de fonte automaticamente quando configurado.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

Para otimização avançada de fontes (subsetting, inlining, preloading), veja `@nexus_js/assets/fonts`.
