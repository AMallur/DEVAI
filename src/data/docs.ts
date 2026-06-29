export interface DocEntry {
  key: string;
  group: string;
  title: string;
  meta: string;
  body: string; // HTML
}

export const DOCS: DocEntry[] = [
  {
    key: 'overview',
    group: 'Introduction',
    title: 'Overview',
    meta: 'Introduction · Updated Jun 2025',
    body: `
      <p>DEVAI is an open-source hub for agentic AI tooling. It ships two kinds of assets:</p>
      <ul>
        <li><strong>MCP servers</strong> — plug-and-play tool servers that speak the Model Context Protocol, ready to wire into Claude Code, Cursor, or any MCP-compatible client.</li>
        <li><strong>Colab notebooks</strong> — runnable, annotated Python notebooks covering RAG, evals, fine-tune prep, and more.</li>
      </ul>
      <p>Every tool is open source, versioned, and tested against the latest Claude models. Community contributions are welcome — see the <em>Submit a Tool</em> guide.</p>
      <h3>Architecture</h3>
      <p>MCP servers are thin Node.js or Python processes that expose a set of tools over stdio or HTTP+SSE. Clients discover them via a <code>mcp_config.json</code> manifest and call tools in structured JSON.</p>
      <div class="docs-code">// mcp_config.json
{
  "mcpServers": {
    "github-search": {
      "command": "npx",
      "args": ["-y", "@devai/github-search-mcp"]
    }
  }
}</div>
    `,
  },
  {
    key: 'quickstart',
    group: 'Introduction',
    title: 'Quick Start',
    meta: 'Setup guide · 5 min read',
    body: `
      <p>Get your first DEVAI MCP server running in Claude Code in under five minutes.</p>
      <h3>Prerequisites</h3>
      <ul>
        <li>Node.js ≥ 18 or Python ≥ 3.10</li>
        <li>Claude Code CLI installed (<code>npm i -g @anthropic-ai/claude-code</code>)</li>
        <li>A GitHub personal access token (for github-search)</li>
      </ul>
      <h3>Install</h3>
      <div class="docs-code">npx @devai/github-search-mcp init</div>
      <p>This adds the server to your <code>~/.claude/mcp_config.json</code> and prompts for credentials. Restart Claude Code and the tool shows up automatically.</p>
      <h3>Verify</h3>
      <div class="docs-code">$ claude mcp list
✔ github-search   npx @devai/github-search-mcp   running</div>
    `,
  },
  {
    key: 'mcp-setup',
    group: 'MCP Servers',
    title: 'Setup & Config',
    meta: 'MCP Servers · Configuration',
    body: `
      <p>All DEVAI MCP servers share a common configuration schema. Drop the relevant block into your <code>mcp_config.json</code>.</p>
      <h3>Global config location</h3>
      <div class="docs-code">~/.claude/mcp_config.json     # user-level (all projects)
.claude/mcp_config.json       # project-level (overrides global)</div>
      <h3>Schema</h3>
      <div class="docs-code">{
  "mcpServers": {
    "&lt;name&gt;": {
      "command": "npx" | "python",
      "args": [...],
      "env": { "API_KEY": "..." }   // optional
    }
  }
}</div>
      <p>Environment variables in <code>env</code> are injected at spawn time and never written to disk outside this file.</p>
    `,
  },
  {
    key: 'mcp-tools',
    group: 'MCP Servers',
    title: 'Tool Reference',
    meta: 'MCP Servers · Tools',
    body: `
      <p>Each MCP server exposes a set of named tools. Here's a representative sample from <strong>github-search</strong>.</p>
      <h3>github_search_code</h3>
      <div class="docs-code">Input
  query   string   Full-text search query
  lang    string?  Language filter (e.g. "TypeScript")
  org     string?  Limit to a GitHub org
  limit   number?  Max results (default 10)

Output
  results  Array&lt;{ path, repo, url, snippet }&gt;</div>
      <h3>github_get_file</h3>
      <div class="docs-code">Input
  owner  string   Repository owner
  repo   string   Repository name
  path   string   File path

Output
  content  string  Raw file content (decoded)</div>
    `,
  },
  {
    key: 'mcp-auth',
    group: 'MCP Servers',
    title: 'Authentication',
    meta: 'MCP Servers · Security',
    body: `
      <p>DEVAI servers support two auth patterns: token-in-env (simplest) and OAuth device flow (for user-delegated access).</p>
      <h3>Token in env</h3>
      <div class="docs-code">// mcp_config.json
{
  "mcpServers": {
    "github-search": {
      "command": "npx",
      "args": ["-y", "@devai/github-search-mcp"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}</div>
      <p>Tokens are scoped to the minimum required permissions. See each server's README for the exact scope list.</p>
    `,
  },
  {
    key: 'nb-rag',
    group: 'Notebooks',
    title: 'RAG Pipeline Notebook',
    meta: 'Notebooks · rag-pipeline.ipynb',
    body: `
      <p>The <strong>rag-pipeline</strong> notebook walks through a complete retrieval-augmented generation setup using Claude and FAISS.</p>
      <h3>What's covered</h3>
      <ul>
        <li>PDF and Markdown ingestion</li>
        <li>Chunking strategies (fixed-size, semantic, recursive)</li>
        <li>Embedding with <code>voyage-3</code></li>
        <li>FAISS index build and persistent storage</li>
        <li>Claude generation with retrieved context</li>
        <li>Evaluation with RAGAS</li>
      </ul>
      <div class="docs-code">!pip install anthropic faiss-cpu ragas voyageai
# Then: File → Open in Colab</div>
    `,
  },
  {
    key: 'nb-eval',
    group: 'Notebooks',
    title: 'Agent Evals Notebook',
    meta: 'Notebooks · agent-eval.ipynb',
    body: `
      <p>Automated evaluation for multi-turn Claude agents. Supports custom rubrics, tool-call accuracy scoring, and latency benchmarking.</p>
      <h3>Metrics</h3>
      <ul>
        <li><strong>Tool accuracy</strong> — correct tool chosen, correct args, correct order</li>
        <li><strong>Answer quality</strong> — LLM-judge scored 1-5 vs ground truth</li>
        <li><strong>Latency</strong> — p50/p95 time-to-first-token and total</li>
      </ul>
      <div class="docs-code">from devai_eval import AgentEval
eval = AgentEval(model="claude-opus-4-8", dataset="./cases.jsonl")
report = eval.run()
report.to_html("eval_report.html")</div>
    `,
  },
  {
    key: 'contrib',
    group: 'Contributing',
    title: 'Submit a Tool',
    meta: 'Contributing · Open Source',
    body: `
      <p>We accept MCP servers, Colab notebooks, CLI utilities, and agent templates. Here's the process:</p>
      <h3>Checklist</h3>
      <ul>
        <li>Tool has a README with install and usage instructions</li>
        <li>MCP servers pass <code>npx @modelcontextprotocol/inspector</code></li>
        <li>Notebooks run top-to-bottom in a fresh Colab runtime</li>
        <li>No hard-coded secrets or personal API keys</li>
      </ul>
      <h3>Open a PR</h3>
      <div class="docs-code">git clone https://github.com/AMallur/DEVAI
# Add your tool under /tools or /notebooks
# Open a pull request against main</div>
      <p>Maintainer review typically takes 2–3 days. Once merged, your tool appears in the grid automatically at the next deploy.</p>
    `,
  },
];
