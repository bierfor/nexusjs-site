// ─── Learn page: Monaco Editor + interactive lessons ───────────────────────

var LESSONS = [
  {
    title:    'Your First Page',
    filename: 'src/routes/+page.nx',
    desc: [
      '<p>Welcome to Nexus.js! Every <strong>.nx file</strong> has an optional frontmatter block',
      '(between <code>---</code>) that runs on the server, followed by HTML that becomes the response.</p>',
      '<p><code>&lt;style&gt;</code> in a page is <strong>scoped</strong> to that route (it does not redefine global <code>body</code> for the whole app).',
      'For site-wide CSS, use <code>public/*.css</code> and a <code>&lt;link&gt;</code> in your layout — see <a href="/#assets">Assets</a>.</p>',
      '<p>Try editing the <code>h1</code> and click <strong>Run</strong> to refresh the preview.</p>'
    ].join(''),
    lang: 'html',
    code: [
      '---',
      '// Server code — never ships to the browser',
      '---',
      '',
      '<div class="page">',
      '  <h1>Hello from Nexus!</h1>',
      '  <p>Edit this text and click Run to see changes.</p>',
      '  <a href="#" onclick="return false">Go to About</a>',
      '</div>',
      '',
      '<style>',
      '  .page { font-family: system-ui; padding: 2rem; background: #fafafa; border-radius: 12px; }',
      '  h1 { color: #7c3aed; font-size: 2rem; margin-bottom: 0.5rem; }',
      '  p  { color: #52525b; margin-bottom: 1rem; }',
      '  a  { color: #7c3aed; font-weight: 600; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Server Frontmatter',
    filename: 'src/routes/+page.nx',
    previewSimulate: 'frontmatter',
    desc: [
      '<p>The frontmatter block (between <code>---</code>) is <strong>server-only</strong>.',
      'Variables defined there are available in the HTML template via <code>{curly braces}</code>.</p>',
      '<p>The data never leaves the server — Nexus compiles the template and sends only HTML.</p>'
    ].join(''),
    lang: 'html',
    code: [
      '---',
      'const user = { name: "Alice", role: "Admin" };',
      'const year = new Date().getFullYear();',
      'const features = ["Server Actions", "Islands", "CSRF Protection"];',
      '---',
      '',
      '<div class="page">',
      '  <h1>Welcome, {user.name}!</h1>',
      '  <p>Role: <strong>{user.role}</strong> — {year}</p>',
      '  <ul>',
      '    {#each features as feat}',
      '      <li>{feat}</li>',
      '    {/each}',
      '  </ul>',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; }',
      '  h1 { color: #7c3aed; }',
      '  li { margin: 0.4rem 0; color: #374151; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'File-based Routing',
    filename: 'File structure',
    lang: 'plaintext',
    desc: [
      '<p>Routing in Nexus is 100% file-based. The file system <em>is</em> your router.</p>',
      '<ul>',
      '<li><code>routes/+page.nx</code> → <code>/</code></li>',
      '<li><code>routes/about/+page.nx</code> → <code>/about</code></li>',
      '<li><code>routes/blog/[slug]/+page.nx</code> → <code>/blog/:slug</code></li>',
      '<li><code>routes/(auth)/login/+page.nx</code> → <code>/login</code> (route group)</li>',
      '</ul>'
    ].join(''),
    code: [
      'my-app/',
      '├── src/',
      '│   ├── routes/',
      '│   │   ├── +layout.nx       # Root layout',
      '│   │   ├── +page.nx         # → /',
      '│   │   ├── about/',
      '│   │   │   └── +page.nx     # → /about',
      '│   │   ├── blog/',
      '│   │   │   ├── +page.nx     # → /blog',
      '│   │   │   └── [slug]/',
      '│   │   │       └── +page.nx # → /blog/:slug',
      '│   │   └── (auth)/',
      '│   │       ├── login/',
      '│   │       │   └── +page.nx # → /login',
      '│   │       └── register/',
      '│   │           └── +page.nx # → /register',
      '│   └── lib/',
      '│       └── server/          # Server-only code',
      '├── public/',
      '└── nexus.config.ts',
    ].join('\n')
  },
  {
    title:    'Islands Architecture',
    filename: 'src/routes/+page.nx',
    lang: 'html',
    /** Real .nx islands are not compiled in this iframe — preview runs equivalent vanilla JS */
    previewSimulate: 'island-click',
    desc: [
      '<p class="ld-preview-note">The iframe cannot compile islands — <strong>Run</strong> shows a vanilla click counter next to the static HTML block.</p>',
      '<p>Nexus ships zero JS by default. To make a component interactive,',
      'wrap it with <code>client:load</code>, <code>client:visible</code> or <code>client:idle</code>.</p>',
      '<p>Only that island\'s code ships to the browser — nothing more. <strong>Surgical JavaScript.</strong></p>'
    ].join(''),
    code: [
      '---',
      '// Server — no JS shipped for this content',
      '---',
      '',
      '<div class="page">',
      '  <!-- Static HTML — zero JS -->',
      '  <h1>Server heading</h1>',
      '  <p>This is pure HTML. No JavaScript.</p>',
      '',
      '  <!-- Island — JS only for this div -->',
      '  <div client:load>',
      '    <script>',
      '      let clicks = $state(0);',
      '    </script>',
      '    <button onclick={() => clicks++} class="btn">',
      '      Clicked: {clicks}',
      '    </button>',
      '  </div>',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; }',
      '  h1   { font-size: 1.8rem; color: #18181b; }',
      '  .btn { margin-top: 1.5rem; padding: 0.75rem 2rem;',
      '         background: #7c3aed; color: white; border: none;',
      '         border-radius: 8px; font-size: 1rem; cursor: pointer; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Reactive State with $state',
    filename: 'src/routes/+page.nx',
    lang: 'html',
    previewSimulate: 'reactive',
    desc: [
      '<p class="ld-preview-note">This playground does not compile <code>client:load</code> islands. <strong>Run</strong> uses a tiny vanilla script that mirrors <code>$state</code> and <code>$derived</code> so you can test the UI; Nexus turns your real <code>.nx</code> into Svelte.</p>',
      '<p>Inside an island, use <strong>Svelte 5 Runes</strong>:</p>',
      '<ul>',
      '<li><code>$state()</code> — reactive variable</li>',
      '<li><code>$derived()</code> — computed value, auto-tracks deps</li>',
      '<li><code>$effect()</code> — side-effect when deps change</li>',
      '</ul>',
      '<p>UI updates automatically when reactive state changes. No manual DOM manipulation.</p>'
    ].join(''),
    code: [
      '---',
      '// Server frontmatter',
      '---',
      '',
      '<div client:load>',
      '  <script>',
      '    let count = $state(0);',
      '    let name  = $state("Nexus");',
      '    let doubled = $derived(count * 2);',
      '  </script>',
      '',
      '  <div class="demo">',
      '    <h2>Hello, {name}!</h2>',
      '    <input bind:value={name} placeholder="Your name" />',
      '    <div class="counter">',
      '      <button onclick={() => count--}>-</button>',
      '      <strong>{count}</strong>',
      '      <button onclick={() => count++}>+</button>',
      '    </div>',
      '    <p>Doubled: <strong>{doubled}</strong></p>',
      '  </div>',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; }',
      '  .demo { max-width: 400px; }',
      '  input { width: 100%; padding: 0.5rem; margin: 0.5rem 0 1rem;',
      '          font-size: 1rem; border: 1px solid #ddd; border-radius: 6px; }',
      '  .counter { display: flex; align-items: center; gap: 1rem; margin: 1rem 0; }',
      '  button { width: 40px; height: 40px; border-radius: 8px;',
      '           border: 1px solid #ddd; background: white; font-size: 1.25rem; cursor: pointer; }',
      '  strong { font-size: 2rem; color: #7c3aed; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Computed Values with $derived',
    filename: 'src/routes/+page.nx',
    lang: 'html',
    previewSimulate: 'derived',
    desc: [
      '<p class="ld-preview-note">The live preview runs in an isolated document (plain JS) so it still works with strict CSP. Match the idea with <code>$derived</code> on the filtered array and on <code>filtered.length</code> in your editor.</p>',
      '<p><code>$derived()</code> creates a reactive computed value. It automatically tracks',
      'which reactive values it reads and re-runs when any change — like Vue\'s <code>computed</code>.</p>'
    ].join(''),
    code: [
      '---',
      '// Server',
      '---',
      '',
      '<div client:load>',
      '  <script>',
      '    let items = $state(["Apple", "Banana", "Cherry", "Date"]);',
      '    let search = $state("");',
      '    let filtered = $derived(',
      '      items.filter(i => i.toLowerCase().includes(search.toLowerCase()))',
      '    );',
      '    let count = $derived(filtered.length);',
      '  </script>',
      '',
      '  <div class="demo">',
      '    <input bind:value={search} placeholder="Search fruits..." />',
      '    <p class="meta">{count} result{count === 1 ? "" : "s"}</p>',
      '    <ul>',
      '      {#each filtered as item}',
      '        <li>{item}</li>',
      '      {:else}',
      '        <li class="empty">No results</li>',
      '      {/each}',
      '    </ul>',
      '  </div>',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; }',
      '  input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ddd;',
      '          border-radius: 6px; font-size: 1rem; }',
      '  .meta { color: #71717a; font-size: 0.875rem; margin: 0.5rem 0; }',
      '  ul { list-style: none; padding: 0; margin: 0.5rem 0; }',
      '  li { padding: 0.5rem 0.75rem; border-radius: 6px;',
      '       background: #f4f4f5; margin: 0.25rem 0; }',
      '  li.empty { color: #a1a1aa; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Server Actions',
    filename: 'src/routes/contact/+page.nx',
    lang: 'html',
    previewSimulate: 'server-action',
    desc: [
      '<p><strong>Server Actions</strong> are async functions in the frontmatter that run on the server.',
      'Called via HTML forms with automatic CSRF tokens.</p>',
      '<ul>',
      '<li>Export an async function — it becomes an action</li>',
      '<li>Forms submit to <code>/_nexus/action/functionName</code></li>',
      '<li>CSRF, rate limiting, and cookies handled automatically</li>',
      '</ul>'
    ].join(''),
    code: [
      '---',
      'export async function contactAction(formData, ctx) {',
      '  const name    = formData.get("name");',
      '  const email   = formData.get("email");',
      '  const message = formData.get("message");',
      '',
      '  if (!name || !email || !message)',
      '    return { error: "All fields are required." };',
      '',
      '  // await sendEmail({ name, email, message });',
      '',
      '  return { success: true };',
      '}',
      '---',
      '',
      '<form class="form" method="post" action="/_nexus/action/contactAction">',
      '  <h2>Contact Us</h2>',
      '  <input  name="name"    placeholder="Your name"    required />',
      '  <input  name="email"   placeholder="Email"        type="email" required />',
      '  <textarea name="message" placeholder="Message"    required></textarea>',
      '  <button type="submit">Send Message</button>',
      '</form>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; background: #fafafa; }',
      '  .form { max-width: 480px; display: flex; flex-direction: column; gap: 0.75rem; }',
      '  h2 { color: #18181b; font-size: 1.5rem; margin-bottom: 0.5rem; }',
      '  input, textarea { padding: 0.625rem 0.875rem; border: 1px solid #e4e4e7;',
      '                    border-radius: 6px; font-family: inherit; font-size: 0.9rem; }',
      '  textarea { min-height: 120px; resize: vertical; }',
      '  button { padding: 0.75rem; background: #7c3aed; color: white; border: none;',
      '           border-radius: 8px; font-size: 1rem; cursor: pointer; font-weight: 600; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Form Validation with Zod',
    filename: 'src/routes/register/+page.nx',
    lang: 'html',
    previewSimulate: 'validation',
    desc: [
      '<p>Nexus integrates with <strong>Zod</strong> for type-safe server-side validation.',
      'Return <code>fieldErrors</code> to show per-field error messages on the client.</p>'
    ].join(''),
    code: [
      '---',
      'import { z } from "zod";',
      '',
      'export async function registerAction(formData, ctx) {',
      '  const schema = z.object({',
      '    username: z.string().min(3, "At least 3 characters").max(20),',
      '    email:    z.string().email("Invalid email address"),',
      '    password: z.string().min(8, "At least 8 characters"),',
      '  });',
      '',
      '  const result = schema.safeParse({',
      '    username: formData.get("username"),',
      '    email:    formData.get("email"),',
      '    password: formData.get("password"),',
      '  });',
      '',
      '  if (!result.success)',
      '    return { error: "Validation failed",',
      '             fieldErrors: result.error.flatten().fieldErrors };',
      '',
      '  return { redirect: "/dashboard" };',
      '}',
      '---',
      '',
      '<form method="post" action="/_nexus/action/registerAction" class="form">',
      '  <h2>Create Account</h2>',
      '  <div class="field">',
      '    <label>Username</label>',
      '    <input name="username" required />',
      '    <span class="err" id="username-error"></span>',
      '  </div>',
      '  <div class="field">',
      '    <label>Email</label>',
      '    <input name="email" type="email" required />',
      '    <span class="err" id="email-error"></span>',
      '  </div>',
      '  <div class="field">',
      '    <label>Password</label>',
      '    <input name="password" type="password" required />',
      '    <span class="err" id="password-error"></span>',
      '  </div>',
      '  <button type="submit">Register</button>',
      '</form>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; }',
      '  .form { max-width: 400px; display: flex; flex-direction: column; gap: 1rem; }',
      '  .field { display: flex; flex-direction: column; gap: 0.25rem; }',
      '  label { font-size: 0.875rem; font-weight: 600; color: #374151; }',
      '  input { padding: 0.625rem; border: 1px solid #e5e7eb; border-radius: 6px; }',
      '  .err { font-size: 0.8rem; color: #ef4444; min-height: 1em; }',
      '  button { padding: 0.75rem; background: #7c3aed; color: white; border: none;',
      '           border-radius: 8px; cursor: pointer; font-weight: 600; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Authentication & Sessions',
    filename: 'src/routes/login/+page.nx',
    lang: 'html',
    previewSimulate: 'auth',
    desc: [
      '<p>Use <code>ctx.setCookie()</code> to set httpOnly session cookies. They are merged into',
      'the response automatically — even JSON responses.</p>'
    ].join(''),
    code: [
      '---',
      'import { z } from "zod";',
      '',
      'export async function loginAction(formData, ctx) {',
      '  const result = z.object({',
      '    email:    z.string().email(),',
      '    password: z.string().min(8),',
      '  }).safeParse({',
      '    email:    formData.get("email"),',
      '    password: formData.get("password"),',
      '  });',
      '',
      '  if (!result.success)',
      '    return { error: "Invalid credentials" };',
      '',
      '  // const user = await db.users.findByEmail(result.data.email);',
      '',
      '  ctx.setCookie("session", "demo-token", {',
      '    httpOnly: true, secure: true, sameSite: "lax",',
      '    maxAge: 60 * 60 * 24 * 7,',
      '  });',
      '',
      '  return { redirect: "/dashboard" };',
      '}',
      '---',
      '',
      '<div class="auth-page">',
      '  <form method="post" action="/_nexus/action/loginAction" class="auth-form">',
      '    <h2>Sign In</h2>',
      '    <input name="email"    type="email"    placeholder="Email"    required />',
      '    <input name="password" type="password" placeholder="Password" required />',
      '    <button type="submit">Sign In</button>',
      '  </form>',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; background: #fafafa; display: grid;',
      '         place-items: center; min-height: 100vh; margin: 0; }',
      '  .auth-form { background: white; border: 1px solid #e4e4e7;',
      '               border-radius: 12px; padding: 2rem; width: 360px;',
      '               display: flex; flex-direction: column; gap: 0.875rem; }',
      '  h2 { font-size: 1.5rem; color: #18181b; margin-bottom: 0.5rem; }',
      '  input { padding: 0.625rem 0.875rem; border: 1px solid #e4e4e7;',
      '          border-radius: 6px; font-size: 0.9rem; }',
      '  button { padding: 0.75rem; background: #7c3aed; color: white;',
      '           border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Pretext & Data Loading',
    filename: 'src/routes/blog/+page.nx',
    lang: 'html',
    previewSimulate: 'pretext',
    desc: [
      '<p><strong>Pretext</strong> is Nexus\'s data-loading system. Export a <code>load()</code>',
      'function that returns data available as <code>{pretext.key}</code> in your template.</p>',
      '<p>Data is loaded on the server before HTML is rendered — no loading spinners.</p>'
    ].join(''),
    code: [
      '---',
      'export async function load(ctx) {',
      '  // Runs on the server before rendering',
      '  return {',
      '    posts: [',
      '      { id: 1, title: "Getting started with Nexus", views: 1240 },',
      '      { id: 2, title: "Islands vs SSR: a comparison", views: 890 },',
      '      { id: 3, title: "Server Actions deep dive",    views: 2100 },',
      '    ],',
      '    total: 3,',
      '  };',
      '}',
      '---',
      '',
      '<div class="page">',
      '  <h1>Blog ({pretext.total} posts)</h1>',
      '',
      '  {#each pretext.posts as post}',
      '    <article class="post-card">',
      '      <a href="/blog/{post.id}">',
      '        <h2>{post.title}</h2>',
      '      </a>',
      '      <p class="views">{post.views} views</p>',
      '    </article>',
      '  {/each}',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; background: #fafafa; }',
      '  h1 { font-size: 1.75rem; color: #18181b; margin-bottom: 1.5rem; }',
      '  .post-card { background: white; border: 1px solid #e4e4e7;',
      '               border-radius: 8px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }',
      '  .post-card h2 { font-size: 1rem; color: #18181b; font-weight: 600; }',
      '  .post-card a { text-decoration: none; }',
      '  .post-card a:hover h2 { color: #7c3aed; }',
      '  .views { font-size: 0.8rem; color: #a1a1aa; margin-top: 0.25rem; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Layouts (+layout.nx)',
    filename: 'src/routes/+layout.nx',
    lang:     'html',
    previewSimulate: 'layout',
    desc: [
      '<p>A <strong>layout</strong> wraps child routes. Put shared chrome (nav, footer) in <code>+layout.nx</code> and render the active page with <code>&lt;slot /&gt;</code>.</p>',
      '<p>Layouts can nest: <code>routes/+layout.nx</code> applies to every route under <code>routes/</code>.</p>'
    ].join(''),
    code: [
      '---',
      '// Optional: shared data — use { siteName } in the template',
      'const siteName = "My App";',
      '---',
      '',
      '<header class="shell-nav">',
      '  <strong>My App</strong>',
      '  <nav>',
      '    <a href="/">Home</a>',
      '    <a href="/about">About</a>',
      '  </nav>',
      '</header>',
      '',
      '<main class="shell-main">',
      '  <!-- In Nexus: <slot /> renders the child route here -->',
      '  <p class="demo-slot">Preview: imagine the active +page.nx renders inside this main.</p>',
      '</main>',
      '',
      '<style>',
      '  body { font-family: system-ui; margin: 0; background: #fafafa; }',
      '  .shell-nav { display: flex; align-items: center; justify-content: space-between;',
      '    padding: 1rem 2rem; background: #18181b; color: #fafafa; }',
      '  .shell-nav a { color: #c4b5fd; margin-left: 1rem; text-decoration: none; font-weight: 600; }',
      '  .shell-main { padding: 2rem; max-width: 720px; margin: 0 auto; }',
      '  .demo-slot { color: #71717a; font-size: 0.9rem; border: 1px dashed #d4d4d8;',
      '               padding: 1rem; border-radius: 8px; background: #fff; }',
      '</style>',
    ].join('\n')
  },
  {
    title:    'Links & navigation',
    filename: 'src/routes/+page.nx',
    lang:     'html',
    desc: [
      '<p>Use normal <code>&lt;a href="..."&gt;</code> for navigation — Nexus resolves routes from the file tree.</p>',
      '<p>Prefer real links over client-only routers so pages work without JavaScript (progressive enhancement).</p>'
    ].join(''),
    code: [
      '---',
      '// You can build menus from data with {#each} — preview shows static HTML below.',
      '---',
      '',
      '<div class="page">',
      '  <h1>Navigation</h1>',
      '  <p>Prefer real <code>&lt;a href&gt;</code> links (works without JS):</p>',
      '  <ul class="nav-list">',
      '    <li><a href="/">Home</a></li>',
      '    <li><a href="/docs">Docs</a></li>',
      '    <li><a href="/learn">Learn</a></li>',
      '  </ul>',
      '</div>',
      '',
      '<style>',
      '  body { font-family: system-ui; padding: 2rem; background: #fafafa; }',
      '  h1 { color: #7c3aed; }',
      '  .nav-list { list-style: none; padding: 0; margin: 1rem 0; }',
      '  .nav-list li { margin: 0.5rem 0; }',
      '  .nav-list a { color: #4f46e5; font-weight: 600; }',
      '</style>',
    ].join('\n')
  }
];

// ─── Monaco: AMD loader is same-origin (/public/monaco/vs/loader.min.js); editor + workers from CDN ──
var MONACO_VS = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs';

// ─── State ────────────────────────────────────────────────────────────────────
var current = 0;
var completed = {};
var editor = null;
var useMonaco = false;

// ─── Monaco / fallback editor ─────────────────────────────────────────────────
function mountFallbackEditor(message) {
  var host = document.getElementById('monaco-editor');
  if (!host) return;
  host.innerHTML = '';
  if (message) {
    var banner = document.createElement('div');
    banner.className = 'learn-fallback-banner';
    banner.textContent = message;
    host.appendChild(banner);
  }
  var ta = document.createElement('textarea');
  ta.className = 'learn-fallback-editor';
  ta.setAttribute('spellcheck', 'false');
  ta.setAttribute('aria-label', 'Code sample');
  host.appendChild(ta);

  editor = {
    _ta: ta,
    _runTimer: null,
    getValue: function() { return ta.value; },
    setValue: function(v) { ta.value = v; },
    getModel: function() { return null; },
    onDidChangeModelContent: function(cb) {
      ta.addEventListener('input', function() {
        clearTimeout(editor._runTimer);
        editor._runTimer = setTimeout(cb, 900);
      });
    },
    layout: function() {},
  };
  useMonaco = false;
  editor.onDidChangeModelContent(function() { runPreview(); });
}

function showEditorLoading() {
  var host = document.getElementById('monaco-editor');
  if (!host) return;
  host.innerHTML = '<div class="learn-editor-loading" id="learn-editor-loading">Loading editor…</div>';
}

function clearEditorLoading() {
  var host = document.getElementById('monaco-editor');
  if (host) host.innerHTML = '';
}

function initMonaco() {
  showEditorLoading();

  if (typeof require === 'undefined') {
    clearEditorLoading();
    mountFallbackEditor('Monaco loader did not run (check network / CSP). Using plain textarea — Run still works.');
    loadLesson(current);
    return;
  }

  window.MonacoEnvironment = {
    getWorkerUrl: function(_moduleId, label) {
      var base = MONACO_VS;
      switch (label) {
        case 'json':
          return base + '/language/json/jsonWorker.js';
        case 'css':
        case 'scss':
        case 'less':
          return base + '/language/css/cssWorker.js';
        case 'html':
        case 'handlebars':
        case 'razor':
          return base + '/language/html/htmlWorker.js';
        case 'typescript':
        case 'javascript':
          return base + '/language/typescript/tsWorker.js';
        default:
          return base + '/base/worker/workerMain.js';
      }
    }
  };

  require.config({ paths: { vs: MONACO_VS } });

  require(
    ['vs/editor/editor.main'],
    function() {
      clearEditorLoading();
      var host = document.getElementById('monaco-editor');
      if (!host) return;

      monaco.editor.defineTheme('nx-dark', {
        base: 'vs-dark', inherit: true, rules: [],
        colors: {
          'editor.background':              '#08080a',
          'editor.lineHighlightBackground':   '#18181c',
          'editorLineNumber.foreground':      '#52525b',
          'editor.selectionBackground':       '#3b2f5c',
        }
      });

      editor = monaco.editor.create(host, {
        value:                LESSONS[0].code,
        language:             'html',
        theme:                'nx-dark',
        fontSize:             13,
        fontFamily:           "'JetBrains Mono', ui-monospace, monospace",
        lineHeight:           22,
        minimap:              { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout:      true,
        wordWrap:             'on',
        renderLineHighlight:  'line',
        padding:              { top: 16, bottom: 16 },
        overviewRulerBorder:  false,
        scrollbar:            { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
      });

      useMonaco = true;

      editor.onDidChangeModelContent(function() {
        clearTimeout(editor._runTimer);
        editor._runTimer = setTimeout(runPreview, 900);
      });

      loadLesson(current);
    },
    function(err) {
      console.error('[learn] Monaco failed to load', err);
      clearEditorLoading();
      mountFallbackEditor('Monaco failed to load from CDN. Using plain textarea — Run still works.');
      loadLesson(current);
    }
  );
}

// ─── Lesson navigation ────────────────────────────────────────────────────────
function loadLesson(idx) {
  var lesson = LESSONS[idx];
  if (!lesson) return;
  current = idx;

  document.querySelectorAll('.ls-item').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-lesson')) === idx);
  });

  var titleEl    = document.getElementById('lesson-title');
  var stepEl     = document.getElementById('lesson-step');
  var bodyEl     = document.getElementById('lesson-body');
  var filenameEl = document.getElementById('editor-filename');
  var btnPrev    = document.getElementById('btn-prev');
  var btnNext    = document.getElementById('btn-next');

  if (titleEl)    titleEl.textContent    = lesson.title;
  if (stepEl)     stepEl.textContent     = pad(idx + 1) + ' / ' + LESSONS.length;
  if (bodyEl)     bodyEl.innerHTML       = lesson.desc;
  if (filenameEl) filenameEl.textContent = lesson.filename;
  if (btnPrev)    btnPrev.disabled       = idx === 0;
  if (btnNext)    btnNext.textContent    = idx === LESSONS.length - 1 ? 'Finish' : 'Next →';

  updateProgress();

  if (editor) {
    var lang = lesson.lang || 'html';
    if (useMonaco && typeof monaco !== 'undefined' && editor.getModel && editor.getModel()) {
      monaco.editor.setModelLanguage(editor.getModel(), lang);
    }
    editor.setValue(lesson.code);
    setTimeout(function() {
      if (editor && editor.layout) editor.layout();
      runPreview();
    }, 400);
  }
}

window.prevLesson = function() { if (current > 0) loadLesson(current - 1); };
window.nextLesson = function() {
  completed[current] = true;
  var chk = document.getElementById('chk-' + current);
  if (chk) chk.textContent = '✓';
  updateProgress();
  if (current < LESSONS.length - 1) loadLesson(current + 1);
};

function updateProgress() {
  var done = Object.keys(completed).length;
  var pct  = Math.round((done / LESSONS.length) * 100);
  var bar  = document.getElementById('progress-bar');
  var lbl  = document.getElementById('progress-label');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = done + ' / ' + LESSONS.length;
}

// ─── Editor actions ───────────────────────────────────────────────────────────
window.resetCode = function() {
  if (editor && LESSONS[current]) {
    editor.setValue(LESSONS[current].code);
    runPreview();
  }
};

/** Revoked when replacing preview so blob: URLs do not leak. */
var learnPreviewBlobUrl = null;

/**
 * Load full HTML into the preview iframe via blob: URL so inline scripts run even when the
 * parent page uses a strict CSP (about:blank + document.write inherits that CSP and blocks them).
 */
function mountLearnPreview(iframe, html) {
  if (!iframe) return;
  if (learnPreviewBlobUrl) {
    try {
      URL.revokeObjectURL(learnPreviewBlobUrl);
    } catch (e) { /* ignore */ }
    learnPreviewBlobUrl = null;
  }
  iframe.removeAttribute('srcdoc');
  learnPreviewBlobUrl = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
  iframe.src = learnPreviewBlobUrl;
}

/**
 * Islands / runes in the editor are not executed in the iframe (no Nexus compiler).
 * Returns a full HTML document string for mountLearnPreview.
 */
function buildSimulatedIslandPreviewHtml(kind) {
  var baseCss =
    '*{box-sizing:border-box}' +
    'body{font-family:system-ui;padding:2rem;margin:0;background:#fff;color:#18181b}' +
    '.learn-sim-note{font-size:0.72rem;color:#52525b;margin-top:1.25rem;padding-top:0.75rem;border-top:1px solid #e4e4e7;line-height:1.5}' +
    '.learn-sim-note code{font-family:ui-monospace,monospace;font-size:0.88em;background:#f4f4f5;padding:0.15em 0.4em;border-radius:4px;color:#3f3f46}';

  if (kind === 'island-click') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      'h1{font-size:1.8rem;color:#18181b}' +
      '.btn{margin-top:1.5rem;padding:0.75rem 2rem;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer}' +
      '</style></head><body>' +
      '<div class="page">' +
      '<h1>Server heading</h1>' +
      '<p>This is pure HTML. No JavaScript.</p>' +
      '<p><button type="button" class="btn" id="nx-island-btn">Clicked: <span id="nx-island-n">0</span></button></p>' +
      '</div>' +
      '<p class="learn-sim-note">Simulated island: vanilla click counter. Your <code>.nx</code> uses <code>$state</code> + Svelte.</p>' +
      '<script>(function(){var n=0;var b=document.getElementById("nx-island-btn"),s=document.getElementById("nx-island-n");b.addEventListener("click",function(){n++;s.textContent=String(n);});})();<\/script>' +
      '</body></html>'
    );
  }

  if (kind === 'reactive') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      '.demo{max-width:400px}' +
      'input{width:100%;padding:0.5rem;margin:0.5rem 0 1rem;font-size:1rem;border:1px solid #ddd;border-radius:6px}' +
      '.counter{display:flex;align-items:center;gap:1rem;margin:1rem 0}' +
      '.counter button{width:40px;height:40px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:1.25rem;cursor:pointer}' +
      '.counter strong{font-size:2rem;color:#7c3aed}' +
      '.doubled strong{font-size:2rem;color:#7c3aed}' +
      '</style></head><body>' +
      '<div class="demo">' +
      '<h2>Hello, <span id="nx-name-disp"></span>!</h2>' +
      '<input type="text" id="nx-name-in" placeholder="Your name" autocomplete="off" />' +
      '<div class="counter">' +
      '<button type="button" id="nx-dec">-</button><strong id="nx-count">0</strong><button type="button" id="nx-inc">+</button>' +
      '</div>' +
      '<p class="doubled">Doubled: <strong id="nx-doubled">0</strong></p>' +
      '</div>' +
      '<p class="learn-sim-note">Same behavior as <code>$state</code> + <code>$derived(count * 2)</code> in Nexus.</p>' +
      '<script>(function(){var count=0,name="Nexus";var elC=document.getElementById("nx-count"),elD=document.getElementById("nx-doubled"),elN=document.getElementById("nx-name-disp"),inp=document.getElementById("nx-name-in");function r(){elC.textContent=String(count);elD.textContent=String(count*2);elN.textContent=name||"\u00a0";}inp.value=name;inp.addEventListener("input",function(){name=inp.value;r();});document.getElementById("nx-dec").addEventListener("click",function(){count--;r();});document.getElementById("nx-inc").addEventListener("click",function(){count++;r();});r();})();<\/script>' +
      '</body></html>'
    );
  }

  if (kind === 'derived') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      'input{width:100%;padding:0.5rem 0.75rem;border:1px solid #ddd;border-radius:6px;font-size:1rem}' +
      '.meta{color:#52525b;font-size:0.875rem;margin:0.5rem 0}' +
      'ul{list-style:none;padding:0;margin:0.5rem 0}' +
      'li{padding:0.5rem 0.75rem;border-radius:6px;background:#f4f4f5;margin:0.25rem 0}' +
      'li.empty{color:#71717a}' +
      '</style></head><body>' +
      '<div class="demo">' +
      '<label for="nx-search" class="meta" style="display:block;margin-bottom:0.35rem">Filter</label>' +
      '<input type="text" id="nx-search" placeholder="Type to filter fruits..." autocomplete="off" spellcheck="false" />' +
      '<p class="meta" id="nx-meta"></p>' +
      '<ul id="nx-ul"></ul>' +
      '</div>' +
      '<p class="learn-sim-note">Preview in plain JavaScript (CSP-safe). In your <code>.nx</code> sample, use <code>$derived</code> for the filtered list and for <code>filtered.length</code>.</p>' +
      '<script>(function(){var items=["Apple","Banana","Cherry","Date"];var inp=document.getElementById("nx-search"),ul=document.getElementById("nx-ul"),meta=document.getElementById("nx-meta");function f(){var q=(inp.value||"").toLowerCase();return items.filter(function(i){return i.toLowerCase().indexOf(q)!==-1;});}function r(){var list=f();meta.textContent=list.length+" result"+(list.length===1?"":"s");ul.innerHTML="";if(list.length===0){var li=document.createElement("li");li.className="empty";li.textContent="No results";ul.appendChild(li);return;}list.forEach(function(t){var li=document.createElement("li");li.textContent=t;ul.appendChild(li);});}inp.addEventListener("input",r);inp.addEventListener("keyup",r);r();})();<\/script>' +
      '</body></html>'
    );
  }

  if (kind === 'frontmatter') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      'h1{font-size:1.8rem;color:#18181b;margin:0 0 .5rem}' +
      'p{color:#52525b;margin:.25rem 0 1rem}' +
      'ul{padding-left:1.25rem;margin:.5rem 0}' +
      'li{margin:.25rem 0;color:#374151}' +
      '.badge{display:inline-flex;align-items:center;gap:.5rem;padding:.25rem .6rem;border-radius:999px;background:#f4f4f5;border:1px solid #e4e4e7;color:#52525b;font-size:.8rem}' +
      '</style></head><body>' +
      '<div class="page">' +
      '<h1>Welcome, Alice!</h1>' +
      '<p>Role: <strong>Admin</strong> — ' + new Date().getFullYear() + '</p>' +
      '<div class="badge">Server-only frontmatter → compiled HTML</div>' +
      '<ul><li>Server Actions</li><li>Islands</li><li>CSRF Protection</li></ul>' +
      '</div>' +
      '<p class="learn-sim-note">Simulated render of <code>{user.name}</code> and <code>{#each}</code>. In Nexus, the compiler evaluates the server block and emits HTML.</p>' +
      '</body></html>'
    );
  }

  if (kind === 'server-action') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      '.form{max-width:520px;display:flex;flex-direction:column;gap:.75rem}' +
      'h2{color:#18181b;font-size:1.5rem;margin:0 0 .25rem}' +
      'input,textarea{padding:.65rem .85rem;border:1px solid #e4e4e7;border-radius:10px;font-size:.95rem;font-family:inherit}' +
      'textarea{min-height:110px;resize:vertical}' +
      'button{padding:.75rem .9rem;background:#7c3aed;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer}' +
      'button:hover{background:#9333ea}' +
      '.toast{display:none;margin-top:.75rem;border-radius:12px;padding:.7rem .85rem;border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;font-weight:600}' +
      '.toast.bad{border-color:#fecaca;background:#fef2f2;color:#991b1b}' +
      '</style></head><body>' +
      '<form class="form" id="f">' +
      '<h2>Contact Us</h2>' +
      '<input name="name" placeholder="Your name" required />' +
      '<input name="email" type="email" placeholder="Email" required />' +
      '<textarea name="message" placeholder="Message" required></textarea>' +
      '<button type="submit">Send Message</button>' +
      '<div class="toast" id="t"></div>' +
      '</form>' +
      '<p class="learn-sim-note">This preview simulates a Server Action. In a real app, the form posts to <code>/_nexus/action/contactAction</code> and Nexus applies CSRF + rate limiting.</p>' +
      '<script>(function(){var f=document.getElementById("f"),t=document.getElementById("t");f.addEventListener("submit",function(e){e.preventDefault();var fd=new FormData(f);var name=String(fd.get("name")||"").trim();var email=String(fd.get("email")||"").trim();var msg=String(fd.get("message")||"").trim();if(!name||!email||!msg){t.className="toast bad";t.textContent="All fields are required.";t.style.display="block";return;}t.className="toast";t.textContent="Sent! (simulated server response)";t.style.display="block";});})();<\/script>' +
      '</body></html>'
    );
  }

  if (kind === 'validation') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      '.form{max-width:420px;display:flex;flex-direction:column;gap:1rem}' +
      'h2{margin:0;color:#18181b}' +
      'label{font-size:.85rem;font-weight:700;color:#374151}' +
      'input{padding:.65rem .85rem;border:1px solid #e4e4e7;border-radius:10px;font-size:.95rem;font-family:inherit}' +
      '.field{display:flex;flex-direction:column;gap:.35rem}' +
      '.err{min-height:1em;color:#ef4444;font-size:.82rem}' +
      'button{padding:.75rem .9rem;background:#7c3aed;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer}' +
      '.ok{display:none;border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;border-radius:12px;padding:.7rem .85rem;font-weight:600}' +
      '</style></head><body>' +
      '<form class="form" id="f">' +
      '<h2>Create Account</h2>' +
      '<div class="field"><label>Username</label><input name="username" required /><div class="err" data-err="username"></div></div>' +
      '<div class="field"><label>Email</label><input name="email" type="email" required /><div class="err" data-err="email"></div></div>' +
      '<div class="field"><label>Password</label><input name="password" type="password" required /><div class="err" data-err="password"></div></div>' +
      '<button type="submit">Register</button>' +
      '<div class="ok" id="ok">Valid! (simulated) → redirect to /dashboard</div>' +
      '</form>' +
      '<p class="learn-sim-note">In Nexus you validate on the server (e.g. Zod) inside the action, returning <code>fieldErrors</code> for the UI.</p>' +
      '<script>(function(){var f=document.getElementById("f"),ok=document.getElementById("ok");function setErr(k,msg){var el=document.querySelector("[data-err=\""+k+"\"]");if(el) el.textContent=msg||"";}f.addEventListener("submit",function(e){e.preventDefault();ok.style.display="none";var fd=new FormData(f);var u=String(fd.get("username")||"").trim();var em=String(fd.get("email")||"").trim();var p=String(fd.get("password")||"");setErr("username",u.length<3?"At least 3 characters":"");setErr("email",/^[^@]+@[^@]+\.[^@]+$/.test(em)?"":"Invalid email address");setErr("password",p.length<8?"At least 8 characters":"");if(u.length>=3&&/^[^@]+@[^@]+\.[^@]+$/.test(em)&&p.length>=8){ok.style.display="block";}});})();<\/script>' +
      '</body></html>'
    );
  }

  if (kind === 'auth') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      'body{display:grid;place-items:center;min-height:100vh;padding:0}' +
      '.card{width:380px;border:1px solid #e4e4e7;border-radius:16px;background:#fff;padding:1.5rem;box-shadow:0 10px 40px rgba(0,0,0,.08)}' +
      'h2{margin:0 0 .75rem;color:#18181b}' +
      'input{width:100%;padding:.65rem .85rem;border:1px solid #e4e4e7;border-radius:10px;font-size:.95rem;margin:.4rem 0;font-family:inherit}' +
      'button{width:100%;margin-top:.75rem;padding:.75rem .9rem;background:#7c3aed;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer}' +
      '.note{display:none;margin-top:.75rem;border-radius:12px;padding:.7rem .85rem;border:1px solid #bfdbfe;background:#eff6ff;color:#1e40af;font-weight:600}' +
      '</style></head><body>' +
      '<div class="card">' +
      '<form id="f">' +
      '<h2>Sign In</h2>' +
      '<input name="email" type="email" placeholder="Email" required />' +
      '<input name="password" type="password" placeholder="Password" required />' +
      '<button type="submit">Sign In</button>' +
      '<div class="note" id="n"></div>' +
      '</form>' +
      '<p class="learn-sim-note" style="margin-top:1rem">Simulated auth. In Nexus, <code>ctx.setCookie()</code> sets httpOnly cookies on the server response.</p>' +
      '</div>' +
      '<script>(function(){var f=document.getElementById("f"),n=document.getElementById("n");f.addEventListener("submit",function(e){e.preventDefault();n.style.display="block";n.textContent="Session set (simulated). Redirect to /dashboard";});})();<\/script>' +
      '</body></html>'
    );
  }

  if (kind === 'pretext') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      'h1{font-size:1.75rem;margin:0 0 1rem;color:#18181b}' +
      '.card{border:1px solid #e4e4e7;border-radius:14px;background:#fff;padding:1rem 1.1rem;margin:.75rem 0}' +
      '.card h2{margin:0;font-size:1rem;color:#18181b}' +
      '.views{margin:.25rem 0 0;color:#71717a;font-size:.85rem}' +
      'a{text-decoration:none}' +
      '</style></head><body>' +
      '<div class="page">' +
      '<h1>Blog (3 posts)</h1>' +
      '<div class="card"><a href="#" onclick="return false"><h2>Getting started with Nexus</h2></a><p class="views">1240 views</p></div>' +
      '<div class="card"><a href="#" onclick="return false"><h2>Islands vs SSR: a comparison</h2></a><p class="views">890 views</p></div>' +
      '<div class="card"><a href="#" onclick="return false"><h2>Server Actions deep dive</h2></a><p class="views">2100 views</p></div>' +
      '</div>' +
      '<p class="learn-sim-note">Simulated <code>load()</code> output. In Nexus, pretext runs on the server before HTML rendering.</p>' +
      '</body></html>'
    );
  }

  if (kind === 'layout') {
    return (
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      baseCss +
      'body{padding:0;background:#fafafa}' +
      '.shell-nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:#18181b;color:#fafafa}' +
      '.shell-nav a{color:#c4b5fd;margin-left:1rem;text-decoration:none;font-weight:700}' +
      '.shell-main{padding:1.5rem;max-width:760px;margin:0 auto}' +
      '.slot{border:1px dashed #d4d4d8;background:#fff;border-radius:14px;padding:1rem}' +
      '.slot h3{margin:0 0 .4rem;color:#18181b}' +
      '.slot p{margin:0;color:#52525b}' +
      '</style></head><body>' +
      '<header class="shell-nav"><strong>My App</strong><nav><a href="#" onclick="return false">Home</a><a href="#" onclick="return false">About</a></nav></header>' +
      '<main class="shell-main">' +
      '<div class="slot"><h3>&lt;slot /&gt;</h3><p>Child route content renders here.</p></div>' +
      '<p class="learn-sim-note">Layouts compose. In Nexus, <code>+layout.nx</code> wraps all child routes and <code>&lt;slot /&gt;</code> renders the active page.</p>' +
      '</main>' +
      '</body></html>'
    );
  }

  return '<!DOCTYPE html><html><body><p>Unknown preview simulation.</p></body></html>';
}

window.runPreview = function runPreview() {
  if (!editor) return;
  var code   = editor.getValue();
  var iframe = document.getElementById('preview-iframe');
  if (!iframe) return;

  var lesson = LESSONS[current];

  // Plaintext (file structure)
  if (lesson && lesson.lang === 'plaintext') {
    var escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    mountLearnPreview(
      iframe,
      '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:ui-monospace,monospace;font-size:13px;padding:1.5rem;margin:0;background:#08080a;color:#a1a1aa;white-space:pre;line-height:1.8">' +
        escaped +
        '</body></html>'
    );
    return;
  }

  if (lesson && lesson.previewSimulate) {
    mountLearnPreview(iframe, buildSimulatedIslandPreviewHtml(lesson.previewSimulate));
    return;
  }

  // Strip frontmatter
  var html = code.replace(/^---[\s\S]*?---\n?/, '');

  // Extract style and body
  var cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  var css  = cssMatch ? cssMatch[1] : '';
  var body = html.replace(/<style>[\s\S]*?<\/style>/, '');

  mountLearnPreview(
    iframe,
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}' +
      css +
      '</style></head><body>' +
      body +
      '</body></html>'
  );
};

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

// ─── Sidebar click handlers ───────────────────────────────────────────────────
document.querySelectorAll('.ls-item').forEach(function(btn) {
  btn.addEventListener('click', function() {
    loadLesson(parseInt(btn.getAttribute('data-lesson')));
  });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
function bootLearn() {
  loadLesson(0);
  initMonaco();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootLearn);
} else {
  bootLearn();
}
