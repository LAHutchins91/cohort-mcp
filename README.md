# Cohort

Cohort keeps a coach or course creator’s approved curriculum. It stores promises, module outcomes, and facts that must not be contradicted, then lets an assistant read that curriculum before it answers.

It works with ChatGPT, Claude, Gemini, Grok, and Cursor, plus any other MCP client that can do Streamable HTTP and OAuth. It is not a ChatGPT-only plugin.

- Source: https://github.com/LAHutchins91/cohort-mcp
- Setup: `http://localhost:3000/connect` on a local server, or `https://<your host>/connect` when deployed
- MCP address: `http://localhost:3000/mcp` locally, or `https://<your host>/mcp` when deployed

Sign in with your Cohort account when the assistant opens OAuth. Do not paste an API key or password into a header. Curriculum tools need Pro or an active trial. The site offers a 14-day trial, then Pro. Checkout shows the billing terms before you confirm. This page does not invent an amount.

## What the assistant can do

After you approve the connection, the server exposes these tools:

- list_programs
- create_program
- get_curriculum_context
- search_curriculum
- record_promise
- record_module_outcome
- record_noncontradiction_rule
- revise_approved_fact
- get_curriculum_history
- list_modules
- record_module
- curriculum_audit

Locked facts stay locked until you revise them. The assistant only calls these tools when you and the host allow it.

## Connect

Cursor, in `~/.cursor/mcp.json` or a project `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cohort": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

Use your deployed origin plus `/mcp` when the server is public. Claude Code:

```bash
claude mcp add --transport http cohort http://localhost:3000/mcp
```

Other clients: add the same URL, choose OAuth, and leave client id and secret empty. Cohort supports dynamic client registration. Full steps for each assistant are on the connect page.

Registry metadata for this remote server is in `server.json` (`io.github.LAHutchins91/cohort`).

## Run

```bash
npm install
npm run build
npm start
```

Set `APP_BASE_URL` to the public origin when you deploy. Sign-in uses Supabase. Billing uses Stripe, with a 14-day trial on checkout. The process speaks Streamable HTTP when stdin is a terminal, and stdio MCP when it is not.
