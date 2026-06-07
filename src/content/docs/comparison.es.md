# Comparación de Frameworks

Cómo se compara Nexus con los frameworks full-stack mainstream en 2026.

| Característica                   | Nexus                            | Next.js                          | SvelteKit               | Astro                  | Ganador para la mayoría |
|----------------------------------|----------------------------------|----------------------------------|-------------------------|------------------------|-------------------------|
| **Arquitectura de Islas**        | ✅ Nativa + first-class          | ❌ No (React en todas partes)   | ⚠️ Parcial             | ✅ Excelente           | **Nexus / Astro**      |
| **Cero JS por defecto**          | ✅ Sí                            | ❌ No                           | ⚠️ Parcial             | ✅ Sí                  | **Nexus / Astro**      |
| **Tamaño de bundle (típico)**    | Muy pequeño (Runes + islands)    | Impuesto React (incluso con RSC)| Pequeño                | Muy pequeño            | **Nexus**              |
| **Modelo de reactividad**        | ✅ Svelte 5 Runes (excelente)    | React (o compiler)              | Svelte 5 Runes         | Agnóstico al framework | **Nexus**              |
| **Modelo de carga de datos**     | ✅ Pretext (explícito, mezclado) | Server Components (confuso)     | funciones load()       | Mixto                  | **Nexus**              |
| **Seguridad incorporada**        | ✅ CSP, CSRF, Vault, Shield, rate limiting, audit | Casi ninguna (tú traes la tuya) | Básica                 | Básica                 | **Nexus (por mucho)**  |
| **DX de Contenido / Markdown**   | ✅ @nexus_js/content (colecciones, i18n, plurales, shiki, watch) | Bueno (pero usualmente añades MDX + libs) | Bueno               | Excelente (content-first) | **Nexus** (tras paquete content) |
| **Server Actions**               | ✅ Nativo + seguro por defecto   | ✅ Sí                           | ✅ Sí                  | Limitado               | Nexus (ventaja seguridad) |
| **Metadata / SEO**               | Bueno (mejorando rápido)         | Excelente (generateMetadata, etc.) | Muy bueno             | Excelente              | Next.js (por ahora)    |
| **Optimización de Imagen + Fuente** | Bueno (@nexus_js/assets)       | Excelente (first class)         | Bueno                  | Excelente              | Next.js / Astro        |
| **Claridad del modelo mental**   | ✅ Explícito (load + pretext)    | ❌ Complejo ("¿dónde corre esto?") | ✅ Limpio             | ✅ Limpio              | **Nexus / SvelteKit**  |
| **Experiencia dev y errores**    | Mejorando                        | Muy pulido                      | Muy bueno              | Excelente              | Next.js (actualmente)  |
| **Ecosistema y contratación**    | Pequeño pero creciendo           | Masivo                          | Medio                  | Creciendo rápido       | Next.js                |
| **Multi-tenant / Enterprise**    | ✅ Fortalezas nativas            | Posible pero glue code          | Posible                | Limitado               | **Nexus**              |

## El Posicionamiento Honesto (2026)

**Elige Next.js si:**
- Necesitas el ecosistema React más grande del mundo.
- Tu equipo ya es experto en React y no quiere cambiar.
- Quieres la opción "más segura" en términos de madurez y contratación.

**Elige Nexus si quieres:**
- **Rendimiento real** sin tener que pelear contra el framework (Islands + Runes).
- **Seguridad por defecto** en vez de tener que añadirla después.
- Un modelo mental **más simple y explícito** que Server Components + caching mágico (usa `load()` + `pretext`).
- La mejor experiencia posible para sitios de contenido + algo de interactividad (gracias a `@nexus_js/content`: colecciones, headings para TOC, plurales, async render, watch).
- Excelente DX de errores en compile time (structured CompileError + pretty formatters with frames) — ver 0.9.30 en releases.
- Escapar del "React tax" sin renunciar a una gran experiencia de componentes.
- Metadata/SEO fácil vía `load() { head: {...} }` con inyección automática (request-scoped).

Nexus no intenta ser "Next.js pero con Svelte".  
**Nexus es lo que Next.js debería haber sido** si hubiera priorizado Islands + seguridad + simplicidad mental desde el día 1.

---

**Actualizado junio 2026** después de la creación de `@nexus_js/content` y el dogfooding completo del sitio oficial de documentación.
