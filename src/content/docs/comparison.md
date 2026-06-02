# Framework Comparison

How Nexus compares to mainstream full-stack frameworks in 2026.

| Feature                        | Nexus                          | Next.js                          | SvelteKit               | Astro                  | Winner for most people |
|--------------------------------|--------------------------------|----------------------------------|-------------------------|------------------------|------------------------|
| **Islands Architecture**       | ✅ Native + first-class        | ❌ No (React everywhere)        | ⚠️ Partial             | ✅ Excellent           | **Nexus / Astro**     |
| **Zero JS by default**         | ✅ Yes                         | ❌ No                           | ⚠️ Partial             | ✅ Yes                 | **Nexus / Astro**     |
| **Bundle size (typical)**      | Very small (Runes + islands)   | React tax (even with RSC)       | Small                  | Very small             | **Nexus**             |
| **Reactivity model**           | ✅ Svelte 5 Runes (excellent)  | React (or compiler)             | Svelte 5 Runes         | Framework agnostic     | **Nexus**             |
| **Data loading model**         | ✅ Pretext (explicit, merged)  | Server Components (confusing)   | load() functions       | Mixed                  | **Nexus**             |
| **Built-in Security**          | ✅ CSP, CSRF, Vault, Shield, rate limiting, audit | Almost none (you bring your own) | Basic                  | Basic                  | **Nexus (by far)**    |
| **Content / Markdown DX**      | ✅ @nexus_js/content (collections, i18n, plurals, shiki, watch) | Good (but you usually add MDX + libs) | Good                   | Excellent (content-first) | **Nexus** (after content package) |
| **Server Actions**             | ✅ Native + secure by default  | ✅ Yes                          | ✅ Yes                 | Limited                | Nexus (security edge) |
| **Metadata / SEO**             | Good (improving fast)          | Excellent (generateMetadata, etc.) | Very good             | Excellent              | Next.js (for now)     |
| **Image + Font optimization**  | Good (@nexus_js/assets)        | Excellent (first class)         | Good                   | Excellent              | Next.js / Astro       |
| **Mental model clarity**       | ✅ Explicit (load + pretext)   | ❌ Complex ("where does this run?") | ✅ Clean               | ✅ Clean               | **Nexus / SvelteKit** |
| **Dev experience & errors**    | Improving                      | Very polished                   | Very good              | Excellent              | Next.js (currently)   |
| **Ecosystem & hiring**         | Small but growing              | Massive                         | Medium                 | Growing fast           | Next.js               |
| **Multi-tenant / Enterprise**  | ✅ Native strengths            | Possible but glue code          | Possible               | Limited                | **Nexus**             |

## The Honest Positioning (2026)

**Elige Next.js si:**
- Necesitas el ecosistema React más grande del mundo.
- Tu equipo ya es experto en React y no quiere cambiar.
- Quieres la opción "más segura" en términos de madurez y contratación.

**Elige Nexus si quieres:**
- **Rendimiento real** sin tener que pelear contra el framework (Islands + Runes).
- **Seguridad por defecto** en vez de tener que añadirla después.
- Un modelo mental **más simple y explícito** que Server Components + caching mágico (usa `load()` + `pretext`).
- La mejor experiencia posible para sitios de contenido + algo de interactividad (gracias a `@nexus_js/content`: collections, headings para TOC, plurals, async render, watch).
- Excelente DX de errores en compile time (structured CompileError + pretty formatters with frames) — ver 0.9.23 en releases.
- Escapar del "React tax" sin renunciar a una gran experiencia de componentes.
- Metadata/SEO fácil vía `load() { head: {...} }` con inyección automática (request-scoped).

Nexus no intenta ser "Next.js pero con Svelte".  
**Nexus es lo que Next.js debería haber sido** si hubiera priorizado Islands + seguridad + simplicidad mental desde el día 1.

---

**Actualizado junio 2026** después de la creación de `@nexus_js/content` y el dogfooding completo del sitio oficial de documentación.