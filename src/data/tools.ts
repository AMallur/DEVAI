export type ToolStatus = 'live' | 'draft' | 'planned';
export type ToolType = 'mcp' | 'notebook';

export interface Tool {
  icon: string;
  name: string;
  description: string;
  tags: string[];
  status: ToolStatus;
  type: ToolType;
}

export const TOOLS: Tool[] = [
  {
    icon: '🔍',
    name: 'github-search',
    description: 'Search GitHub code, issues, and PRs directly from your agent context. Supports full-text, file type, and org scoping.',
    tags: ['mcp', 'github', 'typescript'],
    status: 'live',
    type: 'mcp',
  },
  {
    icon: '🗃️',
    name: 'supabase-mcp',
    description: 'Read and write Supabase tables, run SQL, manage migrations, and inspect auth from inside Claude Code or any MCP client.',
    tags: ['mcp', 'database', 'postgres'],
    status: 'live',
    type: 'mcp',
  },
  {
    icon: '📬',
    name: 'gmail-mcp',
    description: 'Read threads, draft replies, label messages, and search your inbox — all through a standardised MCP tool surface.',
    tags: ['mcp', 'email', 'google'],
    status: 'live',
    type: 'mcp',
  },
  {
    icon: '🌐',
    name: 'web-scraper',
    description: 'Headless browser agent that extracts structured data from any URL, with CSS selector and LLM-powered extraction modes.',
    tags: ['mcp', 'scraping', 'playwright'],
    status: 'draft',
    type: 'mcp',
  },
  {
    icon: '📓',
    name: 'rag-pipeline',
    description: 'Colab notebook: chunk, embed, and query a document corpus with Claude + FAISS. Full RAG pipeline in under 200 lines.',
    tags: ['notebook', 'rag', 'embeddings'],
    status: 'live',
    type: 'notebook',
  },
  {
    icon: '🤖',
    name: 'agent-eval',
    description: 'Automated evaluation harness for multi-turn Claude agents. Scores tool-call accuracy, response quality, and latency.',
    tags: ['notebook', 'evals', 'python'],
    status: 'live',
    type: 'notebook',
  },
  {
    icon: '📊',
    name: 'linear-mcp',
    description: 'Create, update, and triage Linear issues from your agent. Roadmap sync and cycle management coming in v2.',
    tags: ['mcp', 'project', 'linear'],
    status: 'planned',
    type: 'mcp',
  },
  {
    icon: '🧠',
    name: 'fine-tune-prep',
    description: 'Data cleaning and JSONL formatting pipeline for preparing domain-specific fine-tuning datasets from raw conversation logs.',
    tags: ['notebook', 'fine-tuning', 'data'],
    status: 'planned',
    type: 'notebook',
  },
];
