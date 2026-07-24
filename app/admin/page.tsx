"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firestore";
import { useRouter } from "next/navigation";

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

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);

  // Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
      } else {
        setUser(currentUser);
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Real-time enquiries listener
  useEffect(() => {
    if (checking) return;
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items: Enquiry[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Enquiry, "id">),
      }));
      setEnquiries(items);
      setLoadingEnquiries(false);
    });
    return () => unsub();
  }, [checking]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

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

  if (checking) {
    return (
      <div style={styles.root}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logoBox}>AK</div>
            <div>
              <h1 style={styles.title}>Admin Dashboard</h1>
              <p style={styles.subtitle}>{user?.email}</p>
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => (
              (e.currentTarget.style.background = "rgba(239,68,68,0.15)"),
              (e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"),
              (e.currentTarget.style.color = "#f87171")
            )}
            onMouseLeave={(e) => (
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)"),
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"),
              (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
            )}
          >
            Sign out
          </button>
        </header>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { icon: "📨", value: enquiries.length, label: "Total Enquiries" },
            { icon: "🔴", value: unread, label: "Unread" },
            { icon: "✅", value: enquiries.length - unread, label: "Read" },
            { icon: "🌐", label: "Live Site", value: "↗", href: "https://amaljith-d4d99.web.app" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href ?? undefined}
              target={s.href ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{ ...styles.statCard, textDecoration: "none", cursor: s.href ? "pointer" : "default" }}
            >
              <span style={styles.statIcon}>{s.icon}</span>
              <p style={styles.statValue}>{s.value}</p>
              <p style={styles.statLabel}>{s.label}</p>
            </a>
          ))}
        </div>

        {/* Enquiries panel */}
        <div style={styles.panel}>
          {/* List */}
          <div style={styles.listCol}>
            <div style={styles.listHeader}>
              <span style={styles.listTitle}>Enquiries</span>
              {unread > 0 && (
                <span style={styles.badge}>{unread} new</span>
              )}
            </div>

            {loadingEnquiries ? (
              <div style={styles.emptyState}>Loading…</div>
            ) : enquiries.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ margin: 0, fontSize: "32px" }}>📭</p>
                <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                  No enquiries yet
                </p>
              </div>
            ) : (
              <div style={styles.listScroll}>
                {enquiries.map((enq) => (
                  <button
                    key={enq.id}
                    onClick={() => openEnquiry(enq)}
                    style={{
                      ...styles.listItem,
                      background:
                        selected?.id === enq.id
                          ? "rgba(99,102,241,0.1)"
                          : "transparent",
                      borderColor:
                        selected?.id === enq.id
                          ? "rgba(99,102,241,0.4)"
                          : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={styles.listItemTop}>
                      <span style={styles.listName}>
                        {!enq.read && <span style={styles.dot} />}
                        {enq.name}
                      </span>
                      <span style={styles.listDate}>{formatDate(enq.createdAt)}</span>
                    </div>
                    <p style={styles.listEmail}>{enq.email}</p>
                    <span style={styles.categoryTag}>
                      {CATEGORY_LABELS[enq.category] ?? enq.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div style={styles.detailCol}>
            {selected ? (
              <>
                <div style={styles.detailHeader}>
                  <div>
                    <h2 style={styles.detailName}>{selected.name}</h2>
                    <a
                      href={`mailto:${selected.email}`}
                      style={styles.detailEmail}
                    >
                      {selected.email}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteEnquiry(selected.id)}
                    style={styles.deleteBtn}
                    title="Delete enquiry"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(239,68,68,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
                    }
                  >
                    🗑
                  </button>
                </div>

                <div style={styles.metaRow}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Category</span>
                    <span style={styles.metaValue}>
                      {CATEGORY_LABELS[selected.category] ?? selected.category}
                    </span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Received</span>
                    <span style={styles.metaValue}>{formatDate(selected.createdAt)}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Status</span>
                    <span
                      style={{
                        ...styles.metaValue,
                        color: selected.read ? "#34d399" : "#f87171",
                      }}
                    >
                      {selected.read ? "✓ Read" : "● Unread"}
                    </span>
                  </div>
                </div>

                <div style={styles.messageBox}>
                  <p style={styles.messageLabel}>Message</p>
                  <p style={styles.messageText}>
                    {selected.message || <em style={{ opacity: 0.4 }}>No message provided.</em>}
                  </p>
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${CATEGORY_LABELS[selected.category] ?? "Your Enquiry"}&body=Hi ${selected.name},%0A%0AThank you for reaching out...`}
                  style={styles.replyBtn}
                >
                  ✉ Reply via Email
                </a>
              </>
            ) : (
              <div style={styles.emptyDetail}>
                <p style={{ fontSize: "40px", margin: 0 }}>👈</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "12px" }}>
                  Select an enquiry to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0f",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  spinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "36px",
    height: "36px",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
  },
  orb1: {
    position: "fixed",
    top: "-15%",
    left: "-5%",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    bottom: "-20%",
    right: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "36px 24px 60px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "14px" },
  logoBox: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: "14px",
    letterSpacing: "0.05em",
  },
  title: { color: "#fff", fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" },
  subtitle: { color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: "2px 0 0" },
  logoutBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "7px 16px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statIcon: { fontSize: "22px" },
  statValue: { color: "#fff", fontSize: "22px", fontWeight: 700, margin: "4px 0 0", letterSpacing: "-0.02em" },
  statLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 },
  panel: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "16px",
    minHeight: "520px",
  },
  listCol: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  listTitle: { color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" },
  badge: {
    background: "rgba(99,102,241,0.2)",
    color: "#818cf8",
    fontSize: "11px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "999px",
    border: "1px solid rgba(99,102,241,0.3)",
  },
  listScroll: { overflowY: "auto", flex: 1 },
  listItem: {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "14px 18px",
    cursor: "pointer",
    transition: "background 0.15s",
    display: "block",
  },
  listItemTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  listName: { color: "#fff", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block" },
  listDate: { color: "rgba(255,255,255,0.25)", fontSize: "11px", whiteSpace: "nowrap" },
  listEmail: { color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 8px" },
  categoryTag: {
    display: "inline-block",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.45)",
    fontWeight: 500,
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "rgba(255,255,255,0.3)",
    fontSize: "14px",
  },
  detailCol: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  emptyDetail: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  detailName: { color: "#fff", fontSize: "20px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" },
  detailEmail: { color: "#818cf8", fontSize: "14px", textDecoration: "none" },
  deleteBtn: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.2s",
  },
  metaRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "16px",
  },
  metaItem: { display: "flex", flexDirection: "column", gap: "4px" },
  metaLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em" },
  metaValue: { color: "#fff", fontSize: "13px", fontWeight: 600 },
  messageBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "18px",
    flex: 1,
  },
  messageLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" },
  messageText: { color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: "1.7", margin: 0 },
  replyBtn: {
    display: "block",
    textAlign: "center",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff",
    borderRadius: "10px",
    padding: "12px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.01em",
  },
};
