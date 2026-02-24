import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "public", "posts");

function getPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const slug = file.replace(/\.md$/, "");
      return { slug, content };
    })
    .sort((a, b) => (a.slug < b.slug ? 1 : -1)); // newest first assuming ISO dates
}

function renderMarkdown(md: string) {
  return md
    .trim()
    .split(/\n\s*\n/)
    .map((block, idx) => {
      if (block.startsWith("# ")) {
        return (
          <h2 key={idx} className="text-2xl font-semibold text-white">
            {block.replace(/^#\s*/, "")}
          </h2>
        );
      }
      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter(Boolean)
          .map((item) => item.replace(/^-\s*/, ""));
        return (
          <ul key={idx} className="list-disc space-y-1 pl-5 text-zinc-300">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="leading-relaxed text-zinc-200">
          {block}
        </p>
      );
    });
}

export default function Home({
  searchParams,
}: {
  searchParams: { post?: string };
}) {
  const posts = getPosts();
  const currentIndex = searchParams.post
    ? posts.findIndex((post) => post.slug === searchParams.post)
    : 0;
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentPost = posts[safeIndex];
  const prev = posts[safeIndex + 1];
  const next = safeIndex > 0 ? posts[safeIndex - 1] : undefined;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
        <header className="space-y-2 border-b border-white/10 pb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Blog</p>
          <h1 className="text-4xl font-semibold">Build logs & aprendizajes diarios</h1>
          <p className="text-zinc-400">
            Lectura ultra minimal: un post Markdown por día, directo desde `/public/posts`.
          </p>
        </header>

        {currentPost ? (
          <article className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(15,15,15,0.6)]">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>{currentPost.slug}</span>
              <div className="flex gap-2 text-xs">
                <a
                  href={prev ? `/?post=${prev.slug}` : "#"}
                  aria-disabled={!prev}
                  className={`rounded-full border px-3 py-1 ${
                    prev ? "border-white/30 hover:border-white" : "border-white/10 text-zinc-600"
                  }`}
                >
                  ← anterior
                </a>
                <a
                  href={next ? `/?post=${next.slug}` : "#"}
                  aria-disabled={!next}
                  className={`rounded-full border px-3 py-1 ${
                    next ? "border-white/30 hover:border-white" : "border-white/10 text-zinc-600"
                  }`}
                >
                  siguiente →
                </a>
              </div>
            </div>
            <div className="space-y-4">{renderMarkdown(currentPost.content)}</div>
          </article>
        ) : (
          <p className="text-zinc-400">No hay entradas todavía. Escribe la primera en `public/posts`.</p>
        )}

        <aside className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Archivo</p>
          <div className="flex flex-wrap gap-2">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/?post=${post.slug}`}
                className={`rounded-full border px-3 py-1 ${
                  currentPost?.slug === post.slug
                    ? "border-white bg-white/10 text-white"
                    : "border-white/20 text-zinc-300"
                }`}
              >
                {post.slug}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
