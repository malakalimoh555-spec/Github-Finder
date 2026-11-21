import { useEffect, useState } from "react";

const API = "https://api.github.com/users/";

function Stat({ label, value }) {
  return (
    <div className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-center">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!username) return;

    const controller = new AbortController();

    async function fetchUser() {
      setLoading(true);
      setError("");
      setUser(null);
      try {
        const res = await fetch(`${API}${username}`, {
          signal: controller.signal,
        });
        if (res.status === 404) throw new Error(`No GitHub user named "${username}".`);
        if (res.status === 403)
          throw new Error("GitHub rate limit reached. Try again in a few minutes.");
        if (!res.ok) throw new Error("Something went wrong. Please try again.");
        setUser(await res.json());
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchUser();
    return () => controller.abort(); 
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = input.trim();
    if (name) setUsername(name);
  };

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="mb-2 text-center text-4xl font-extrabold tracking-tight text-white">
          GitHub Finder
        </h1>
        <p className="mb-8 text-center text-slate-400">
          Type a username to see their public profile.
        </p>

        <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. torvalds"
            aria-label="GitHub username"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-10" role="status" aria-label="Loading">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-center text-red-300">
            {error}
          </p>
        )}

        {user && (
          <article className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={`${user.login} avatar`}
                className="h-24 w-24 rounded-full border-4 border-emerald-400 object-cover"
              />
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-bold">{user.name || user.login}</h2>
                <p className="text-slate-500">@{user.login}</p>
                <p className="text-sm text-slate-400">
                  Joined {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {user.bio && <p className="mt-4 text-slate-700">{user.bio}</p>}

            <div className="mt-5 flex gap-3">
              <Stat label="Repos" value={user.public_repos} />
              <Stat label="Followers" value={user.followers} />
              <Stat label="Following" value={user.following} />
            </div>

            <ul className="mt-5 space-y-1 text-sm text-slate-600">
              {user.location && <li>Location: {user.location}</li>}
              {user.company && <li>Company: {user.company}</li>}
              {user.blog && (
                <li>
                  Website:{" "}
                  <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 underline"
                  >
                    {user.blog}
                  </a>
                </li>
              )}
            </ul>

            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block rounded-xl bg-slate-900 py-3 text-center font-semibold text-white transition hover:bg-slate-700"
            >
              View on GitHub
            </a>
          </article>
        )}
      </div>
    </main>
  );
}
