"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import EnquiriesManager from "./components/EnquiriesManager";
import WorksManager from "./components/WorksManager";

type Tab = "enquiries" | "works";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("enquiries");

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

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div style={s.root}>
        <div style={s.spinner} />
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.container}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logoBox}>AK</div>
            <div>
              <h1 style={s.title}>Admin Dashboard</h1>
              <p style={s.subtitle}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a
              href="https://amaljith-d4d99.web.app"
              target="_blank"
              rel="noopener noreferrer"
              style={s.siteLink}
            >
              🌐 View Site
            </a>
            <button
              id="logout-btn"
              onClick={handleLogout}
              style={s.logoutBtn}
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
          </div>
        </header>

        {/* Tab navigation */}
        <div style={s.tabNav}>
          {(
            [
              { key: "enquiries", label: "📨 Enquiries" },
              { key: "works", label: "🗂 Works" },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                ...s.tabBtn,
                background: tab === key ? "rgba(99,102,241,0.15)" : "transparent",
                color: tab === key ? "#818cf8" : "rgba(255,255,255,0.4)",
                borderColor:
                  tab === key ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.08)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "enquiries" ? <EnquiriesManager /> : <WorksManager />}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
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
    marginBottom: "24px",
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
  siteLink: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "7px 14px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
  },
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
  tabNav: { display: "flex", gap: "8px", marginBottom: "28px" },
  tabBtn: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "8px 20px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    background: "transparent",
  },
};
