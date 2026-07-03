"use client";

import { useState } from "react";
import AgentBuilder from "./AgentBuilder";
import DatasetForge from "./DatasetForge";
import Icon from "./Icon";
import Library, { type LibraryFilter } from "./Library";
import PromptLab from "./PromptLab";
import type { IconName, WorkspaceView } from "./types";

type NavigationItem = { id: WorkspaceView; label: string; icon: IconName };

const libraryNav: NavigationItem[] = [
  { id: "discover", label: "Discover", icon: "search" },
  { id: "agents", label: "Agents", icon: "agent" },
  { id: "mcp", label: "MCP Servers", icon: "data" },
  { id: "toolkits", label: "Toolkits", icon: "library" },
];

const buildNav: NavigationItem[] = [
  { id: "agent", label: "Agent Builder", icon: "build" },
  { id: "prompt", label: "Prompt Lab", icon: "prompt" },
  { id: "dataset", label: "Dataset Forge", icon: "dataset" },
];

const buildDescriptions: Record<"agent" | "prompt" | "dataset", string> = {
  agent: "Configure and export portable agent blueprints.",
  prompt: "Compile prompt variables into repeatable test suites.",
  dataset: "Validate, clean, and export model-ready JSONL.",
};

function filterFor(view: WorkspaceView): LibraryFilter {
  if (view === "agents") return "Agent";
  if (view === "mcp") return "MCP Server";
  if (view === "toolkits") return "Toolkit";
  return "All";
}

export default function Workbench() {
  const [active, setActive] = useState<WorkspaceView>("discover");
  const [bookmarks, setBookmarks] = useState(() => new Set(["github-mcp"]));
  const isLibrary = ["discover", "agents", "mcp", "toolkits", "saved"].includes(active);
  const buildItem = buildNav.find((item) => item.id === active);

  return (
    <main className="app-shell">
      <header className="mobile-topbar">
        <strong>DEVAI</strong>
        <div><button aria-label="Search"><Icon name="search" size={21} /></button><button aria-label="Open menu"><Icon name="menu" size={22} /></button></div>
      </header>

      <aside className="nav-sidebar">
        <div className="nav-brand">DEVAI</div>
        <nav aria-label="DEVAI navigation">
          <div className="nav-group">
            <span>Library</span>
            {libraryNav.map((item) => <NavButton key={item.id} item={item} active={active === item.id} onClick={() => setActive(item.id)} />)}
          </div>
          <div className="nav-divider" />
          <div className="nav-group">
            <span>Build</span>
            {buildNav.map((item) => <NavButton key={item.id} item={item} active={active === item.id} onClick={() => setActive(item.id)} />)}
          </div>
          <div className="nav-divider" />
          <div className="nav-group">
            <span>Saved</span>
            <NavButton item={{ id: "saved", label: "Bookmarks", icon: "bookmark" }} active={active === "saved"} onClick={() => setActive("saved")} />
          </div>
        </nav>
        <div className="sidebar-foot">
          <span className="status-dot" />
          <div><strong>Local workspace</strong><small>No API key required</small></div>
        </div>
      </aside>

      <section className="app-content">
        {isLibrary ? (
          <Library key={active} initialFilter={filterFor(active)} savedOnly={active === "saved"} bookmarks={bookmarks} setBookmarks={setBookmarks} />
        ) : (
          <div className="build-workspace">
            <header className="build-toolbar">
              <div><h1>{buildItem?.label}</h1><p>{buildDescriptions[active as "agent" | "prompt" | "dataset"]}</p></div>
              <a href="https://github.com/AMallur/DEVAI" target="_blank" rel="noreferrer"><Icon name="github" size={17} /> GitHub <Icon name="external" size={12} /></a>
            </header>
            {active === "agent" && <AgentBuilder />}
            {active === "prompt" && <PromptLab />}
            {active === "dataset" && <DatasetForge />}
          </div>
        )}
      </section>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <button className={isLibrary && active !== "saved" ? "active" : ""} onClick={() => setActive("discover")}><Icon name="library" size={21} /><span>Library</span></button>
        <button className={!isLibrary ? "active" : ""} onClick={() => setActive("agent")}><Icon name="build" size={21} /><span>Build</span></button>
        <button className={active === "saved" ? "active" : ""} onClick={() => setActive("saved")}><Icon name="bookmark" size={21} /><span>Saved</span></button>
      </nav>
    </main>
  );
}

function NavButton({ item, active, onClick }: { item: NavigationItem; active: boolean; onClick: () => void }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}><Icon name={item.icon} size={18} /><span>{item.label}</span></button>;
}
