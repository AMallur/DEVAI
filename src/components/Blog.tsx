import { POSTS } from '@/data/posts';

export default function Blog() {
  return (
    <section id="blog" className="alt">
      <div className="container">
        <p className="section-label">{'// blog'}</p>
        <h2 className="section-title">Latest Posts</h2>
        <p className="section-sub">
          Tutorials, release notes, and deep-dives on building with Claude and MCP.
        </p>

        <div className="posts-list">
          {POSTS.map((post) => (
            <div className="post-item" key={post.title}>
              <span className="post-date">{post.date}</span>
              <span className="post-title">{post.title}</span>
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
