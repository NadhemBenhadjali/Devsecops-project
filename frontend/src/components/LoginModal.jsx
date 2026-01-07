import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      login(data);
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold">Login</p>
            <p className="mt-1 text-sm text-slate-400">
              Admins can add products. Users can only search.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-700 px-3 py-2 text-sm hover:bg-slate-900"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 outline-none focus:border-emerald-500"
              placeholder="admin@consumesafe.tn"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 outline-none focus:border-emerald-500"
              type="password"
              required
            />
          </div>

          {err ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {err}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-400">
          Test admin (from seed):
          <span className="ml-2 text-slate-200 font-semibold">
            admin@consumesafe.tn / Admin123!
          </span>
        </div>
      </div>
    </div>
  );
}
