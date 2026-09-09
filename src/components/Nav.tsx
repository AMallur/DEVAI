export default function Nav() {
  return (
    <nav className="site-nav">
      <a className="nav-logo" href="#top">
        aeryn<span>.</span>
      </a>
      <ul className="nav-links">
        <li><a href="#products">Products</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <a
        className="nav-cta"
        href="https://github.com/AMallur/DEVAI"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </nav>
  );
}
