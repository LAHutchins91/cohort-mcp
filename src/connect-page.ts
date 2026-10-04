import { canonicalPublicOrigin, legacyMcpUrl } from "./public-url.js";

function htmlEscape(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch] ?? ch));
}

/** Landing sentence. Uses the configured public origin. */
export function landingConnectLead(baseUrl: string) {
  const origin = canonicalPublicOrigin(baseUrl);
  const mcp = htmlEscape(`${origin}/mcp`);
  const connect = htmlEscape(`${origin}/connect`);
  return `<p>MCP address: <code>${mcp}</code>. <a href="${connect}">Connect an assistant</a>.</p>`;
}

/** Public install steps. */
export function connectPageBody(baseUrl: string) {
  const origin = canonicalPublicOrigin(baseUrl);
  const mcp = htmlEscape(`${origin}/mcp`);
  const fallback = legacyMcpUrl(baseUrl);
  const fallbackHtml = fallback
    ? `<p>The earlier address <code>${htmlEscape(fallback)}</code> still reaches this server.</p>`
    : "";
  return `<p>Cohort is one OAuth-protected curriculum for ChatGPT, Claude, Gemini, Grok, Cursor, and any other MCP client that can reach this server. Curriculum tools still require your Cohort account with Pro or an active trial. Billing stays in the workspace; no assistant can change your plan.</p>
<section><h2>Shared connection</h2>
<p>MCP address:</p><p><code>${mcp}</code></p>
${fallbackHtml}
<p>Transport: Streamable HTTP. Sign in with your own Cohort account when the assistant opens OAuth. Do not paste a credential into a header or chat. Revoke a host at any time from <a href="/connections">connected applications</a>.</p>
<ol><li><a href="/app">Sign in to the workspace</a> and open or create a program you will recognize by name.</li><li>Add the MCP address in your assistant using the steps below. Choose dynamic registration / OAuth when the host asks how to authenticate. Leave client id and secret empty.</li><li>Approve Cohort, then ask the assistant to retrieve the approved curriculum before it answers.</li></ol>
</section>
<section><h2>1. ChatGPT and Codex</h2>
<p>The same server a ChatGPT or Codex connector uses. Connect it as a custom app.</p>
<ol><li>On workspace plans, an admin enables developer mode under Workspace settings, then Permissions and roles, then Connected data developer mode. Personal accounts that already offer custom apps can skip that toggle.</li><li>Open Apps, then Create.</li><li>Enter the MCP address, choose OAuth, scan tools, and approve the Cohort sign-in.</li><li>Enable the app in the conversation.</li></ol>
<p>Codex can use this same MCP address. Request includes <code>offline_access</code> when the host offers refresh; Cohort’s authorization server advertises that scope.</p>
</section>
<section><h2>2. Claude</h2>
<p>Claude.ai, Claude Desktop, Cowork, and the mobile apps use a remote connector. Claude’s servers call Cohort; you do not install a local plugin.</p>
<ol><li>Free, Pro, and Max: Customize, then Connectors, then Add custom connector. Team and Enterprise: an owner adds it under Organization settings, then Connectors, then Add, then Custom, then Web. Each member then chooses Connect.</li><li>Name it Cohort and paste the MCP address.</li><li>Choose sign-in (OAuth). For the OAuth client, choose <strong>Register automatically</strong> (dynamic client registration). Leave client id and secret empty.</li><li>Approve Cohort in the browser, then turn the connector on from the chat menu.</li></ol>
<p>Claude Code, from a terminal:</p>
<pre><code>claude mcp add --transport http cohort ${mcp}</code></pre>
<p>Claude Code opens the same OAuth flow. In a JSON config, set <code>"type": "http"</code> next to <code>url</code>.</p>
</section>
<section><h2>3. Gemini</h2>
<h3>Gemini Apps</h3>
<p>Google’s Gemini Apps can add a custom connected app from an MCP server URL in the Gemini web app. Google requires you to be 18 or older, in the US, signed in with a personal Google Account, with Keep Activity on. Work and school accounts cannot use this path. Custom apps are English-only. Connect on the web; the link then works in the Gemini mobile app too.</p>
<ol><li>On a computer, open gemini.google.com, then Settings, then Connected apps.</li><li>Under Custom apps, add a custom app and paste the MCP address.</li><li>Leave advanced credentials empty. Cohort supports dynamic client registration, so a client id is not required.</li><li>Finish Google’s sign-in, then type <code>@</code> and choose Cohort when you want that chat to use it.</li></ol>
<h3>Gemini CLI</h3>
<p>Gemini CLI can add a Streamable HTTP server and discover OAuth itself, including dynamic registration:</p>
<pre><code>gemini mcp add --transport http --scope user cohort ${mcp}</code></pre>
<p>That writes <code>~/.gemini/settings.json</code>. If the CLI reports a missing issuer on the callback, Google is enforcing the issuer parameter and the authorization server did not return it. Cohort cannot add it from this app. Use Gemini Apps, or another host, until that redirect includes the issuer.</p>
</section>
<section><h2>4. Grok</h2>
<h3>Grok on the web</h3>
<ol><li>Open grok.com/connectors.</li><li>Choose New connector, then Custom.</li><li>Paste the MCP address and finish the sign-in Grok presents.</li></ol>
<p>On Grok Business and Enterprise, an admin provisions connectors before members can use them. The server must be reachable on the public internet. Grok discovers the tools after you connect.</p>
<h3>Grok Build</h3>
<pre><code>grok mcp add --transport http cohort ${mcp}</code></pre>
<p>OAuth runs in the browser on first use. The equivalent user config is:</p>
<pre><code>[mcp_servers.cohort]
url = "${mcp}"</code></pre>
<p>in <code>~/.grok/config.toml</code>.</p>
</section>
<section><h2>5. Cursor and other MCP clients</h2>
<p>Cursor speaks remote Streamable HTTP with OAuth. In <code>~/.cursor/mcp.json</code> (all projects) or <code>.cursor/mcp.json</code> (one project):</p>
<pre><code>{
  "mcpServers": {
    "cohort": {
      "url": "${mcp}"
    }
  }
}</code></pre>
<p>Cursor registers a client and opens sign-in. Restart Cursor or enable the server under Customize. A static OAuth client is only for servers that lack dynamic registration; Cohort has it, so registering redirect URLs by hand is unnecessary.</p>
<p>Any other MCP client uses the same address when it supports Streamable HTTP, OAuth 2.0 with PKCE, and dynamic client registration (RFC 7591). An unauthenticated tool call returns <code>401</code> with a <code>WWW-Authenticate</code> challenge pointing at <code>/.well-known/oauth-protected-resource/mcp</code>. Ask for the <code>email</code> scope. Add <code>offline_access</code> when the client can refresh tokens. Clients that call from their own servers should not send a browser <code>Origin</code>. Browser calls are accepted only from Cohort and the assistant sites listed in the server allowlist; other websites are rejected.</p>
</section>
<section><h2>After it connects</h2>
<p>“Use Cohort before you answer about <em>[program name]</em>. Retrieve the approved curriculum first.”</p>
<p>“Record this promise only after I approve it. Do not change a locked fact unless I revise it.”</p>
<p><strong>Promises</strong> are what the program tells learners it will deliver. <strong>Module outcomes</strong> are what each module must leave them able to do. <strong>Non-contradiction rules</strong> are facts later answers must not break. Locked entries stay locked until you revise them.</p>
<p>The assistant calls tools only when you and the host allow it. Cohort cannot watch every chat or run while the assistant is idle. Disconnecting an application stops future access; it does not delete programs or cancel billing.</p>
</section>`;
}
