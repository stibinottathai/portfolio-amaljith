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
} from "firebase/firestore";
import { db } from "@/lib/firestore";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  read: boolean;
  createdAt: { seconds: number } | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  "lead-gen": "Lead Generation",
  seo: "SEO Audit",
  social: "Social Media Strategy",
  video: "Videography / Production",
  all: "Full Funnel Consultation",
};

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items: Enquiry[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Enquiry, "id">),
      }));
      setEnquiries(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function markAsRead(id: string) {
    await updateDoc(doc(db, "enquiries", id), { read: true });
    if (selected?.id === id) setSelected((p) => p && { ...p, read: true });
  }

  async function deleteEnquiry(id: string) {
    await deleteDoc(doc(db, "enquiries", id));
    setSelected(null);
  }

  function openEnquiry(enq: Enquiry) {
    setSelected(enq);
    if (!enq.read) markAsRead(enq.id);
  }

  function formatDate(ts: { seconds: number } | null) {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div>
      {/* Stats */}
      <div style={s.statsRow}>
        {[
          { icon: "📨", value: enquiries.length, label: "Total" },
          { icon: "🔴", value: unread, label: "Unread" },
          { icon: "✅", value: enquiries.length - unread, label: "Read" },
        ].map((st) => (
          <div key={st.label} style={s.statCard}>
            <span>{st.icon}</span>
            <p style={s.statValue}>{st.value}</p>
            <p style={s.statLabel}>{st.label}</p>
          </div>
        ))}
      </div>

      <div style={s.panel}>
        {/* List */}
        <div style={s.listCol}>
          <div style={s.listHeader}>
            <span style={s.listTitle}>Enquiries</span>
            {unread > 0 && <span style={s.badge}>{unread} new</span>}
          </div>
          {loading ? (
            <div style={s.emptyState}>Loading…</div>
          ) : enquiries.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ margin: 0, fontSize: "32px" }}>📭</p>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                No enquiries yet
              </p>
            </div>
          ) : (
            <div style={s.listScroll}>
              {enquiries.map((enq) => (
                <button
                  key={enq.id}
                  onClick={() => openEnquiry(enq)}
                  style={{
                    ...s.listItem,
                    background: selected?.id === enq.id ? "rgba(99,102,241,0.1)" : "transparent",
                    borderColor: selected?.id === enq.id ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={s.listItemTop}>
                    <span style={s.listName}>
                      {!enq.read && <span style={s.dot} />}
                      {enq.name}
                    </span>
                    <span style={s.listDate}>{formatDate(enq.createdAt)}</span>
                  </div>
                  <p style={s.listEmail}>{enq.email}</p>
                  <span style={s.categoryTag}>
                    {CATEGORY_LABELS[enq.category] ?? enq.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div style={s.detailCol}>
          {selected ? (
            <>
              <div style={s.detailHeader}>
                <div>
                  <h2 style={s.detailName}>{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} style={s.detailEmail}>
                    {selected.email}
                  </a>
                </div>
                <button
                  onClick={() => deleteEnquiry(selected.id)}
                  style={s.deleteBtn}
                  title="Delete enquiry"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                >
                  🗑
                </button>
              </div>
              <div style={s.metaRow}>
                {[
                  { label: "Category", value: CATEGORY_LABELS[selected.category] ?? selected.category },
                  { label: "Received", value: formatDate(selected.createdAt) },
                  {
                    label: "Status",
                    value: selected.read ? "✓ Read" : "● Unread",
                    color: selected.read ? "#34d399" : "#f87171",
                  },
                ].map((m) => (
                  <div key={m.label} style={s.metaItem}>
                    <span style={s.metaLabel}>{m.label}</span>
                    <span style={{ ...s.metaValue, ...(m.color ? { color: m.color } : {}) }}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
              <div style={s.messageBox}>
                <p style={s.messageLabel}>Message</p>
                <p style={s.messageText}>
                  {selected.message || (
                    <em style={{ opacity: 0.4 }}>No message provided.</em>
                  )}
                </p>
              </div>
              <a
                href={`mailto:${selected.email}?subject=Re: ${CATEGORY_LABELS[selected.category] ?? "Your Enquiry"}&body=Hi ${selected.name},%0A%0AThank you for reaching out...`}
                style={s.replyBtn}
              >
                ✉ Reply via Email
              </a>
            </>
          ) : (
            <div style={s.emptyDetail}>
              <p style={{ fontSize: "40px", margin: 0 }}>👈</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "12px" }}>
                Select an enquiry to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "4px" },
  statValue: { color: "#fff", fontSize: "22px", fontWeight: 700, margin: "4px 0 0" },
  statLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 },
  panel: { display: "grid", gridTemplateColumns: "320px 1fr", gap: "16px", minHeight: "480px" },
  listCol: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" },
  listHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  listTitle: { color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" },
  badge: { background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", border: "1px solid rgba(99,102,241,0.3)" },
  listScroll: { overflowY: "auto", flex: 1 },
  listItem: { width: "100%", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", cursor: "pointer", transition: "background 0.15s", display: "block" },
  listItemTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" },
  listName: { color: "#fff", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block" },
  listDate: { color: "rgba(255,255,255,0.25)", fontSize: "10px", whiteSpace: "nowrap" },
  listEmail: { color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "0 0 6px" },
  categoryTag: { display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "2px 7px", fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 500 },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", color: "rgba(255,255,255,0.3)", fontSize: "14px" },
  detailCol: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" },
  emptyDetail: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  detailName: { color: "#fff", fontSize: "20px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" },
  detailEmail: { color: "#818cf8", fontSize: "14px", textDecoration: "none" },
  deleteBtn: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px", transition: "background 0.2s" },
  metaRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px" },
  metaItem: { display: "flex", flexDirection: "column", gap: "4px" },
  metaLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em" },
  metaValue: { color: "#fff", fontSize: "13px", fontWeight: 600 },
  messageBox: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", flex: 1 },
  messageLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" },
  messageText: { color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: "1.7", margin: 0 },
  replyBtn: { display: "block", textAlign: "center", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", borderRadius: "10px", padding: "12px", textDecoration: "none", fontSize: "14px", fontWeight: 600 },
};
