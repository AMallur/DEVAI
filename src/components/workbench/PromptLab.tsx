"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { copyText, downloadText, estimateTokens } from "./utils";

function variablesIn(value: string) {
  return Array.from(value.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g), (match) => match[1]).filter((item, index, all) => all.indexOf(item) === index);
}

function compile(value: string, variables: Record<string, unknown>) {
  return value.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => String(variables[key] ?? `{{${key}}}`));
}

export default function PromptLab() {
  const [system, setSystem] = useState("You are a technical reviewer. Return concise, actionable feedback for {{product}}.");
  const [prompt, setPrompt] = useState("Review this developer question and propose the next step:\n\n{{question}}");
  const [casesInput, setCasesInput] = useState('{"product":"DEVAI","question":"How should I validate a fine-tuning dataset?"}\n{"product":"DEVAI","question":"How do I define tools for an agent?"}');
  const [model, setModel] = useState("gpt-4.1-mini");
  const [temperature, setTemperature] = useState(0.2);
  const [copied, setCopied] = useState(false);

  const variableNames = useMemo(() => variablesIn(`${system}\n${prompt}`), [system, prompt]);
  const parsed = useMemo(() => {
    const cases: Record<string, unknown>[] = [];
    const issues: string[] = [];
    casesInput.split(/\r?\n/).filter((line) => line.trim()).forEach((line, index) => {
      try {
        const value = JSON.parse(line);
        if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("must be an object");
        cases.push(value as Record<string, unknown>);
        const missing = variableNames.filter((name) => !(name in value));
        if (missing.length) issues.push(`Line ${index + 1}: missing ${missing.join(", ")}`);
      } catch (error) {
        issues.push(`Line ${index + 1}: ${error instanceof Error ? error.message : "invalid JSON"}`);
      }
    });
    if (!cases.length && !issues.length) issues.push("Add at least one JSONL test case.");
    return { cases, issues };
  }, [casesInput, variableNames]);

  const suite = useMemo(() => parsed.cases.map((variables, index) => ({
    id: `case-${index + 1}`,
    model,
    temperature,
    variables,
    messages: [
      { role: "system", content: compile(system, variables) },
      { role: "user", content: compile(prompt, variables) },
    ],
  })), [parsed.cases, model, temperature, system, prompt]);

  const output = JSON.stringify(suite, null, 2);
  const estimated = suite.reduce((total, item) => total + estimateTokens(item.messages.map((message) => message.content).join("\n")), 0);

  async function handleCopy() {
    await copyText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="tool-layout two-column">
      <section className="panel">
        <div className="panel-head"><span className="panel-label">Prompt template</span></div>
        <div className="panel-scroll">
          <div className="form-stack">
            <label className="field">
              <span className="field-label">System message</span>
              <textarea className="textarea" style={{ minHeight: 105 }} value={system} onChange={(event) => setSystem(event.target.value)} spellCheck={false} />
            </label>
            <label className="field">
              <span className="field-label">User prompt</span>
              <textarea className="textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} spellCheck={false} />
              <p className="helper">Use <span className="kbd">{"{{variable}}"}</span> syntax. Detected: {variableNames.join(", ") || "none"}.</p>
            </label>
            <label className="field">
              <span className="field-label">Test cases · one JSON object per line</span>
              <textarea className="textarea" value={casesInput} onChange={(event) => setCasesInput(event.target.value)} spellCheck={false} />
            </label>
            <div className="field-row">
              <label className="field">
                <span className="field-label">Target model</span>
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
          </div>
        </div>
      </section>

      <section className="panel code-panel">
        <div className="panel-head">
          <span className="panel-label">Compiled test suite</span>
          <div className="header-actions">
            <button className="button" disabled={!suite.length} onClick={handleCopy}><Icon name="copy" size={13} /> {copied ? "Copied" : "Copy"}</button>
            <button className="button primary" disabled={!suite.length || parsed.issues.length > 0} onClick={() => downloadText("prompt-test-suite.json", output, "application/json")}><Icon name="download" size={13} /> Export</button>
          </div>
        </div>
        <div className="panel-scroll">
          <div className="form-stack">
            <div className="metric-row">
              <div className="metric"><span className="metric-value">{suite.length}</span><span className="metric-name">compiled cases</span></div>
              <div className="metric"><span className="metric-value">{variableNames.length}</span><span className="metric-name">variables</span></div>
              <div className="metric"><span className="metric-value">~{estimated}</span><span className="metric-name">input tokens</span></div>
            </div>
            {parsed.issues.length > 0 ? (
              <div className="issue-list">{parsed.issues.map((issue) => <div className="issue" key={issue}>{issue}</div>)}</div>
            ) : (
              <div className="empty-state">All cases compile. The exported suite is ready for a server-side model runner or evaluation harness.</div>
            )}
            <div className="result-box">
              <div className="result-toolbar"><span>prompt-test-suite.json</span><span>{output.length} bytes</span></div>
              <pre className="result-content">{output || "[]"}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
