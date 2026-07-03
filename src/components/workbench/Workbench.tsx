"use client";

import { useState } from "react";
import AgentBuilder from "./AgentBuilder";
import DatasetForge from "./DatasetForge";
import Icon from "./Icon";
import PromptLab from "./PromptLab";
import type { WorkspaceTool } from "./types";

const tools = [
  { id: "agent" as const, label: "Agent Builder", icon: "agent" as const, mode: "Build" },
  { id: "prompt" as const, label: "Prompt Lab", icon: "prompt" as const, mode: "Test" },
  { id: "dataset" as const, label: "Dataset Forge", icon: "dataset" as const, mode: "Data" },
];

const descriptions: Record<WorkspaceTool, string> = {
  agent: "Configure an agent and export a production-ready blueprint or starter implementation.",
  prompt: "Compile reusable prompt variables into test payloads before calling a model API.",
  dataset: "Validate, repair, and export JSONL for chat fine-tuning or classification.",
};

export default function Workbench() {
  const [active, setActive] = useState<WorkspaceTool>("agent");
  const current = tools.find((tool) => tool.id === active) ?? tools[0];

  return (
    <main className="workbench">
      <header className="topbar">
        <div className="brand">DEVAI</div>
        <nav className="mode-tabs" aria-label="Workspace modes">
          {tools.map((tool) => (
            <button key={tool.id} className={`mode-tab ${active === tool.id ? "active" : ""}`} onClick={() => setActive(tool.id)}>
              <Icon name={tool.id === "agent" ? "build" : tool.id === "prompt" ? "test" : "data"} size={15} />
              {tool.mode}
            </button>
          ))}
        </nav>
        <a className="github-link" href="https://github.com/AMallur/DEVAI" target="_blank" rel="noreferrer">
          <Icon name="github" size={17} /> GitHub
        </a>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <div>
            <div className="sidebar-label">Workspace</div>
            <nav className="side-nav" aria-label="Developer tools">
              {tools.map((tool) => (
                <button key={tool.id} className={`side-link ${active === tool.id ? "active" : ""}`} onClick={() => setActive(tool.id)}>
                  <Icon name={tool.icon} size={16} /> {tool.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="sidebar-spacer" />
          <div className="status-block">
            <div className="status-line"><span className="status-dot" /> Local tools ready</div>
            <div className="status-version">v1.0.0 · no key required</div>
          </div>
        </aside>

        <section className="workspace">
          <nav className="mobile-tool-nav" aria-label="Developer tools">
            {tools.map((tool) => (
              <button key={tool.id} className={`side-link ${active === tool.id ? "active" : ""}`} onClick={() => setActive(tool.id)}>
                <Icon name={tool.icon} size={15} /> {tool.mode}
              </button>
            ))}
          </nav>
          <div className="workspace-header">
            <div>
              <h1 className="workspace-title">{current.label} <span>/ devai-workspace</span></h1>
              <p className="workspace-copy">{descriptions[active]}</p>
            </div>
            <div className="header-actions">
              <span className="button success"><span className="status-dot" /> Runs in browser</span>
            </div>
          </div>
          {active === "agent" && <AgentBuilder />}
          {active === "prompt" && <PromptLab />}
          {active === "dataset" && <DatasetForge />}
        </section>
      </div>
    </main>
  );
}
