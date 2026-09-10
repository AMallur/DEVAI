import { PRODUCTS, statusLabel, type Product } from "@/data/products";

export default function ProductGrid() {
  return (
    <section id="products" className="alt">
      <div className="container">
        <p className="section-label">{"// portfolio"}</p>
        <h2 className="section-title">Everything, in one place</h2>
        <p className="section-sub">
          Every product and prototype gets a column here as it ships — this
          hub is built to keep growing.
        </p>

        <div className="product-grid">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
          <AddProductCard />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const Wrapper = product.url ? "a" : "div";
  const linkProps = product.url
    ? { href: product.url, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Wrapper className="product-card" {...linkProps}>
      <div className="product-card-head">
        <span className="product-mark">{product.mark}</span>
        <span className={`status-badge status-${product.status}`}>
          {statusLabel(product.status)}
        </span>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-tagline">{product.tagline}</p>
      <p className="product-desc">{product.description}</p>
      <span className="product-link">
        {product.url ? "Open →" : "Coming soon"}
      </span>
    </Wrapper>
  );
}

function AddProductCard() {
  return (
    <a
      className="product-card product-card-add"
      href="https://github.com/AMallur/DEVAI/blob/main/src/data/products.ts"
      target="_blank"
      rel="noreferrer"
    >
      <span className="product-add-mark">+</span>
      <span className="product-add-label">Add the next project</span>
    </a>
  );
}
