"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firestore";

export interface Work {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  client: string;
  stat: string;
  images: string[];
  videoUrl: string;
  order: number;
}

const EMPTY_FORM = {
  title: "",
  category: "",
  badge: "",
  description: "",
  client: "",
  stat: "",
  imagesText: "",
  videoUrl: "",
  order: 1,
};

const DEFAULT_WORKS = [
  {
    title: "B2B Business Setup Lead Funnel",
    category: "Lead Gen",
    badge: "ROI 4.8x",
    description:
      "Custom lead-acquisition system targeting corporate service seekings, business formation leads and trade licensing queries in Dubai.",
    client: "Client: Links Consultants",
    stat: "320 Leads Captured",
    images: [] as string[],
    videoUrl: "",
    order: 1,
  },
  {
    title: "Local SEO Dominance Plan",
    category: "SEO Optimization",
    badge: "CTR +35%",
    description:
      "Structured schema setup, optimized map citations and organic localized content ranking targeting business licensing query segments.",
    client: "Domain Focus: Google.ae",
    stat: "#2 Ranked Term",
    images: [] as string[],
    videoUrl: "",
    order: 2,
  },
  {
    title: "Dubai B2B Promo Videography",
    category: "Video Ads",
    badge: "Views +60%",
    description:
      "Shot, presented and edited high-pace video advertising hooks tailored to boost conversion rates and outbound landing page clicks.",
    client: "Format: CapCut Edit",
    stat: "50+ Campaigns Ran",
    images: [] as string[],
    videoUrl: "",
    order: 3,
  },
];

function parseImages(text: string): string[] {
  return text
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);
}

export default function WorksManager() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "works"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setWorks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Work, "id">) })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function startAdd() {
    setEditId(null);
    setIsAdding(true);
    setForm({ ...EMPTY_FORM, order: works.length + 1 });
  }

  function startEdit(work: Work) {
    setIsAdding(false);
    setEditId(work.id);
    setForm({
      title: work.title,
      category: work.category,
      badge: work.badge,
      description: work.description,
      client: work.client,
      stat: work.stat,
      imagesText: (work.images ?? []).join("\n"),
      videoUrl: work.videoUrl ?? "",
      order: work.order,
    });
  }

  function cancelForm() {
    setEditId(null);
    setIsAdding(false);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        category: form.category.trim(),
        badge: form.badge.trim(),
        description: form.description.trim(),
        client: form.client.trim(),
        stat: form.stat.trim(),
        images: parseImages(form.imagesText),
        videoUrl: form.videoUrl.trim(),
        order: Number(form.order) || 0,
      };
      if (editId) {
        await updateDoc(doc(db, "works", editId), data);
      } else {
        await addDoc(collection(db, "works"), { ...data, createdAt: serverTimestamp() });
      }
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this work item?")) return;
    await deleteDoc(doc(db, "works", id));
    if (editId === id) cancelForm();
  }

  async function seedDefaults() {
    setSeeding(true);
    try {
      for (const w of DEFAULT_WORKS) {
        await addDoc(collection(db, "works"), { ...w, createdAt: serverTimestamp() });
      }
    } finally {
      setSeeding(false);
    }
  }

  const showForm = isAdding || editId !== null;
  const previews = parseImages(form.imagesText);

  if (loading) return <div style={s.centered}>Loading…</div>;

  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={s.sectionTitle}>Works</span>
          <span style={s.count}>{works.length} item{works.length !== 1 ? "s" : ""}</span>
        </div>
        <button onClick={startAdd} style={s.addBtn}>+ Add Work</button>
      </div>

      <div style={s.panel}>
        {/* Left: work list */}
        <div style={s.listCol}>
          {works.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ fontSize: "32px", margin: 0 }}>🗂️</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "8px 0 16px" }}>
                No works yet
              </p>
              <button
                onClick={seedDefaults}
                disabled={seeding}
                style={s.seedBtn}
              >
                {seeding ? "Seeding…" : "Seed Default Works"}
              </button>
            </div>
          ) : (
            <div style={s.listScroll}>
              {works.map((w) => (
                <div
                  key={w.id}
                  style={{
                    ...s.workItem,
                    borderColor: editId === w.id ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)",
                    background: editId === w.id ? "rgba(99,102,241,0.07)" : "transparent",
                  }}
                >
                  <div style={s.workItemMain}>
                    {w.images?.[0] && (
                      <img
                        src={w.images[0]}
                        alt={w.title}
                        style={s.thumbnail}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                    <div style={s.workItemInfo}>
                      <span style={s.workOrder}>#{w.order}</span>
                      <p style={s.workTitle}>{w.title}</p>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        <span style={s.workCategoryTag}>{w.category}</span>
                        {w.videoUrl && <span style={s.videoTag}>▶ Video</span>}
                        {w.images?.length > 0 && (
                          <span style={s.imgTag}>🖼 {w.images.length}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={s.workActions}>
                    <button onClick={() => startEdit(w)} style={s.editBtn} title="Edit">✏️</button>
                    <button
                      onClick={() => handleDelete(w.id)}
                      style={s.delBtn}
                      title="Delete"
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: form or prompt */}
        <div style={s.formCol}>
          {showForm ? (
            <div style={s.formInner}>
              <h3 style={s.formTitle}>{editId ? "Edit Work" : "Add New Work"}</h3>

              {/* Title */}
              <div style={s.field}>
                <label style={s.label}>Title *</label>
                <input
                  style={s.input}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. B2B Lead Funnel Campaign"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Category + Badge */}
              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.label}>Category Tag</label>
                  <input
                    style={s.input}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Lead Gen"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Result Badge</label>
                  <input
                    style={s.input}
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="e.g. ROI 4.8x"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea
                  style={{ ...s.input, height: "76px", resize: "vertical" } as React.CSSProperties}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the campaign or project..."
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Client + Stat */}
              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.label}>Client / Left Footer</label>
                  <input
                    style={s.input}
                    value={form.client}
                    onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                    placeholder="Client: Links Consultants"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Stat / Right Footer</label>
                  <input
                    style={s.input}
                    value={form.stat}
                    onChange={(e) => setForm((f) => ({ ...f, stat: e.target.value }))}
                    placeholder="320 Leads Captured"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div style={s.field}>
                <label style={s.label}>
                  Image URLs
                  <span style={s.hint}> — one URL per line</span>
                </label>
                <textarea
                  style={{ ...s.input, height: "88px", resize: "vertical", fontFamily: "monospace", fontSize: "12px" } as React.CSSProperties}
                  value={form.imagesText}
                  onChange={(e) => setForm((f) => ({ ...f, imagesText: e.target.value }))}
                  placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg\n(use Cloudinary, Google Drive, Imgur...)"}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                {/* Image preview strip */}
                {previews.length > 0 && (
                  <div style={s.previewRow}>
                    {previews.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Preview ${i + 1}`}
                        style={s.previewImg}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL + Order */}
              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.label}>Video Link</label>
                  <input
                    style={s.input}
                    value={form.videoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Display Order</label>
                  <input
                    type="number"
                    style={s.input}
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                    placeholder="1"
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={s.formActions}>
                <button onClick={cancelForm} style={s.cancelBtn}>Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title.trim()}
                  style={{
                    ...s.saveBtn,
                    opacity: saving || !form.title.trim() ? 0.6 : 1,
                    cursor: saving || !form.title.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving…" : editId ? "Save Changes" : "Add Work"}
                </button>
              </div>
            </div>
          ) : (
            <div style={s.emptyForm}>
              <p style={{ fontSize: "36px", margin: 0 }}>✏️</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "12px" }}>
                Click ✏️ to edit a work, or click{" "}
                <span style={{ color: "#818cf8" }}>+ Add Work</span> above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  centered: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", color: "rgba(255,255,255,0.4)" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  sectionTitle: { color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" },
  count: { color: "rgba(255,255,255,0.25)", fontSize: "12px" },
  addBtn: { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  panel: { display: "grid", gridTemplateColumns: "260px 1fr", gap: "16px", minHeight: "500px" },
  listCol: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" },
  listScroll: { overflowY: "auto", flex: 1 },
  workItem: { borderBottom: "1px solid", padding: "12px", transition: "background 0.15s", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" },
  workItemMain: { display: "flex", gap: "10px", flex: 1, alignItems: "flex-start", minWidth: 0 },
  thumbnail: { width: "44px", height: "44px", borderRadius: "6px", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" },
  workItemInfo: { display: "flex", flexDirection: "column", gap: "3px", flex: 1, minWidth: 0 },
  workOrder: { color: "rgba(255,255,255,0.25)", fontSize: "10px", fontFamily: "monospace" },
  workTitle: { color: "#fff", fontSize: "12px", fontWeight: 600, margin: 0, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  workCategoryTag: { background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: "10px", padding: "1px 6px", borderRadius: "4px" },
  videoTag: { background: "rgba(239,68,68,0.12)", color: "#f87171", fontSize: "10px", padding: "1px 6px", borderRadius: "4px" },
  imgTag: { color: "rgba(255,255,255,0.3)", fontSize: "10px", padding: "1px 4px" },
  workActions: { display: "flex", gap: "4px", flexShrink: 0 },
  editBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "12px" },
  delBtn: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "12px", transition: "background 0.2s" },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", color: "rgba(255,255,255,0.3)", textAlign: "center" },
  seedBtn: { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px", color: "#818cf8", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  formCol: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", display: "flex", flexDirection: "column" },
  formInner: { padding: "24px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", flex: 1 },
  formTitle: { color: "#fff", fontSize: "16px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  hint: { color: "rgba(255,255,255,0.25)", fontSize: "10px", textTransform: "none", letterSpacing: "0", fontWeight: 400 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", outline: "none", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box" },
  previewRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" },
  previewImg: { width: "56px", height: "56px", borderRadius: "6px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" },
  formActions: { display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" },
  cancelBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.6)", padding: "9px 18px", fontSize: "13px", fontWeight: 500, cursor: "pointer" },
  saveBtn: { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: "8px", color: "#fff", padding: "9px 24px", fontSize: "13px", fontWeight: 600 },
  emptyForm: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" },
};
