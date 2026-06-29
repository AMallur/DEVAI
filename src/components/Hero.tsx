export default function Hero() {
  return (
    <section id="hero" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>
      <div className="hero-text">
        <p className="section-label">{'// developer hub'}</p>
        <h1>
          Build agents faster with <em>open tools</em> and shared infrastructure
        </h1>
        <p>
          A curated hub of MCP servers, Colab notebooks, and agentic utilities —
          ready to plug into your Claude, Cursor, or custom AI workflow.
        </p>
        <div className="hero-btns">
          <a className="btn-primary" href="#tools">Browse Tools</a>
          <a className="btn-secondary" href="#docs">Read the Docs</a>
        </div>
      </div>

      <div className="terminal">
        <div className="term-bar">
          <div className="dot dot-r" />
          <div className="dot dot-y" />
          <div className="dot dot-g" />
          <span className="term-title">mcp · tool call · v0.3</span>
        </div>
        <div className="term-body">
          <pre>
            <span className="t-prompt">$</span> <span className="t-cmd">mcp call devai/github-search</span>
            {'\n\n'}
            <span className="t-dim">▸ Invoking tool...</span>
            {'\n'}
            <span className="t-arrow">{'{'}</span>
            {'\n  '}
            <span className="t-key">&quot;tool&quot;</span><span className="t-dim">:</span> <span className="t-str">&quot;github_search_code&quot;</span><span className="t-dim">,</span>
            {'\n  '}
            <span className="t-key">&quot;input&quot;</span><span className="t-dim">:</span> <span className="t-arrow">{'{'}</span>
            {'\n    '}
            <span className="t-key">&quot;query&quot;</span><span className="t-dim">:</span>{'  '}<span className="t-str">&quot;MCP server Claude&quot;</span><span className="t-dim">,</span>
            {'\n    '}
            <span className="t-key">&quot;lang&quot;</span><span className="t-dim">:</span>{'   '}<span className="t-str">&quot;TypeScript&quot;</span><span className="t-dim">,</span>
            {'\n    '}
            <span className="t-key">&quot;limit&quot;</span><span className="t-dim">:</span>{'  '}<span className="t-num">5</span>
            {'\n  '}
            <span className="t-arrow">{'}'}</span>
            {'\n'}
            <span className="t-arrow">{'}'}</span>
            {'\n\n'}
            <span className="t-dim">◆ Response · 127ms</span>
            {'\n'}
            <span className="t-arrow">{'{'}</span>
            {'\n  '}
            <span className="t-key">&quot;status&quot;</span><span className="t-dim">:</span>{'  '}<span className="t-ok">&quot;ok&quot;</span><span className="t-dim">,</span>
            {'\n  '}
            <span className="t-key">&quot;count&quot;</span><span className="t-dim">:</span>{'   '}<span className="t-num">5</span><span className="t-dim">,</span>
            {'\n  '}
            <span className="t-key">&quot;results&quot;</span><span className="t-dim">:</span> <span className="t-dim">[...]</span>
            {'\n'}
            <span className="t-arrow">{'}'}</span>
            {'\n\n'}
            <span className="t-prompt">$</span> <span className="t-cursor" />
          </pre>
        </div>
      </div>
    </section>
  );
}
