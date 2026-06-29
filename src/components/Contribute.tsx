export default function Contribute() {
  return (
    <section id="contribute">
      <div className="container">
        <div className="cta-box">
          <div>
            <p className="cta-label">{'// open source'}</p>
            <h2 className="cta-title">Ship a tool. Reach every agent builder.</h2>
            <p className="cta-sub">
              Have an MCP server, Colab notebook, or utility script that belongs here?
              Submit a PR or open an issue — getting listed takes under 10 minutes.
            </p>
          </div>
          <div className="cta-actions">
            <a
              className="cta-link cta-link-primary"
              href="https://github.com/AMallur/DEVAI/issues/new?template=submit-tool.md"
              target="_blank"
              rel="noreferrer"
            >
              + Submit a Tool
            </a>
            <a
              className="cta-link cta-link-secondary"
              href="https://github.com/AMallur/DEVAI"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
