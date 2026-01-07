export default function SearchBar({ value, onChange }) {
  return (
    <div className="rounded-3xl border-2 border-red-900/40 bg-slate-900/80 backdrop-blur-sm shadow-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-bold text-white flex items-center gap-2">
          🔍 ابحث عن منتج • Rechercher un produit
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Coca-Cola, Nestlé, Danone... "
          className="w-full rounded-2xl border-2 border-red-900/50 bg-slate-950/70 px-5 py-4 text-lg text-white placeholder:text-slate-500 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
        />
        <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-red-950/40 border-2 border-red-900/40 px-4 py-4 text-sm text-red-300 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
          مباشر
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400 flex items-start gap-2">
        <span>💡</span>
        <span>ابحث عن أي منتج للتحقق من حالته ومعرفة البدائل التونسية</span>
      </p>
    </div>
  );
}

