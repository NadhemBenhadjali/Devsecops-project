import { useState } from "react";
import axios from "axios";

export default function AddProductModal({ open, onClose, api }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    country: "",
    isBoycotted: false,
    reason: "",
    tunisianAlternative: ""
  });

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/products`, form);
      onClose();
      setForm({
        name: "",
        brand: "",
        category: "",
        country: "",
        isBoycotted: false,
        reason: "",
        tunisianAlternative: ""
      });
      alert("✅ Product added!");
    } catch (err) {
      alert("❌ Failed to add product. Make sure backend is running.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-3xl border-2 border-red-900/40 bg-slate-900 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-white">➕ أضف منتج جديد</p>
            <p className="mt-2 text-base text-slate-400">Add a new product to the database • سيتم حفظه في قاعدة البيانات</p>
          </div>
          <button onClick={onClose} className="rounded-xl border-2 border-red-700/50 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-900/40 transition-all">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-200">اسم المنتج • Product name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-2xl border-2 border-red-900/40 bg-slate-950/70 px-5 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
              placeholder="e.g. Pepsi, Coca-Cola..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-bold text-slate-200">العلامة التجارية • Brand</label>
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="rounded-2xl border-2 border-red-900/40 bg-slate-950/70 px-5 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-bold text-slate-200">الفئة • Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-2xl border-2 border-red-900/40 bg-slate-950/70 px-5 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-bold text-slate-200">البلد • Country</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="rounded-2xl border-2 border-red-900/40 bg-slate-950/70 px-5 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
                placeholder="Tunisia, USA, France..."
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border-2 border-red-900/40 bg-slate-950/70 px-5 py-3">
              <input
                id="boycott"
                type="checkbox"
                checked={form.isBoycotted}
                onChange={(e) => setForm({ ...form, isBoycotted: e.target.checked })}
                className="h-5 w-5 rounded accent-red-600"
              />
              <label htmlFor="boycott" className="text-sm font-bold text-slate-200">مقاطع • Boycotted</label>
            </div>
          </div>

          {form.isBoycotted ? (
            <>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-200">سبب المقاطعة • Reason</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  rows="3"
                  className="rounded-2xl border-2 border-red-900/40 bg-slate-950/70 px-5 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-200">🇹🇳 البديل التونسي • Tunisian alternative</label>
                <input
                  value={form.tunisianAlternative}
                  onChange={(e) => setForm({ ...form, tunisianAlternative: e.target.value })}
                  className="rounded-2xl border-2 border-emerald-900/40 bg-emerald-950/30 px-5 py-3 text-white outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 transition-all"
                  placeholder="e.g. Boga, Délice, Vitalait..."
                />
              </div>
            </>
          ) : null}

          <button className="mt-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-bold text-white text-lg hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-red-900/50">
            💾 حفظ • Save
          </button>
        </form>
      </div>
    </div>
  );
}
