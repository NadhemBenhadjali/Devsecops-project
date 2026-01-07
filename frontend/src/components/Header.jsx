import { useAuth } from "../auth/AuthContext.jsx";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200">
      {children}
    </span>
  );
}

export default function Header({ onAdd, onLogin }) {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();

  return (
    <header className="border-b border-red-900/40 bg-slate-950/90 backdrop-blur-xl shadow-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-4">
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-900/50">
            <span className="text-2xl">🇹🇳</span>
          </div>
          <div>
            <p className="text-2xl font-bold leading-tight text-white">ConsumeSafe</p>
            <p className="text-sm text-slate-400 font-semibold">استهلك بوعي • Consommez consciemment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Badge>
                {user.email} • {user.role}
              </Badge>

              {isAdmin ? (
                <button
                  onClick={onAdd}
                  className="rounded-xl border border-red-700/50 bg-gradient-to-br from-red-600 to-red-700 px-4 py-2 text-sm font-bold text-white hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-red-900/50"
                >
                  ➕ Add product
                </button>
              ) : null}

              <button
                onClick={logout}
                className="rounded-xl bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/30 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
