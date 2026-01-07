function Badge({ children, variant = "neutral" }) {
  const styles =
    variant === "danger"
      ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/50"
      : variant === "ok"
      ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/50"
      : "bg-slate-700 text-slate-200 border-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${styles}`}>
      {children}
    </span>
  );
}

export default function ProductCard({ product }) {
  const isBoycotted = !!product.isBoycotted;

  return (
    <div
      className={`rounded-3xl border-2 p-6 shadow-2xl transition-all hover:scale-[1.02] ${
        isBoycotted
          ? "border-red-600/50 bg-gradient-to-br from-red-950/40 to-slate-900/90 shadow-red-950/40"
          : "border-emerald-600/40 bg-gradient-to-br from-emerald-950/30 to-slate-900/90 shadow-emerald-950/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xl font-bold text-white">{product.name}</p>
          <p className="mt-2 text-base text-slate-300">
            {product.brand ? <span className="font-bold text-slate-200">{product.brand}</span> : null}
            {product.brand && product.category ? " • " : ""}
            {product.category ? <span className="text-slate-400">{product.category}</span> : ""}
          </p>
        </div>

        <Badge variant={isBoycotted ? "danger" : "ok"}>
          {isBoycotted ? "⚠️ مقاطع" : "✅ آمن"}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex items-center justify-between rounded-2xl border-2 border-slate-800/60 bg-slate-950/70 px-5 py-3.5">
          <span className="text-slate-400 font-semibold">🌍 البلد</span>
          <span className="font-bold text-white text-base">{product.country || "—"}</span>
        </div>

        {isBoycotted ? (
          <>
            <div className="rounded-2xl border-2 border-red-600/40 bg-red-950/40 px-5 py-4">
              <p className="text-sm font-bold text-red-300 flex items-center gap-2">
                <span>❌</span> سبب المقاطعة
              </p>
              <p className="mt-2 text-base text-slate-200 leading-relaxed">{product.reason || "This product is listed as boycotted."}</p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-600/40 bg-emerald-950/40 px-5 py-4">
              <p className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <span>🇹🇳</span> البديل التونسي المقترح
              </p>
              <p className="mt-2 text-base text-white font-semibold leading-relaxed">
                {product.tunisianAlternative || "Add an alternative in the database."}
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-emerald-600/40 bg-emerald-950/40 px-5 py-4">
            <p className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <span>✅</span> الحالة
            </p>
            <p className="mt-2 text-base text-white font-semibold">منتج غير مقاطع • Safe Product</p>
          </div>
        )}
      </div>
    </div>
  );
}
