"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { libraryResources, type LibraryResource, type ResourceType } from "@/data/library";
import Icon from "./Icon";
import { copyText } from "./utils";

export type LibraryFilter = "All" | ResourceType;

type LibraryProps = {
  initialFilter: LibraryFilter;
  savedOnly?: boolean;
  bookmarks: Set<string>;
  setBookmarks: Dispatch<SetStateAction<Set<string>>>;
};

const filters: LibraryFilter[] = ["All", "Agent", "MCP Server", "Toolkit"];

export default function Library({ initialFilter, savedOnly = false, bookmarks, setBookmarks }: LibraryProps) {
  const [filter, setFilter] = useState<LibraryFilter>(initialFilter);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LibraryResource>(libraryResources[2]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const resources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return libraryResources.filter((resource) => {
      if (savedOnly && !bookmarks.has(resource.id)) return false;
      if (filter !== "All" && resource.type !== filter) return false;
      if (!normalized) return true;
      return `${resource.name} ${resource.summary} ${resource.maintainer} ${resource.runtime}`.toLowerCase().includes(normalized);
    });
  }, [filter, query, savedOnly, bookmarks]);

  function toggleBookmark(resource: LibraryResource) {
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(resource.id)) next.delete(resource.id);
      else next.add(resource.id);
      return next;
    });
  }

  function choose(resource: LibraryResource) {
    setSelected(resource);
    setDetailOpen(true);
  }

  async function copyCommand() {
    if (!selected.command) return;
    await copyText(selected.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="library-screen">
      <div className="library-toolbar">
        <label className="global-search">
          <Icon name="search" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search agents, servers, and toolkits" aria-label="Search the developer library" />
          <span className="shortcut">⌘ K</span>
        </label>
        <a className="top-github" href="https://github.com/AMallur/DEVAI" target="_blank" rel="noreferrer"><Icon name="github" size={18} /> GitHub <Icon name="external" size={13} /></a>
      </div>

      <div className="mobile-category-nav" aria-label="Library categories">
        {filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "All" ? "Discover" : `${item}${item === "Agent" ? "s" : item === "Toolkit" ? "s" : "s"}`}</button>)}
      </div>

      <div className="library-columns">
        <section className="catalog">
          <header className="catalog-header">
            <div>
              <h1>{savedOnly ? "Saved resources" : "Developer library"}</h1>
              <p>{savedOnly ? "Your bookmarked building blocks, ready when you need them." : "Discover trusted building blocks for AI applications. Agents, MCP servers, and toolkits you can use and build upon."}</p>
            </div>
          </header>

          <label className="mobile-search">
            <Icon name="search" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" aria-label="Search the library" />
          </label>

          <div className="catalog-filters" aria-label="Resource filters">
            {filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "All" ? "All" : item === "Agent" ? "Agents" : item === "Toolkit" ? "Toolkits" : "MCP Servers"}</button>)}
          </div>

          <div className="resource-table" role="table" aria-label="Developer resources">
            <div className="resource-table-head" role="row">
              <span>Name</span><span>Type</span><span>Purpose</span><span>Maintainer</span><span>Runtime</span><span>Status</span>
            </div>
            <div className="resource-rows">
              {resources.map((resource) => (
                <div key={resource.id} className={`resource-row ${selected.id === resource.id ? "selected" : ""}`} role="button" tabIndex={0} onClick={() => choose(resource)} onKeyDown={(event) => { if (event.key === "Enter") choose(resource); }}>
                  <div className="resource-name-cell">
                    <span className={`resource-mark ${resource.color}`}>{resource.icon}</span>
                    <span><strong>{resource.name}</strong><small>{resource.summary}</small></span>
                    <button className={`bookmark-button ${bookmarks.has(resource.id) ? "saved" : ""}`} onClick={(event) => { event.stopPropagation(); toggleBookmark(resource); }} aria-label={`${bookmarks.has(resource.id) ? "Remove" : "Save"} ${resource.name}`}><Icon name="bookmark" size={17} /></button>
                  </div>
                  <span><span className={`type-label ${resource.type.toLowerCase().replace(" ", "-")}`}>{resource.type}</span></span>
                  <span className="purpose-cell">{resource.summary}</span>
                  <span>{resource.maintainer}</span>
                  <span className="runtime-cell">{resource.runtime}</span>
                  <span className="trust-cell"><i /> {resource.trust}</span>
                  <Icon name="chevron" size={17} />
                </div>
              ))}
              {!resources.length && <div className="catalog-empty">No resources match this search.</div>}
            </div>
          </div>
          <footer className="catalog-footer">Showing {resources.length} of {libraryResources.length} resources</footer>
        </section>

        <aside className={`resource-detail ${detailOpen ? "open" : ""}`} aria-label={`${selected.name} details`}>
          <div className="sheet-handle" />
          <button className="detail-close" onClick={() => setDetailOpen(false)} aria-label="Close details"><Icon name="close" size={18} /></button>
          <div className="detail-title-row">
            <span className={`resource-mark large ${selected.color}`}>{selected.icon}</span>
            <div><h2>{selected.name}</h2><span className="detail-trust"><i /> {selected.trust}</span></div>
          </div>
          <p className="detail-summary">{selected.summary}</p>

          <section className="detail-section">
            <h3>Key capabilities</h3>
            <ul>{selected.capabilities.map((capability) => <li key={capability}><Icon name="check" size={15} /> {capability}</li>)}</ul>
          </section>

          <section className="detail-section metadata">
            <h3>Package / runtime</h3>
            <dl><div><dt>Maintainer</dt><dd>{selected.maintainer}</dd></div><div><dt>Runtime</dt><dd>{selected.runtime}</dd></div><div><dt>Resource</dt><dd>{selected.type}</dd></div></dl>
          </section>

          {selected.command && <section className="detail-section"><h3>Quick start</h3><button className="command-box" onClick={copyCommand}><code>{selected.command}</code><span><Icon name="copy" size={16} /> {copied ? "Copied" : "Copy"}</span></button></section>}

          <div className="detail-actions">
            <a className="primary-action" href={selected.source} target="_blank" rel="noreferrer">{selected.action} <Icon name="external" size={14} /></a>
            <button className={`save-action ${bookmarks.has(selected.id) ? "saved" : ""}`} onClick={() => toggleBookmark(selected)}><Icon name="bookmark" size={16} /> {bookmarks.has(selected.id) ? "Saved" : "Save resource"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
