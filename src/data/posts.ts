export interface Post {
  date: string;
  title: string;
  tags: string[];
}

export const POSTS: Post[] = [
  { date: 'Jun 29, 2025', title: 'Building a GitHub search MCP server in 30 minutes', tags: ['tutorial', 'mcp'] },
  { date: 'Jun 20, 2025', title: 'RAG pipelines with Claude: embedding strategies that actually work', tags: ['rag', 'embeddings'] },
  { date: 'Jun 10, 2025', title: 'Evaluating multi-turn agents at scale', tags: ['evals', 'agents'] },
  { date: 'May 28, 2025', title: 'MCP vs function calling: when to use which', tags: ['mcp', 'api'] },
  { date: 'May 14, 2025', title: 'Claude Code hooks: automating your dev workflow', tags: ['claude code', 'automation'] },
  { date: 'May 02, 2025', title: 'Intro to the Model Context Protocol (MCP)', tags: ['mcp', 'intro'] },
];
