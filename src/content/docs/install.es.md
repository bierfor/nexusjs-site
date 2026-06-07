Nexus requiere Node.js ≥ 22 y pnpm ≥ 9. Esta guía muestra **exactamente** los comandos y archivos que escribes.

### Requisitos previos exactos (copia estos)

```bash
node -v   # debe ser 22+
pnpm -v   # debe ser 9+
```

Si faltan:

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

### Paso a paso: crear y ejecutar (sesión de terminal exacta)

```bash
npm create @nexus_js/nexus my-app
cd my-app
pnpm install
pnpm dev
```

Abre http://localhost:3000. Ahora tienes una app corriendo usando features 0.9.30+ (load/pretext, islands, seguridad hardened).

### Archivos generados exactos que verás/editarás

- `nexus.config.ts` (edita para puerto, CSP, css.entry)
- `src/routes/+page.nx` (tu primera página — ver quickstart.md para el contenido exacto)
- `src/routes/+layout.nx` (layout raíz con <!--nexus:head--> y <!--nexus:slot-->)
- `src/global.css` (entrada Tailwind — compilado auto en dev)

### Build de producción (comandos exactos + env requerido)

```bash
pnpm build
NEXUS_SECRET=tu-secreto-de-32-caracteres-aqui pnpm start
```

La salida está en `.nexus/output/`. El `NEXUS_SECRET` es **obligatorio** para modo hardened (firma cookies, etc.). Nunca lo commitees.

### Errores comunes exactos y fixes (copia estos)

- `NEXUS_SECRET is required` → `export NEXUS_SECRET=tu-secreto-de-32-caracteres-aqui` (o set en env de la plataforma). Esto es obligatorio con `hardened: true`.
- Puerto en uso → edita `nexus.config.ts` exactamente:
  ```ts
  export default { server: { port: 3001 } };
  ```
- Estilos no aparecen después de refresh → asegúrate de tener `src/global.css` y que esté declarada:
  ```ts
  export default { css: { entry: './src/global.css' } };
  ```
  Entonces `pnpm dev` la servirá en `/_nexus/global.css`.

Ver quickstart.md (el primer .nx exacto que debes crear), routing.md, server-actions.md, y todas las otras páginas en esta lista para el uso completo, preciso y copy-paste de cada parte del framework. Todo aquí usa solo patrones en modo correcto.
