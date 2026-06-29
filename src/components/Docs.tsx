'use client';

import { useState } from 'react';
import { DOCS } from '@/data/docs';

export default function Docs() {
  const [activeKey, setActiveKey] = useState(DOCS[0].key);
  const activeDoc = DOCS.find((d) => d.key === activeKey) ?? DOCS[0];

  const groups = Array.from(new Set(DOCS.map((d) => d.group)));

  return (
    <section id="docs">
      <div className="container">
        <p className="section-label">{'// documentation'}</p>
        <h2 className="section-title">Getting Started</h2>
        <p className="section-sub">
          Everything you need to install, configure, and extend DEVAI tools in your workflow.
        </p>

        <div className="docs-layout">
          <div className="docs-sidebar">
            <nav>
              {groups.map((group) => (
                <div key={group}>
                  <span className="docs-nav-group">{group}</span>
                  {DOCS.filter((d) => d.group === group).map((doc) => (
                    <button
                      key={doc.key}
                      className={`docs-nav-link ${activeKey === doc.key ? 'active' : ''}`}
                      onClick={() => setActiveKey(doc.key)}
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          <div className="docs-content">
            <h2>{activeDoc.title}</h2>
            <p className="meta">{activeDoc.meta}</p>
            <div dangerouslySetInnerHTML={{ __html: activeDoc.body }} />
          </div>
        </div>
      </div>
    </section>
  );
}
