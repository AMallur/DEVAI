"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { copyText, downloadText, slugify } from "./utils";

const availableTools = ["Web search", "File search", "Code interpreter", "HTTP request"];

export default function AgentBuilder() {
  const [name, setName] = useState("support-agent");
  const [instructions, setInstructions] = useState("You are a precise support agent for DEVAI users.\n\n- Answer with verifiable steps.\n- State assumptions when context is missing.\n- Use tools only when they improve the answer.");
  const [model, setModel] = useState("gpt-4.1");
  const [temperature, setTemperature] = useState(0.3);
  const [guardrail, setGuardrail] = useState("Never expose secrets, credentials, or private user data.");
  const [selectedTools, setSelectedTools] = useState(["Web search", "Code interpreter"]);
  const [language, setLanguage] = useState<"typescript" | "python">("typescript");
  const [copied, setCopied] = useState(false);

  const blueprint = useMemo(() => ({
    schemaVersion: "1.0",
    name: slugify(name),
    model,
    instructions: instructions.trim(),
    modelSettings: { temperature },
    tools: selectedTools.map((tool) => tool.toLowerCase().replaceAll(" ", "_")),
    guardrails: guardrail.trim() ? [guardrail.trim()] : [],
  }), [name, model, instructions, temperature, selectedTools, guardrail]);

  const errors = [
    ...(name.trim().length < 3 ? ["Agent name must be at least 3 characters."] : []),
    ...(instructions.trim().length < 30 ? ["Instructions must be at least 30 characters."] : []),
  ];

  const typescript = `export type AgentBlueprint = {
  schemaVersion: "1.0";
  name: string;
  model: string;
  instructions: string;
  modelSettings: { temperature: number };
  tools: string[];
  guardrails: string[];
};

export const agent: AgentBlueprint = ${JSON.stringify(blueprint, null, 2)};

// Bind this portable blueprint to your provider adapter.
export function createRun(input: string) {
  if (!input.trim()) throw new Error("Input is required");
  return { agent, input: input.trim() };
}`;

  const python = `from dataclasses import dataclass, field
from typing import List

@dataclass(frozen=True)
class AgentBlueprint:
    name: str
    model: str
    instructions: str
    temperature: float
    tools: List[str] = field(default_factory=list)
    guardrails: List[str] = field(default_factory=list)

agent = AgentBlueprint(
    name=${JSON.stringify(blueprint.name)},
    model=${JSON.stringify(model)},
    instructions=${JSON.stringify(blueprint.instructions)},
    temperature=${temperature},
    tools=${JSON.stringify(blueprint.tools)},
    guardrails=${JSON.stringify(blueprint.guardrails)},
)

# Bind this portable blueprint to your provider adapter.
def create_run(user_input: str):
    if not user_input.strip():
        raise ValueError("Input is required")
    return {"agent": agent, "input": user_input.strip()}`;

  const code = language === "typescript" ? typescript : python;

  function toggleTool(tool: string) {
    setSelectedTools((current) => current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool]);
  }

  async function handleCopy() {
    await copyText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="tool-layout">
      <section className="panel">
        <div className="panel-head"><span className="panel-label">Agent configuration</span></div>
        <div className="panel-scroll">
          <div className="form-stack">
            <label className="field">
              <span className="field-label">Agent name</span>
              <input className="input" value={name} onChange={(event) => setName(event.target.value)} spellCheck={false} />
            </label>
            <label className="field">
              <span className="field-label">System instructions</span>
              <textarea className="textarea" value={instructions} onChange={(event) => setInstructions(event.target.value)} spellCheck={false} />
            </label>
            <div className="field-row">
              <label className="field">
                <span className="field-label">Model</span>
                <select className="select" value={model} onChange={(event) => setModel(event.target.value)}>
                  <option value="gpt-4.1">gpt-4.1</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                </select>
              </label>
              <label className="field">
                <span className="field-label">Temperature</span>
                <span className="range-row">
                  <input className="range" type="range" min="0" max="2" step="0.1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
                  <span className="range-value">{temperature.toFixed(1)}</span>
                </span>
              </label>
            </div>
            <div className="field">
              <span className="field-label">Tools</span>
              <div className="tool-toggles">
                {availableTools.map((tool) => (
                  <button key={tool} className={`tool-toggle ${selectedTools.includes(tool) ? "selected" : ""}`} onClick={() => toggleTool(tool)}>{tool}</button>
                ))}
              </div>
              <p className="helper">Tool names are exported as adapter-neutral capabilities.</p>
            </div>
            <label className="field">
              <span className="field-label">Guardrail</span>
              <textarea className="textarea" style={{ minHeight: 86 }} value={guardrail} onChange={(event) => setGuardrail(event.target.value)} />
            </label>
          </div>
        </div>
      </section>

      <section className="panel code-panel">
        <div className="panel-head">
          <span className="panel-label">Implementation starter</span>
          <div className="header-actions">
            <button className="button" onClick={handleCopy}><Icon name="copy" size={13} /> {copied ? "Copied" : "Copy"}</button>
          </div>
        </div>
        <div className="code-tabs">
          <button className={`code-tab ${language === "typescript" ? "active" : ""}`} onClick={() => setLanguage("typescript")}>TypeScript</button>
          <button className={`code-tab ${language === "python" ? "active" : ""}`} onClick={() => setLanguage("python")}>Python</button>
        </div>
        <pre className="code"><code>{code}</code></pre>
      </section>

      <aside className="panel inspector">
        <div className="panel-head"><span className="panel-label">Inspector</span></div>
        <div className="panel-scroll">
          <div className="inspector-section">
            <span className="panel-label">Blueprint status</span>
            <div className="inspector-stat"><span>Validation</span><strong className={errors.length ? "invalid" : "valid"}>{errors.length ? `${errors.length} issue${errors.length > 1 ? "s" : ""}` : "Valid"}</strong></div>
            <div className="inspector-stat"><span>Capabilities</span><strong>{selectedTools.length}</strong></div>
            <div className="inspector-stat"><span>Schema</span><strong>1.0</strong></div>
            {errors.map((error) => <div className="issue" key={error}>{error}</div>)}
          </div>
          <div className="inspector-section">
            <span className="panel-label">Export</span>
            <button className="button primary" disabled={errors.length > 0} onClick={() => downloadText(`${blueprint.name}.agent.json`, JSON.stringify(blueprint, null, 2), "application/json")}>
              <Icon name="download" size={13} /> Download blueprint
            </button>
            <button className="button" disabled={errors.length > 0} onClick={() => downloadText(`${blueprint.name}.${language === "typescript" ? "ts" : "py"}`, code)}>
              <Icon name="download" size={13} /> Download starter
            </button>
          </div>
          <div className="inspector-section">
            <span className="panel-label">Portability</span>
            <p className="helper">The exported definition keeps provider credentials out of the browser and lets a server-side adapter execute it.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
