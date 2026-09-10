import { PRODUCTS } from "@/data/products";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-text">
        <p className="section-label">{"// home base"}</p>
        <h1>
          One place for <em>everything</em> I build
        </h1>
        <p>
          Aeryn is the base every one of my products ships from — a single
          hub that holds GoState, FableAgent, GAIA, RecallDock, and whatever
          comes next.
        </p>
        <div className="hero-btns">
          <a className="btn-primary" href="#products">View Products</a>
          <a
            className="btn-secondary"
            href="https://github.com/AMallur/DEVAI"
            target="_blank"
            rel="noreferrer"
          >
            View Source
          </a>
        </div>
      </div>

      <div className="hero-panel">
        <div className="panel-bar">
          <div className="dot dot-r" />
          <div className="dot dot-y" />
          <div className="dot dot-g" />
          <span className="panel-title">aeryn · status</span>
        </div>
        <div className="panel-body">
          {PRODUCTS.map((product) => (
            <div className="panel-row" key={product.slug}>
              <span className={`panel-dot panel-dot-${product.status}`} />
              <span className="panel-name">{product.name}</span>
              <span className="panel-status">{product.status.replace("-", " ")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
