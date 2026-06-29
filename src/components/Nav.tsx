export default function Nav() {
  return (
    <nav>
      <div className="nav-logo">
        dev<span>/</span>ai
      </div>
      <ul className="nav-links">
        <li><a href="#tools">Tools</a></li>
        <li><a href="#docs">Docs</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#contribute">Contribute</a></li>
      </ul>
      <a className="nav-cta" href="#contribute">+ Submit Tool</a>
    </nav>
  );
}
