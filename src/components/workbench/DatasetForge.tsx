"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import Icon from "./Icon";
import { downloadText, estimateTokens } from "./utils";

type DatasetFormat = "chat" | "classification";

const chatSample = `{"messages":[{"role":"system","content":"You are a concise support agent."},{"role":"user","content":"How do I export an agent?"},{"role":"assistant","content":"Open Agent Builder, validate the blueprint, then select Download blueprint."}]}
{"messages":[{"role":"system","content":"You are a concise support agent."},{"role":"user","content":"What file format does Dataset Forge use?"},{"role":"assistant","content":"Dataset Forge accepts newline-delimited JSON, commonly named .jsonl."}]}`;

const classificationSample = `{"text":"The termination date is missing from this agreement.","label":"missing_term"}
{"text":"Payment is due within thirty days of receipt.","label":"payment_terms"}`;

function validateRow(value: unknown, format: DatasetFormat) {
  if (!value || Array.isArray(value) || typeof value !== "object") return "row must be a JSON object";
  const row = value as Record<string, unknown>;
  if (format === "classification") {
    if (typeof row.text !== "string" || !row.text.trim()) return "text must be a non-empty string";
    if (typeof row.label !== "string" || !row.label.trim()) return "label must be a non-empty string";
    return null;
  }
  if (!Array.isArray(row.messages) || row.messages.length < 2) return "messages must contain at least two entries";
  for (const message of row.messages) {
    if (!message || typeof message !== "object") return "each message must be an object";
    const item = message as Record<string, unknown>;
    if (!["system", "user", "assistant"].includes(String(item.role))) return `unsupported role: ${String(item.role)}`;
    if (typeof item.content !== "string" || !item.content.trim()) return "message content must be non-empty";
  }
  return null;
}

export default function DatasetForge() {
  const [format, setFormat] = useState<DatasetFormat>("chat");
  const [input, setInput] = useState(chatSample);

  const report = useMemo(() => {
    const validRows: unknown[] = [];
    const issues: string[] = [];
    const fingerprints = new Set<string>();
    const lines = input.split(/\r?\n/).filter((line) => line.trim());
    let tokens = 0;

    lines.forEach((line, index) => {
      try {
        const value = JSON.parse(line);
        const validationError = validateRow(value, format);
        if (validationError) {
          issues.push(`Line ${index + 1}: ${validationError}`);
          return;
        }
        const fingerprint = JSON.stringify(value);
        if (fingerprints.has(fingerprint)) {
          issues.push(`Line ${index + 1}: duplicate example`);
          return;
        }
        fingerprints.add(fingerprint);
        validRows.push(value);
        tokens += estimateTokens(fingerprint);
      } catch (error) {
        issues.push(`Line ${index + 1}: ${error instanceof Error ? error.message : "invalid JSON"}`);
      }
    });
    if (!lines.length) issues.push("Dataset is empty.");
    return { validRows, issues, lines: lines.length, tokens };
  }, [input, format]);

  const cleaned = report.validRows.map((row) => JSON.stringify(row)).join("\n");

  function changeFormat(next: DatasetFormat) {
    setFormat(next);
    setInput(next === "chat" ? chatSample : classificationSample);
  }

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(String(reader.result ?? ""));
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="tool-layout two-column">
      <section className="panel">
        <div className="panel-head">
          <span className="panel-label">Source dataset</span>
          <label className="button" htmlFor="dataset-upload"><Icon name="upload" size={13} /> Upload JSONL</label>
          <input id="dataset-upload" className="file-input" type="file" accept=".jsonl,.json,text/plain,application/json" onChange={upload} />
        </div>
        <div className="panel-scroll">
          <div className="form-stack">
            <label className="field">
              <span className="field-label">Dataset format</span>
              <select className="select" value={format} onChange={(event) => changeFormat(event.target.value as DatasetFormat)}>
                <option value="chat">Chat fine-tuning</option>
                <option value="classification">Text classification</option>
              </select>
            </label>
            <label className="field">
              <span className="field-label">JSONL editor</span>
              <textarea className="textarea tall" value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
              <p className="helper">Every non-empty line must be one complete JSON object. Invalid and duplicate rows are excluded from the cleaned export.</p>
            </label>
          </div>
        </div>
      </section>

      <section className="panel code-panel">
        <div className="panel-head">
          <span className="panel-label">Validation report</span>
          <button className="button primary" disabled={!report.validRows.length} onClick={() => downloadText(`devai-${format}-cleaned.jsonl`, `${cleaned}\n`, "application/x-ndjson")}>
            <Icon name="download" size={13} /> Export {report.validRows.length} valid rows
          </button>
        </div>
        <div className="panel-scroll">
          <div className="form-stack">
            <div className="metric-row">
              <div className="metric"><span className="metric-value valid">{report.validRows.length}</span><span className="metric-name">valid rows</span></div>
              <div className="metric"><span className={`metric-value ${report.issues.length ? "invalid" : "valid"}`}>{report.issues.length}</span><span className="metric-name">issues</span></div>
              <div className="metric"><span className="metric-value">~{report.tokens}</span><span className="metric-name">estimated tokens</span></div>
            </div>

            {report.issues.length ? (
              <div className="issue-list">{report.issues.map((issue, index) => <div className="issue" key={`${issue}-${index}`}>{issue}</div>)}</div>
            ) : (
              <div className="empty-state">Validation passed. {report.validRows.length} unique rows are ready to export.</div>
            )}

            <div className="result-box">
              <div className="result-toolbar"><span>cleaned-preview.jsonl</span><span>{report.lines} source rows</span></div>
              <pre className="result-content">{cleaned || "No valid rows to preview."}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
