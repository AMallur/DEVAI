'use client';

import { useState } from 'react';
import { TOOLS, ToolStatus, ToolType } from '@/data/tools';

type Filter = 'all' | ToolType | ToolStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'MCP Servers', value: 'mcp' },
  { label: 'Notebooks', value: 'notebook' },
  { label: 'Live', value: 'live' },
  { label: 'Planned', value: 'planned' },
];

export default function ToolsGrid() {
  const [filter, setFilter] = useState<Filter>('all');

  const visibleTools = TOOLS.filter(
    (tool) => filter === 'all' || filter === tool.type || filter === tool.status
  );

  return (
    <section id="tools" className="alt">
      <div className="container">
        <p className="section-label">{'// tools & servers'}</p>
        <h2 className="section-title">MCP Servers &amp; Notebooks</h2>
        <p className="section-sub">
          Open source tools you can drop into any agentic workflow today.
        </p>

        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="tools-grid">
          {visibleTools.map((tool) => (
            <div className="tool-card" key={tool.name}>
              <div className="tool-card-header">
                <div className="tool-icon">{tool.icon}</div>
                <span className={`status-badge status-${tool.status}`}>{tool.status}</span>
              </div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-desc">{tool.description}</div>
              <div className="tool-tags">
                {tool.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
