export function copyText(value: string) {
  return navigator.clipboard.writeText(value);
}

export function downloadText(filename: string, value: string, type = "text/plain") {
  const blob = new Blob([value], { type });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "agent";
}

export function estimateTokens(value: string) {
  return Math.max(1, Math.ceil(value.trim().length / 4));
}
