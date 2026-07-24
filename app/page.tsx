"use client";

import React, { useState, useEffect, useRef } from "react";

// ==========================================
// Animation Helpers (useInView & AnimatedCounter)
// ==========================================

function useInView(threshold = 0.2): [React.RefObject<any>, boolean] {
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ target, duration = 1000, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const [ref, inView] = useInView(0.1);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{prefix}{value}{suffix}</span>;
}

// ==========================================
// SVG Icon Helpers (Custom Path Definitions)
// ==========================================

const PhoneIcon = () => (
  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const VisaIcon = () => (
  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const MetaIcon = () => (
  <svg className="w-4 h-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.297 5.76c-1.38 0-2.617.587-3.485 1.52-.727-.78-1.745-1.267-2.875-1.267-2.31 0-4.148 1.83-4.148 4.093 0 2.26 1.838 4.09 4.148 4.09 1.252 0 2.373-.55 3.125-1.425.688.75 1.7 1.218 2.812 1.218 2.312 0 4.148-1.83 4.148-4.093 0-2.26-1.836-4.09-4.097-4.09L16.3 5.76zm-6.36 6.812c-1.49 0-2.698-1.185-2.698-2.656 0-1.47 1.208-2.655 2.698-2.655 1.488 0 2.696 1.184 2.696 2.655 0 1.47-1.208 2.656-2.696 2.656zm6.36 0c-1.487 0-2.695-1.185-2.695-2.656 0-1.47 1.208-2.655 2.695-2.655 1.488 0 2.697 1.184 2.697 2.655 0 1.47-1.21 2.656-2.697 2.656z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.462 0 4.11 1.025 5.05 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.922 1 12.24 5.922 1 12.24s4.922 11.24 11.24 11.24c6.598 0 11.002-4.625 11.002-11.24 0-.756-.08-1.333-.178-1.955H12.24z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-4 h-4 text-semantic-success shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<"paid" | "seo" | "video">("paid");
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync theme changes with documentElement class list
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Scroll reveal IntersectionObserver effect
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  
  // Paid Campaign States
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignPlatform, setCampaignPlatform] = useState<"all" | "meta" | "google">("all");
  const [selectedCampaign, setSelectedCampaign] = useState<number>(0);
  const [animateChart, setAnimateChart] = useState(false);

  // Sync chart animation state when campaign or tab changes
  useEffect(() => {
    setAnimateChart(false);
    const t = setTimeout(() => setAnimateChart(true), 50);
    return () => clearTimeout(t);
  }, [selectedCampaign, activeTab]);

  // SEO Keyword Rank States
  const [selectedKeyword, setSelectedKeyword] = useState<number>(0);

  // Video Timeline Simulator States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [currentFrameText, setCurrentFrameText] = useState("Click Play to preview edit timeline...");
  const timelineAnimationRef = useRef<number | null>(null);

  // Contact Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCategory, setFormCategory] = useState("lead-gen");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Video Simulator Frames Definition
  const videoFrames = [
    { time: 0, text: "🎬 Amaljith KJ: Opening Anchor hook targeting Dubai market leads..." },
    { time: 20, text: "📈 Visual B-Roll: Chart overlay showing Google Ad PPC click scale..." },
    { time: 40, text: "💬 Testimonial slide: Highlighting 45% engagement growth..." },
    { time: 60, text: "🎥 Local UAE Business case-study presentation segment..." },
    { time: 80, text: "🎯 Final CTA Anchor pitch: driving outbound website traffic..." },
    { time: 100, text: "✅ End Frame: Shot & edited in-house using CapCut Premium." },
  ];

  // Video playhead effect
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const duration = 6000; // 6 seconds simulation

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        
        setPlayheadPosition(progress);

        // Update frame text based on elapsed percentage
        const currentFrame = [...videoFrames]
          .reverse()
          .find((frame) => progress >= frame.time);
        
        if (currentFrame) {
          setCurrentFrameText(currentFrame.text);
        }

        if (progress < 100) {
          timelineAnimationRef.current = requestAnimationFrame(updateProgress);
        } else {
          setIsPlaying(false);
        }
      };

      timelineAnimationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (timelineAnimationRef.current) {
        cancelAnimationFrame(timelineAnimationRef.current);
      }
    }

    return () => {
      if (timelineAnimationRef.current) {
        cancelAnimationFrame(timelineAnimationRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlaySimulation = () => {
    setPlayheadPosition(0);
    setIsPlaying(true);
  };

  // Paid Campaign Mock Data
  const mockCampaigns = [
    {
      id: 0,
      name: "Lead Generation UAE - Links Consultants",
      platform: "meta",
      status: "Active",
      spend: "$5,450",
      ctr: "4.85%",
      ctrChange: "+38%",
      conversions: "320 leads",
      roi: "4.8x",
      targetAudience: "Dubai Real Estate & Business Setup Directors",
      topAdSet: "Custom Lookalikes 2% UAE (Managers)",
      keywords: "Dubai Business Consulting, Trade License Dubai, Setup LLC",
    },
    {
      id: 1,
      name: "Google Search Ads - Lead Gen Core",
      platform: "google",
      status: "Active",
      spend: "$3,800",
      ctr: "6.24%",
      ctrChange: "+32%",
      conversions: "244 calls",
      roi: "5.2x",
      targetAudience: "Inbound search intent for audit & consulting",
      topAdSet: "Dubai Corporate Services Search Target",
      keywords: "corporate audit dubai, legal consultant UAE, business license register",
    },
    {
      id: 2,
      name: "SEO Brand Boost - 916 Creative Minds",
      platform: "google",
      status: "Completed",
      spend: "$4,200",
      ctr: "3.90%",
      ctrChange: "+24%",
      conversions: "1,120 clicks",
      roi: "3.9x",
      targetAudience: "SEO & Content Marketing inbound",
      topAdSet: "Local Search Optimization UAE",
      keywords: "creative design agency dubai, brand design uae, advertising cost dubai",
    },
    {
      id: 3,
      name: "Meta Video Conversions - Impress Ads",
      platform: "meta",
      status: "Completed",
      spend: "$6,100",
      ctr: "4.12%",
      ctrChange: "+45%",
      conversions: "410 sales",
      roi: "4.2x",
      targetAudience: "Broad targeting + Video Retargeting (3s Viewers)",
      topAdSet: "LAL Video Engagers 5%",
      keywords: "creative marketing, ecommerce video ads, product promo video uae",
    },
  ];

  const filteredCampaigns = mockCampaigns.filter((camp) => {
    const matchesSearch = camp.name.toLowerCase().includes(campaignSearch.toLowerCase());
    const matchesPlatform = campaignPlatform === "all" || camp.platform === campaignPlatform;
    return matchesSearch && matchesPlatform;
  });

  // SEO Keyword Mock Data
  const mockKeywords = [
    { id: 0, phrase: "business setup dubai", rank: "#2", change: "▲ 15", volume: "14,800", difficulty: "High", traffic: "1,840 clicks/mo", history: [22, 18, 12, 8, 4, 2] },
    { id: 1, phrase: "corporate tax consultant uae", rank: "#1", change: "▲ 8", volume: "8,100", difficulty: "Medium", traffic: "920 clicks/mo", history: [9, 7, 5, 3, 2, 1] },
    { id: 2, phrase: "company registration dubai", rank: "#3", change: "▲ 21", volume: "12,200", difficulty: "High", traffic: "1,450 clicks/mo", history: [34, 28, 22, 14, 7, 3] },
    { id: 3, phrase: "audit services dubai", rank: "#4", change: "▲ 12", volume: "5,400", difficulty: "Medium", traffic: "540 clicks/mo", history: [18, 16, 11, 8, 5, 4] },
    { id: 4, phrase: "local marketing agency uae", rank: "#2", change: "▲ 19", volume: "3,200", difficulty: "Low", traffic: "410 clicks/mo", history: [28, 21, 15, 10, 5, 2] },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() && formEmail.trim()) {
      setFormSubmitted(true);
      // Simulate API submit delay
      setTimeout(() => {
        setFormName("");
        setFormEmail("");
        setFormMessage("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-primary selection:text-on-primary">
      {/* 1. TOP NAV COMPONENT */}
      <nav className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 md:px-12 bg-canvas/80 backdrop-blur-md border-b border-hairline transition-all duration-200">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="lg:hidden w-7 h-7 rounded-full overflow-hidden border border-hairline shrink-0">
            <img
              src="/profile_photo.png"
              alt="Amaljith KJ"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:flex w-6 h-6 rounded-sm bg-primary items-center justify-center text-white text-xs font-bold font-mono shrink-0">
            A
          </div>
          <span className="font-display font-semibold tracking-[-0.4px] text-base group-hover:text-primary transition-colors">
            AMALJITH KJ
          </span>
        </a>

        {/* Center menu links — hidden below 1280px */}
        <div className="hidden xl:flex items-center gap-6">
          <a href="#about" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">About</a>
          <a href="#achievements" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">Achievements</a>
          <a href="#works" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">Works</a>
          <a href="#dashboard" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">Marketing Console</a>
          <a href="#experience" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">Experience</a>
          <a href="#tools" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">Tools</a>
          <a href="#contact" className="text-sm text-ink-subtle hover:text-ink link-underline transition-colors">Contact</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-md bg-surface-1 border border-hairline hover:bg-surface-2 btn-transition cursor-pointer flex items-center justify-center"
            title="Toggle light/dark theme"
          >
            {isDark ? (
              // Sun Icon (shows in dark mode to switch to light)
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.56 1.56m12.44 12.44l1.56 1.56M21 12h-2.25M5.25 12H3m14.64-7.78l-1.56 1.56M6.78 17.22l-1.56 1.56M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
              </svg>
            ) : (
              // Moon Icon (shows in light mode to switch to dark)
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          <a 
            href="#contact" 
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-md bg-surface-1 border border-hairline text-sm font-medium hover:bg-surface-2 btn-transition"
          >
            Get in Touch
          </a>
          <a 
            href="mailto:amaljithkj023@gmail.com"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover btn-transition"
          >
            Email CV
          </a>

          {/* Hamburger Menu Toggle Button (Visible below 1280px) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-md bg-surface-1 border border-hairline hover:bg-surface-2 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5 text-ink shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-ink shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Panel */}
      {isMenuOpen && (
        <div className="xl:hidden fixed top-14 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-hairline p-6 flex flex-col gap-4 animate-fade-in shadow-xl">
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 border-b border-hairline/40">About</a>
          <a href="#achievements" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 border-b border-hairline/40">Achievements</a>
          <a href="#works" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 border-b border-hairline/40">Works</a>
          <a href="#dashboard" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 border-b border-hairline/40">Marketing Console</a>
          <a href="#experience" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 border-b border-hairline/40">Experience</a>
          <a href="#tools" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 border-b border-hairline/40">Tools</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-ink hover:text-primary transition-colors py-2.5 pb-3">Contact</a>
          
          <div className="flex flex-col sm:hidden gap-3 mt-2">
            <a 
              href="#contact"
              onClick={() => setIsMenuOpen(false)} 
              className="w-full text-center py-2.5 rounded-md bg-surface-1 border border-hairline text-sm font-medium hover:bg-surface-2 btn-transition"
            >
              Get in Touch
            </a>
            <a 
              href="mailto:amaljithkj023@gmail.com"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover btn-transition"
            >
              Email CV
            </a>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <header id="hero" className="relative overflow-hidden max-w-[1280px] mx-auto px-6 pt-5 pb-16 md:pt-20 md:pb-28">
        {/* Decorative subtle background gradient halo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Two-column layout: text left, photo right */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* LEFT: Text content */}
          <div className="flex-1 flex flex-col items-start text-left gap-6 min-w-0">
            {/* Small rounded profile avatar for mobile hero layout */}
            <div 
              className="lg:hidden w-16 h-16 rounded-full overflow-hidden border-2 border-primary/25 shadow-lg animate-scale-up -mt-3"
              style={{ animationDelay: "80ms", animationFillMode: "both" }}
            >
              <img
                src="/profile_photo.png"
                alt="Amaljith KJ"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 border border-hairline glow-pulse">
              <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
              <span className="text-xs font-mono text-ink-muted">Available for Dubai &amp; Remote Campaigns</span>
            </div>

            {/* Main headline */}
            <h1 className="text-[2.5rem] md:text-[4rem] lg:text-[4.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-ink blur-reveal">
              High-performance marketing.{" "}
              <span className="text-primary">Driven by data.</span>
            </h1>

            {/* Sub-paragraph */}
            <p 
              className="text-lg leading-relaxed text-ink-muted max-w-[520px] animate-fade-in-up"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              Digital Marketing Manager with 6+ years of experience across the UAE and India.
              Specializing in performance marketing, Google &amp; Meta Ads, and content strategies
              that optimize ad spend and scale ROI.
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: "350ms", animationFillMode: "both" }}
            >
              <a
                href="#dashboard"
                className="flex items-center justify-center gap-2 h-11 px-6 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all btn-transition group"
              >
                Launch Marketing Console
                <ArrowRightIcon />
              </a>
              <a
                href="#experience"
                className="flex items-center justify-center h-11 px-6 rounded-md border border-hairline bg-surface-1 hover:bg-surface-2 text-sm font-medium transition-all btn-transition"
              >
                Read Experience Log
              </a>
            </div>
          </div>

          {/* RIGHT: Profile photo */}
          <div 
            className="relative hidden lg:flex items-center justify-center shrink-0 animate-scale-up"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            {/* Glow behind photo */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] pointer-events-none scale-75" />

            <div className="shimmer-border rounded-xl">
              <div className="shimmer-border-inner relative p-2 bg-surface-1 border border-hairline rounded-xl shadow-2xl overflow-hidden group" style={{ width: "320px" }}>
                <img
                  src="/profile_photo.png"
                  alt="Amaljith KJ — Digital Marketing Manager"
                  className="rounded-lg object-cover block group-hover:scale-[1.03] transition-transform duration-500 border border-hairline"
                  style={{ width: "304px", height: "304px" }}
                />
                {/* Caption overlay */}
                <div
                  className="absolute bottom-5 left-5 right-5 border border-hairline rounded-lg p-3"
                  style={{ background: "color-mix(in srgb, var(--canvas) 80%, transparent)", backdropFilter: "blur(8px)" }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold font-mono text-ink">AMALJITH KJ</div>
                      <div className="text-[10px] text-ink-subtle mt-0.5">Digital Marketer &amp; Team Lead</div>
                    </div>
                    <span className="text-[10px] font-mono font-medium bg-semantic-success/20 text-semantic-success border border-semantic-success/30 px-2 py-0.5 rounded-full">
                      6+ YOE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick contact tags */}
        <div 
          className="mt-14 pt-8 border-t border-hairline flex flex-wrap gap-6 items-center relative z-10 animate-fade-in"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-2 text-sm text-ink-subtle">
            <MapPinIcon />
            <span>Dubai, UAE</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-subtle">
            <PhoneIcon />
            <span>+971 545895769</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-subtle">
            <MailIcon />
            <span>amaljithkj023@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-subtle">
            <VisaIcon />
            <span>Spouse Visa</span>
          </div>
        </div>
      </header>

      {/* METRICS / KEY ACHIEVEMENTS */}
      <section id="achievements" className="py-12 border-y border-hairline bg-surface-1/40 reveal">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
          <div className="flex flex-col bg-surface-1 border border-hairline p-5 rounded-lg card-hover-lift">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Reach</span>
            <span className="text-4xl md:text-5xl font-semibold text-ink mt-2 tracking-tight">
              <AnimatedCounter target={45} prefix="+" suffix="%" />
            </span>
            <span className="text-sm text-ink-subtle mt-1.5">Social Media Engagement</span>
            <p className="text-xs text-ink-tertiary mt-2">Boosted organic reach across Meta channels within 6 months via custom content algorithms.</p>
          </div>
          
          <div className="flex flex-col bg-surface-1 border border-hairline p-5 rounded-lg card-hover-lift">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Efficiency</span>
            <span className="text-4xl md:text-5xl font-semibold text-ink mt-2 tracking-tight">
              <AnimatedCounter target={35} prefix="+" suffix="%" />
            </span>
            <span className="text-sm text-ink-subtle mt-1.5">Paid Ad CTR Boost</span>
            <p className="text-xs text-ink-tertiary mt-2">Optimized Google search keyword structures and Meta ad hooks, trimming cost per acquisition.</p>
          </div>

          <div className="flex flex-col bg-surface-1 border border-hairline p-5 rounded-lg card-hover-lift">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Organic</span>
            <span className="text-4xl md:text-5xl font-semibold text-ink mt-2 tracking-tight">
              <AnimatedCounter target={55} prefix="+" suffix="%" />
            </span>
            <span className="text-sm text-ink-subtle mt-1.5">Local SEO Traffic</span>
            <p className="text-xs text-ink-tertiary mt-2">Captured high-intent search terms on Google Business profiles for UAE local market segments.</p>
          </div>

          <div className="flex flex-col bg-surface-1 border border-hairline p-5 rounded-lg card-hover-lift">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Production</span>
            <span className="text-4xl md:text-5xl font-semibold text-ink mt-2 tracking-tight">
              <AnimatedCounter target={50} suffix="+" />
            </span>
            <span className="text-sm text-ink-subtle mt-1.5">Video Sessions Edited</span>
            <p className="text-xs text-ink-tertiary mt-2">Increased aggregate views by 60% with anchor presenter structures and high-pace CapCut sequences.</p>
          </div>
        </div>
      </section>

      {/* WORKS / PORTFOLIO SECTION */}
      <section id="works" className="py-24 border-b border-hairline bg-surface-1/10 reveal">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal-stagger">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Portfolio Showcase</span>
            <h2 className="text-3xl md:text-[40px] font-semibold tracking-[-1.0px] leading-tight text-ink mt-2">
              Featured Works &amp; Campaigns
            </h2>
            <div className="inline-flex items-center gap-3 mt-4 px-4 py-2 bg-surface-1 border border-hairline rounded-full shadow-sm">
              <span className="text-xs sm:text-sm text-ink-muted">Total Campaigns &amp; Works Executed:</span>
              <span className="text-sm sm:text-base font-semibold text-primary font-mono">
                <AnimatedCounter target={150} suffix="+" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
            {/* Work 1 */}
            <div className="bg-surface-1 border border-hairline hover:border-hairline-strong rounded-xl overflow-hidden card-hover-lift flex flex-col justify-between p-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">Lead Gen</span>
                  <span className="text-xs font-semibold text-semantic-success bg-semantic-success/10 px-2 py-0.5 rounded font-mono">ROI 4.8x</span>
                </div>
                <h3 className="text-base font-bold text-ink mb-2">B2B Business Setup Lead Funnel</h3>
                <p className="text-xs text-ink-subtle leading-relaxed mb-4">
                  Custom lead-acquisition system targeting corporate service seekings, business formation leads and trade licensing queries in Dubai.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-hairline/60 font-mono text-[10px] text-ink-muted">
                <span>Client: Links Consultants</span>
                <span className="font-semibold text-ink">320 Leads Captured</span>
              </div>
            </div>

            {/* Work 2 */}
            <div className="bg-surface-1 border border-hairline hover:border-hairline-strong rounded-xl overflow-hidden card-hover-lift flex flex-col justify-between p-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">SEO Optimization</span>
                  <span className="text-xs font-semibold text-semantic-success bg-semantic-success/10 px-2 py-0.5 rounded font-mono">CTR +35%</span>
                </div>
                <h3 className="text-base font-bold text-ink mb-2">Local SEO Dominance Plan</h3>
                <p className="text-xs text-ink-subtle leading-relaxed mb-4">
                  Structured schema setup, optimized map citations and organic localized content ranking targeting business licensing query segments.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-hairline/60 font-mono text-[10px] text-ink-muted">
                <span>Domain Focus: Google.ae</span>
                <span className="font-semibold text-ink">#2 Ranked Term</span>
              </div>
            </div>

            {/* Work 3 */}
            <div className="bg-surface-1 border border-hairline hover:border-hairline-strong rounded-xl overflow-hidden card-hover-lift flex flex-col justify-between p-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">Video Ads</span>
                  <span className="text-xs font-semibold text-semantic-success bg-semantic-success/10 px-2 py-0.5 rounded font-mono">Views +60%</span>
                </div>
                <h3 className="text-base font-bold text-ink mb-2">Dubai B2B Promo Videography</h3>
                <p className="text-xs text-ink-subtle leading-relaxed mb-4">
                  Shot, presented and edited high-pace video advertising hooks tailored to boost conversion rates and outbound landing page clicks.
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-hairline/60 font-mono text-[10px] text-ink-muted">
                <span>Format: CapCut Edit</span>
                <span className="font-semibold text-ink">50+ Campaigns Ran</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE DASHBOARD COMPONENT */}
      <section id="dashboard" className="py-24 max-w-[1280px] mx-auto px-6 reveal">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-stagger">
          <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Console Panel</span>
          <h2 className="text-3xl md:text-[40px] font-semibold tracking-[-1.0px] leading-tight text-ink mt-2">
            Campaign Performance Deck
          </h2>
          <p className="text-base text-ink-subtle mt-4">
            An interactive representation of campaign outcomes. Click through categories to inspect paid ads, keyword SEO matrices, and video production sequences.
          </p>
        </div>

        {/* Dashboard Box */}
        <div className="bg-surface-1 border border-hairline rounded-xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="bg-surface-2 border-b border-hairline p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Left System Info */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              </div>
              <span className="h-4 w-px bg-hairline" />
              <span className="font-mono text-xs text-ink-subtle">amaljith_marketer_kernel.sys</span>
            </div>

            {/* Middle Nav Tabs */}
            <div className="flex items-center bg-canvas border border-hairline rounded-full p-1">
              <button
                onClick={() => setActiveTab("paid")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "paid" ? "bg-surface-2 text-ink" : "text-ink-subtle hover:text-ink"
                }`}
              >
                Paid Ad Campaigns
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "seo" ? "bg-surface-2 text-ink" : "text-ink-subtle hover:text-ink"
                }`}
              >
                SEO Keywords
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "video" ? "bg-surface-2 text-ink" : "text-ink-subtle hover:text-ink"
                }`}
              >
                Video Production Deck
              </button>
            </div>

            {/* Right Status Badge */}
            <div className="flex items-center gap-2 bg-surface-3 px-3 py-1 rounded-md border border-hairline">
              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
              <span className="text-[11px] font-mono text-ink-muted">Sync: 100% OK</span>
            </div>
          </div>

          {/* VIEW: PAID CAMPAIGNS */}
          {activeTab === "paid" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] scale-in">
              {/* Campaign List Pane */}
              <div className="lg:col-span-5 border-r border-hairline p-4 bg-canvas/30">
                <div className="flex flex-col gap-4 mb-4">
                  {/* Search and filters */}
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-ink-subtle">
                      <SearchIcon />
                    </span>
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                      className="w-full bg-surface-2 border border-hairline rounded-md pl-9 pr-4 py-1.5 text-xs text-ink placeholder-ink-tertiary focus:outline-none focus:border-hairline-strong transition-colors"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCampaignPlatform("all")}
                      className={`px-3 py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                        campaignPlatform === "all" ? "bg-primary/20 border-primary text-primary" : "bg-surface-2 border-hairline text-ink-subtle"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setCampaignPlatform("meta")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                        campaignPlatform === "meta" ? "bg-primary/20 border-primary text-primary" : "bg-surface-2 border-hairline text-ink-subtle"
                      }`}
                    >
                      <MetaIcon />
                      Meta Ads
                    </button>
                    <button
                      onClick={() => setCampaignPlatform("google")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium border cursor-pointer ${
                        campaignPlatform === "google" ? "bg-primary/20 border-primary text-primary" : "bg-surface-2 border-hairline text-ink-subtle"
                      }`}
                    >
                      <GoogleIcon />
                      Google Ads
                    </button>
                  </div>
                </div>

                {/* Campaigns List */}
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px]">
                  {filteredCampaigns.map((camp) => (
                    <button
                      key={camp.id}
                      onClick={() => setSelectedCampaign(camp.id)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedCampaign === camp.id
                          ? "bg-surface-2 border-hairline-strong shadow-md"
                          : "bg-surface-1/40 border-hairline hover:bg-surface-2/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {camp.platform === "meta" ? <MetaIcon /> : <GoogleIcon />}
                          <span className="font-mono text-[11px] text-ink-subtle uppercase">{camp.platform} Ad</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                          camp.status === "Active" ? "bg-semantic-success/20 text-semantic-success border border-semantic-success/30" : "bg-surface-3 text-ink-subtle border border-hairline"
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-ink line-clamp-1">{camp.name}</h4>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-[11px] text-ink-muted">CTR: <strong className="text-ink">{camp.ctr}</strong></span>
                        <span className="text-[10px] text-semantic-success font-mono font-semibold bg-semantic-success/15 px-1.5 py-0.5 rounded">{camp.ctrChange}</span>
                      </div>
                    </button>
                  ))}

                  {filteredCampaigns.length === 0 && (
                    <div className="text-center py-8 text-xs text-ink-tertiary">
                      No campaigns match filters.
                    </div>
                  )}
                </div>
              </div>

              {/* Details Pane */}
              <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-surface-1/10">
                {selectedCampaign !== null && mockCampaigns[selectedCampaign] ? (
                  <>
                    <div>
                      <div className="flex justify-between items-center border-b border-hairline pb-4 mb-4">
                        <div>
                          <span className="text-[10px] font-mono text-primary uppercase tracking-wider">Campaign Console v2.1</span>
                          <h3 className="text-lg font-semibold text-ink mt-1">
                            {mockCampaigns[selectedCampaign].name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-ink-subtle block uppercase font-mono">Budget Spend</span>
                          <span className="text-lg font-semibold text-ink">{mockCampaigns[selectedCampaign].spend}</span>
                        </div>
                      </div>

                      {/* Visual stats cards */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-canvas border border-hairline p-3 rounded-lg">
                          <span className="text-[10px] text-ink-subtle uppercase block font-mono">CTR Focus</span>
                          <span className="text-sm font-semibold text-ink block mt-1">{mockCampaigns[selectedCampaign].ctr}</span>
                          <span className="text-[9px] text-semantic-success font-mono mt-0.5 block">{mockCampaigns[selectedCampaign].ctrChange} Lift</span>
                        </div>
                        <div className="bg-canvas border border-hairline p-3 rounded-lg">
                          <span className="text-[10px] text-ink-subtle uppercase block font-mono">Conversions</span>
                          <span className="text-sm font-semibold text-ink block mt-1">{mockCampaigns[selectedCampaign].conversions}</span>
                          <span className="text-[9px] text-indigo-400 font-mono mt-0.5 block">Verified Leads</span>
                        </div>
                        <div className="bg-canvas border border-hairline p-3 rounded-lg">
                          <span className="text-[10px] text-ink-subtle uppercase block font-mono">ROI Multiplier</span>
                          <span className="text-sm font-semibold text-primary block mt-1">{mockCampaigns[selectedCampaign].roi}</span>
                          <span className="text-[9px] text-indigo-300 font-mono mt-0.5 block">Conversion Rate Max</span>
                        </div>
                      </div>

                      {/* Campaign settings */}
                      <div className="flex flex-col gap-3 font-mono text-xs">
                        <div className="flex justify-between py-1.5 border-b border-hairline/40">
                          <span className="text-ink-subtle">Geo Targeting</span>
                          <span className="text-ink text-right">Dubai, Abu Dhabi, UAE</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-hairline/40">
                          <span className="text-ink-subtle">Audience Spec</span>
                          <span className="text-ink text-right truncate max-w-[280px]" title={mockCampaigns[selectedCampaign].targetAudience}>
                            {mockCampaigns[selectedCampaign].targetAudience}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-hairline/40">
                          <span className="text-ink-subtle">Top Ad Group / Set</span>
                          <span className="text-ink text-right truncate max-w-[280px]" title={mockCampaigns[selectedCampaign].topAdSet}>
                            {mockCampaigns[selectedCampaign].topAdSet}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-ink-subtle">Top Keywords</span>
                          <span className="text-ink text-right truncate max-w-[280px]" title={mockCampaigns[selectedCampaign].keywords}>
                            {mockCampaigns[selectedCampaign].keywords}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Simulated live chart bars */}
                    <div className="mt-6 pt-4 border-t border-hairline">
                      <span className="text-[10px] text-ink-subtle uppercase block font-mono mb-3">Live Ad Set Distribution</span>
                      <div className="flex items-end gap-3 h-14 bg-canvas/30 p-2 rounded border border-hairline">
                        <div 
                          className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-sm relative group"
                          style={{ 
                            height: animateChart ? "40%" : "0%",
                            transitionDuration: "500ms",
                            transitionTimingFunction: "var(--ease-out)"
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-surface-3 border border-hairline px-2 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Ad Set 1: 40%</div>
                        </div>
                        <div 
                          className="w-full bg-primary/40 hover:bg-primary/60 transition-all rounded-sm relative group"
                          style={{ 
                            height: animateChart ? "75%" : "0%",
                            transitionDuration: "500ms",
                            transitionTimingFunction: "var(--ease-out)",
                            transitionDelay: "60ms"
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-surface-3 border border-hairline px-2 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Ad Set 2: 75%</div>
                        </div>
                        <div 
                          className="w-full bg-primary hover:bg-primary-hover transition-all rounded-sm relative group"
                          style={{ 
                            height: animateChart ? "90%" : "0%",
                            transitionDuration: "500ms",
                            transitionTimingFunction: "var(--ease-out)",
                            transitionDelay: "120ms"
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-surface-3 border border-hairline px-2 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Ad Set 3: 90% (Winner)</div>
                        </div>
                        <div 
                          className="w-full bg-primary/30 hover:bg-primary/50 transition-all rounded-sm relative group"
                          style={{ 
                            height: animateChart ? "55%" : "0%",
                            transitionDuration: "500ms",
                            transitionTimingFunction: "var(--ease-out)",
                            transitionDelay: "180ms"
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-surface-3 border border-hairline px-2 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Ad Set 4: 55%</div>
                        </div>
                        <div 
                          className="w-full bg-primary/10 hover:bg-primary/25 transition-all rounded-sm relative group"
                          style={{ 
                            height: animateChart ? "25%" : "0%",
                            transitionDuration: "500ms",
                            transitionTimingFunction: "var(--ease-out)",
                            transitionDelay: "240ms"
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-surface-3 border border-hairline px-2 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Ad Set 5: 25%</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-ink-tertiary text-xs">
                    Select a campaign to view console specs.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: SEO KEYWORDS */}
          {activeTab === "seo" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] scale-in">
              {/* Keyword Table List */}
              <div className="lg:col-span-6 border-r border-hairline p-4 bg-canvas/30">
                <div className="mb-4">
                  <h4 className="text-xs font-mono text-ink-subtle uppercase mb-1">SEMrush Organic Rankings</h4>
                  <p className="text-[11px] text-ink-tertiary">Select keywords to view organic rank improvement paths.</p>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {mockKeywords.map((kw, index) => (
                    <button
                      key={kw.id}
                      onClick={() => setSelectedKeyword(index)}
                      className={`flex items-center justify-between text-left p-2.5 rounded-md border transition-all cursor-pointer ${
                        selectedKeyword === index 
                          ? "bg-surface-2 border-hairline-strong" 
                          : "bg-surface-1/20 border-hairline/60 hover:bg-surface-2/40"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-ink font-mono">{kw.phrase}</span>
                        <span className="text-[10px] text-ink-tertiary mt-0.5 font-mono">Vol: {kw.volume} · Diff: {kw.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-ink">{kw.rank}</span>
                        <div className="flex items-center gap-0.5 text-[10px] font-semibold text-semantic-success bg-semantic-success/10 px-1.5 py-0.5 rounded font-mono">
                          <TrendingUpIcon />
                          <span>{kw.change}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyword analytics detail pane */}
              <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-surface-1/10">
                <div>
                  <div className="border-b border-hairline pb-4 mb-4">
                    <span className="text-[10px] font-mono text-primary uppercase tracking-wider">Search Visibility Insights</span>
                    <h3 className="text-base font-semibold text-ink mt-1 font-mono">
                      Query: &quot;{mockKeywords[selectedKeyword].phrase}&quot;
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-canvas border border-hairline p-3.5 rounded-lg">
                      <span className="text-[10px] text-ink-subtle uppercase block font-mono">Rank Improvement</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-bold text-ink">{mockKeywords[selectedKeyword].rank}</span>
                        <span className="text-[11px] text-semantic-success font-semibold font-mono">{mockKeywords[selectedKeyword].change} ranks up</span>
                      </div>
                    </div>
                    <div className="bg-canvas border border-hairline p-3.5 rounded-lg">
                      <span className="text-[10px] text-ink-subtle uppercase block font-mono">Organic Traffic</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-bold text-ink font-mono">{mockKeywords[selectedKeyword].traffic}</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG rank path over 6 months */}
                  <div className="bg-canvas/50 border border-hairline p-4 rounded-lg">
                    <span className="text-[10px] text-ink-subtle uppercase block font-mono mb-4">6-Month Rank Trend (Google.ae)</span>
                    <div className="relative h-20 w-full flex items-end justify-between px-2 pt-2">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 bottom-0 h-px bg-hairline" />
                      <div className="absolute inset-x-0 top-1/2 h-px bg-hairline/40 border-dashed" />
                      <div className="absolute inset-x-0 top-0 h-px bg-hairline/25" />

                      {mockKeywords[selectedKeyword].history.map((rankPos, idx) => {
                        // Calculate chart height. Low rank number means high rank, so invert height display
                        const maxRank = 40;
                        const heightPercent = Math.max(10, 100 - (rankPos / maxRank) * 100);
                        return (
                          <div key={idx} className="flex flex-col items-center z-10 w-full group">
                            {/* Dot */}
                            <div 
                              className="w-2.5 h-2.5 rounded-full bg-primary border border-canvas group-hover:scale-150 transition-all cursor-pointer relative"
                              style={{ 
                                transform: animateChart ? `translateY(-${heightPercent * 0.4}px)` : `translateY(0px)`,
                                transitionDuration: "600ms",
                                transitionTimingFunction: "var(--ease-out)",
                                transitionDelay: `${idx * 50}ms`
                              }}
                            >
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-surface-3 text-[9px] font-mono px-1 rounded border border-hairline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">#{rankPos}</span>
                            </div>
                            <span className="text-[9px] font-mono text-ink-tertiary mt-2">M{idx + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-3/30 border border-hairline/60 rounded p-3 text-[11px] font-mono text-ink-muted">
                  <span className="text-primary font-bold mr-1">SEO Strategy:</span> Local content optimization, structured schema injection, and high-quality regional inbound backlinks targeting UAE local search directories.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: VIDEO EDITING TIMELINE */}
          {activeTab === "video" && (
            <div className="p-6 bg-canvas/30 min-h-[460px] flex flex-col justify-between scale-in">
              <div>
                <div className="flex justify-between items-start border-b border-hairline pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-primary uppercase tracking-wider">CapCut Premium Simulation</span>
                    <h3 className="text-lg font-semibold text-ink mt-1">Video Campaign Assembly Timeline</h3>
                  </div>
                  <button
                    onClick={handlePlaySimulation}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-4.5 py-2 rounded-md bg-primary hover:bg-primary-hover disabled:bg-surface-3 disabled:text-ink-tertiary text-white text-xs font-semibold font-mono tracking-wide transition-all btn-transition shadow-lg cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <span>▶ Run Video Timeline</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-ink-subtle mb-6">
                  Amaljith combines strong digital marketing optimization with expert videography, video editing, and anchor presenting skills to build high-impact content. Use the simulator below to preview editing tracks, voiceover timing, and anchor cues.
                </p>

                {/* Simulated Monitor Viewport */}
                <div className="bg-canvas border border-hairline rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden">
                  <div className={`w-full md:w-1/2 aspect-video bg-surface-4 border border-hairline rounded flex items-center justify-center text-center p-4 relative group transition-colors duration-300 ${isPlaying ? "border-primary/50 shadow-lg shadow-primary/5" : ""}`}>
                    {/* Simulated video playback frame */}
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors pointer-events-none" />
                    
                    {/* Floating status */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-hairline text-[9px] font-mono text-semantic-success flex items-center gap-1.5">
                      {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      <span>REC [SIM]</span>
                    </div>
                    
                    <span className="text-xs font-mono text-ink text-center max-w-xs transition-all duration-200">
                      {currentFrameText}
                    </span>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col gap-3.5">
                    <h4 className="text-xs font-semibold text-ink font-mono border-b border-hairline pb-2">Active Timeline Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-surface-2 p-2 rounded border border-hairline">
                        <span className="text-ink-subtle block">AGGREGATE VIEWS</span>
                        <strong className="text-sm text-ink block mt-0.5">+60%</strong>
                      </div>
                      <div className="bg-surface-2 p-2 rounded border border-hairline">
                        <span className="text-ink-subtle block">VIDEO SESSIONS</span>
                        <strong className="text-sm text-ink block mt-0.5">50+ Campaigns</strong>
                      </div>
                      <div className="bg-surface-2 p-2 rounded border border-hairline">
                        <span className="text-ink-subtle block">RETAIN RATE (30S)</span>
                        <strong className="text-sm text-primary block mt-0.5">54.2%</strong>
                      </div>
                      <div className="bg-surface-2 p-2 rounded border border-hairline">
                        <span className="text-ink-subtle block">CONTENT TYPE</span>
                        <strong className="text-sm text-ink block mt-0.5">B2B Ad Hooks</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TIMELINE TRACKS */}
                <div className="bg-surface-2 border border-hairline rounded-lg p-3 font-mono text-[10px] relative overflow-hidden">
                  {/* Playhead Guide */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 pointer-events-none transition-all duration-75"
                    style={{ left: `${12 + playheadPosition * 0.86}%` }}
                  />

                  {/* Track 1: Video */}
                  <div className="flex items-center gap-3 border-b border-hairline/60 py-2">
                    <span className="w-16 font-semibold text-ink-subtle">V1 (VIDEO)</span>
                    <div className="flex-1 flex gap-1 h-5">
                      <div className="w-[30%] bg-indigo-500/20 border border-indigo-500/40 rounded flex items-center justify-center text-[9px] text-ink font-medium">B-Roll Hook</div>
                      <div className="w-[50%] bg-indigo-500/30 border border-indigo-500/50 rounded flex items-center justify-center text-[9px] text-ink font-medium">A-Roll Presenting</div>
                      <div className="w-[20%] bg-indigo-500/20 border border-indigo-500/40 rounded flex items-center justify-center text-[9px] text-ink font-medium">Outro Call</div>
                    </div>
                  </div>

                  {/* Track 2: Audio */}
                  <div className="flex items-center gap-3 border-b border-hairline/60 py-2">
                    <span className="w-16 font-semibold text-ink-subtle">A1 (AUDIO)</span>
                    <div className="flex-1 flex gap-1 h-5">
                      <div className="w-[80%] bg-blue-500/20 border border-blue-500/40 rounded flex items-center justify-center text-[9px] text-ink-muted">Voiceover Anchoring (Amaljith)</div>
                      <div className="w-[20%] bg-slate-500/25 border border-slate-500/45 rounded flex items-center justify-center text-[9px] text-ink-tertiary font-medium">BG Music</div>
                    </div>
                  </div>

                  {/* Track 3: Graphics */}
                  <div className="flex items-center gap-3 py-2">
                    <span className="w-16 font-semibold text-ink-subtle">T1 (TEXT)</span>
                    <div className="flex-1 flex gap-1 h-5">
                      <div className="w-[20%] bg-yellow-500/10 border border-yellow-500/30 rounded flex items-center justify-center text-[9px] text-yellow-300/80">Hook Caption</div>
                      <div className="w-[10%]"></div>
                      <div className="w-[40%] bg-yellow-500/10 border border-yellow-500/30 rounded flex items-center justify-center text-[9px] text-yellow-300/80">Graph Overlay</div>
                      <div className="w-[30%] bg-yellow-500/10 border border-yellow-500/30 rounded flex items-center justify-center text-[9px] text-yellow-300/80">CTA Subtitle</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-hairline text-xs text-ink-tertiary">
                <span>timeline_version: v1.4.1</span>
                <span>Active project: &quot;Links Consultants Lead Gen Promo&quot;</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PROFESSIONAL EXPERIENCE */}
      <section id="experience" className="py-24 border-t border-hairline max-w-[1280px] mx-auto px-6 reveal">
        <div className="flex flex-col lg:flex-row gap-12 reveal-stagger">
          {/* Section Left Column */}
          <div className="lg:w-1/3">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Career Path</span>
            <h2 className="text-3xl md:text-[40px] font-semibold tracking-[-1.0px] leading-tight text-ink mt-2">
              Professional Experience
            </h2>
            <p className="text-base text-ink-subtle mt-4">
              Over 6 years leading digital marketing strategies, paid ad campaigns, team leadership, and content creation in Dubai and regional markets.
            </p>
            <div className="mt-8 bg-surface-1 border border-hairline p-5 rounded-lg">
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-3 font-mono">Core Competencies</h4>
              <ul className="flex flex-wrap gap-2 text-xs">
                {["Performance Marketing", "Paid Advertising (Google/Meta)", "Local SEO Strategy", "Lead Generation", "Campaign Planning", "Videography & Editing", "Graphic Design", "Team Leadership", "Analytics & Reporting"].map((comp, idx) => (
                  <li key={idx} className="bg-canvas border border-hairline px-2.5 py-1 rounded text-ink-muted">{comp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section Right Column: Timeline */}
          <div className="lg:w-2/3 flex flex-col gap-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-hairline">
            {/* Job 1 */}
            <div className="relative pl-10 group reveal" style={{ transitionDelay: "50ms" }}>
              {/* Timeline dot */}
              <div className="absolute left-[11px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-canvas group-hover:scale-125 transition-transform" />
              <div className="bg-surface-1 border border-hairline rounded-lg p-6 hover:border-hairline-strong card-hover-lift">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Digital Marketing Manager | Team Lead</h3>
                    <span className="text-sm text-primary font-medium mt-0.5 block">Links Consultants, Dubai</span>
                  </div>
                  <span className="text-xs font-mono text-ink-subtle bg-surface-2 border border-hairline px-2.5 py-1 rounded">
                    Feb 2024 — Mar 2026
                  </span>
                </div>
                <p className="text-sm text-ink-muted mb-4 leading-relaxed">
                  Led end-to-end digital marketing plans across SEO, SEM, social media channels, and paid lead generation campaigns. Spearheaded content production and budget distribution optimization.
                </p>
                <ul className="list-disc pl-5 text-xs text-ink-subtle flex flex-col gap-2">
                  <li>Executed localized digital marketing plans driving B2B leads in the competitive UAE Business Setup market.</li>
                  <li>Directly managed Google Search/Display Ads and Meta Ads Manager accounts, optimizing budgets based on CPA.</li>
                  <li>Produced in-house videography, short-form ad video editing, and anchor presenting for YouTube/TikTok distribution.</li>
                </ul>
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-hairline/60">
                  {["Google Ads", "Meta Ads Manager", "SEMrush", "CapCut Premium", "Canva", "Local SEO"].map((tool, idx) => (
                    <span key={idx} className="bg-canvas text-ink-subtle font-mono text-[10px] px-2 py-0.5 rounded border border-hairline">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Job 2 */}
            <div className="relative pl-10 group reveal" style={{ transitionDelay: "150ms" }}>
              <div className="absolute left-[11px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-canvas group-hover:scale-125 transition-transform" />
              <div className="bg-surface-1 border border-hairline rounded-lg p-6 hover:border-hairline-strong card-hover-lift">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Digital Marketing Manager</h3>
                    <span className="text-sm text-primary font-medium mt-0.5 block">916 Creative Minds</span>
                  </div>
                  <span className="text-xs font-mono text-ink-subtle bg-surface-2 border border-hairline px-2.5 py-1 rounded">
                    Nov 2021 — Dec 2023
                  </span>
                </div>
                <p className="text-sm text-ink-muted mb-4 leading-relaxed">
                  Engineered regional digital marketing campaigns to grow visibility, leads, and brand engagement. Formulated cross-channel content strategies.
                </p>
                <ul className="list-disc pl-5 text-xs text-ink-subtle flex flex-col gap-2">
                  <li>Formulated paid campaign structures across social and search, improving conversion metrics in Dubai segments.</li>
                  <li>Maintained analytics reporting loops to present transparent ROI breakdowns directly to stakeholders.</li>
                  <li>Optimized local map citations and search performance, securing high ranks for competitive localized keywords.</li>
                </ul>
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-hairline/60">
                  {["Meta Ads", "Google Ads", "Google Analytics", "Asana", "Photoshop", "Yoast SEO"].map((tool, idx) => (
                    <span key={idx} className="bg-canvas text-ink-subtle font-mono text-[10px] px-2 py-0.5 rounded border border-hairline">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Job 3 */}
            <div className="relative pl-10 group reveal" style={{ transitionDelay: "250ms" }}>
              <div className="absolute left-[11px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-canvas group-hover:scale-125 transition-transform" />
              <div className="bg-surface-1 border border-hairline rounded-lg p-6 hover:border-hairline-strong card-hover-lift">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Digital Marketing Executive &amp; SEO Analyst</h3>
                    <span className="text-sm text-primary font-medium mt-0.5 block">UBL International, Kerala</span>
                  </div>
                  <span className="text-xs font-mono text-ink-subtle bg-surface-2 border border-hairline px-2.5 py-1 rounded">
                    Jan 2021 — Nov 2021
                  </span>
                </div>
                <p className="text-sm text-ink-muted mb-4 leading-relaxed">
                  Supervised SEO activities, PPC budgets, social media strategies, and email workflows for diverse client portfolios.
                </p>
                <ul className="list-disc pl-5 text-xs text-ink-subtle flex flex-col gap-2">
                  <li>Performed comprehensive keyword research, on-page optimization, content restructuring, and high-quality link building.</li>
                  <li>Ensured client retention and long-term satisfaction via routine data analytics audits and performance reporting.</li>
                  <li>Improved average conversion rates by 22% through landing page A/B test experiments.</li>
                </ul>
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-hairline/60">
                  {["SEO Audits", "SEMrush", "Mailchimp", "PPC Campaigns", "Google Analytics"].map((tool, idx) => (
                    <span key={idx} className="bg-canvas text-ink-subtle font-mono text-[10px] px-2 py-0.5 rounded border border-hairline">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Job 4 */}
            <div className="relative pl-10 group reveal" style={{ transitionDelay: "350ms" }}>
              <div className="absolute left-[11px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-canvas group-hover:scale-125 transition-transform" />
              <div className="bg-surface-1 border border-hairline rounded-lg p-6 hover:border-hairline-strong card-hover-lift">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Digital Marketing Executive</h3>
                    <span className="text-sm text-primary font-medium mt-0.5 block">Impress Ads, Kerala</span>
                  </div>
                  <span className="text-xs font-mono text-ink-subtle bg-surface-2 border border-hairline px-2.5 py-1 rounded">
                    May 2019 — Dec 2020
                  </span>
                </div>
                <p className="text-sm text-ink-muted mb-4 leading-relaxed">
                  Coordinated localized digital advertising, content marketing, and email distribution projects.
                </p>
                <ul className="list-disc pl-5 text-xs text-ink-subtle flex flex-col gap-2">
                  <li>Administered SEO structures and local social media channels, improving organic lead inflow.</li>
                  <li>Collected data and generated routine analytics summaries to isolate campaign optimization vectors.</li>
                  <li>Refined target ad creatives and copy variations, securing cost reduction for paid leads.</li>
                </ul>
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-hairline/60">
                  {["SEO Optimization", "Social Media Ads", "Email Marketing", "Canva", "Google Analytics"].map((tool, idx) => (
                    <span key={idx} className="bg-canvas text-ink-subtle font-mono text-[10px] px-2 py-0.5 rounded border border-hairline">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS & PLATFORMS GRID */}
      <section id="tools" className="py-24 border-t border-hairline max-w-[1280px] mx-auto px-6 reveal">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-stagger">
          <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Stack Matrix</span>
          <h2 className="text-3xl md:text-[40px] font-semibold tracking-[-1.0px] leading-tight text-ink mt-2">
            Tools &amp; Platforms
          </h2>
          <p className="text-base text-ink-subtle mt-4">
            Leveraging industry-standard tools to configure, execute, audit, and optimize campaigns for maximum lead conversion.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 reveal-stagger">
          {[
            { name: "Google Ads", cat: "Paid Search &amp; Display" },
            { name: "Meta Ads Manager", cat: "Paid Social" },
            { name: "Google Analytics", cat: "Performance Audits" },
            { name: "SEMrush", cat: "SEO &amp; Keyword Audit" },
            { name: "Mailchimp", cat: "Email Automation" },
            { name: "Yoast SEO", cat: "On-Page Schema &amp; XML" },
            { name: "Asana", cat: "Campaign Operations" },
            { name: "Capcut Premium", cat: "Video Editing" },
            { name: "Photoshop", cat: "Graphic Assets" },
            { name: "Canva", cat: "Rapid Visual Prototyping" },
          ].map((tool, idx) => (
            <div
              key={idx}
              className="bg-surface-1 border border-hairline hover:border-hairline-strong rounded-lg p-5 text-left flex flex-col justify-between group card-hover-lift reveal"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <div className="w-8 h-8 rounded bg-canvas border border-hairline flex items-center justify-center mb-4 text-xs font-semibold text-primary font-mono group-hover:bg-surface-2 transition-colors">
                {tool.name[0]}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink font-mono">{tool.name}</h4>
                <p className="text-[11px] text-ink-subtle mt-1">{tool.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADDITIONAL CV DETAILS (Education, Languages) */}
      <section id="about" className="py-24 border-t border-hairline bg-surface-1/20 reveal">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 reveal-stagger">
          {/* Education Card */}
          <div className="bg-surface-1 border border-hairline rounded-lg p-8">
            <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase font-mono">Academic</span>
            <h3 className="text-xl font-semibold text-ink mt-2 mb-6">Education</h3>
            
            <div className="flex flex-col gap-6">
              <div className="border-b border-hairline/60 pb-4">
                <h4 className="text-base font-semibold text-ink">BSc Computer Science</h4>
                <span className="text-xs text-ink-subtle block mt-1">Undergraduate Degree — India</span>
                <p className="text-xs text-ink-tertiary mt-2">Provides the foundational logic, technical coding capability, and web structure analysis that drives advanced SEO audits and ad-tech integrations.</p>
              </div>
              <div className="border-b border-hairline/60 pb-4">
                <h4 className="text-base font-semibold text-ink">Plus Two — Computer Science</h4>
                <span className="text-xs text-ink-subtle block mt-1">Secondary School Certificate</span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-ink">SSLC</h4>
                <span className="text-xs text-ink-subtle block mt-1">Kerala Board</span>
              </div>
            </div>
          </div>

          {/* Languages & Background summary */}
          <div className="flex flex-col justify-between p-2">
            <div>
              <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase font-mono">Linguistic Stack</span>
              <h3 className="text-2xl font-semibold text-ink mt-2 mb-4">Languages</h3>
              <p className="text-sm text-ink-subtle mb-6 leading-relaxed">
                Multilingual communication skills essential for handling multicultural client portfolios and generating targeted ad creatives across diverse UAE demographics.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { lang: "English", level: "Professional working proficiency" },
                  { lang: "Malayalam", level: "Native speaker" },
                  { lang: "Tamil", level: "Conversational capability" },
                  { lang: "Hindi", level: "Conversational capability" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-1 border border-hairline p-4 rounded-lg card-hover-lift">
                    <span className="text-sm font-semibold text-ink block font-mono">{item.lang}</span>
                    <span className="text-xs text-ink-tertiary mt-1 block">{item.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-primary/5 border border-primary/20 p-5 rounded-lg">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 font-mono">Strategy Summary</h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                By bridging technical computer science concepts with human marketing psychology, Amaljith creates systematic, high-converting digital funnels that optimize marketing spend and convert inbound search traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM COMPONENT */}
      <section id="contact" className="py-24 border-t border-hairline max-w-[1280px] mx-auto px-6 reveal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 reveal-stagger">
          {/* Contact Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[13px] font-medium tracking-[0.4px] text-primary uppercase">Get in Touch</span>
              <h2 className="text-3xl md:text-[40px] font-semibold tracking-[-1.0px] leading-tight text-ink mt-2">
                Launch a Campaign
              </h2>
              <p className="text-base text-ink-subtle mt-4 leading-relaxed">
                Ready to optimize your ad spend, scale your leads, and improve search visibility in the Dubai or international market? Contact Amaljith directly.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline rounded-lg card-hover-lift">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <MailIcon />
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary block font-mono uppercase">Direct Email</span>
                  <a href="mailto:amaljithkj023@gmail.com" className="text-xs font-semibold text-ink hover:text-primary transition-colors font-mono">
                    amaljithkj023@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline rounded-lg card-hover-lift">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <PhoneIcon />
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary block font-mono uppercase">Call / WhatsApp</span>
                  <a href="tel:+971545895769" className="text-xs font-semibold text-ink hover:text-primary transition-colors font-mono">
                    +971 545895769
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-ink-tertiary mt-8">
              * Average initial campaign alignment turnaround is 48 hours. Let&apos;s build together.
            </p>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface-1 border border-hairline rounded-lg p-8 relative">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center scale-in">
                  <div className="w-12 h-12 rounded-full bg-semantic-success/20 border border-semantic-success flex items-center justify-center mb-4 text-semantic-success">
                    ✓
                  </div>
                  <h3 className="text-lg font-semibold text-ink">Campaign Inquiry Transmitted</h3>
                  <p className="text-sm text-ink-subtle mt-2 max-w-sm">
                    Thank you. Amaljith has received your contact parameters and will reply via email shortly.
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="mt-6 text-xs text-primary hover:text-primary-hover font-mono uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
                  <h3 className="text-base font-semibold text-ink font-mono border-b border-hairline pb-3 mb-1">Inquiry Specs</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-ink-muted uppercase font-mono font-medium">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="bg-canvas border border-hairline hover:border-hairline-strong focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3.5 py-2 text-sm text-ink placeholder-ink-tertiary focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-ink-muted uppercase font-mono font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@company.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="bg-canvas border border-hairline hover:border-hairline-strong focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3.5 py-2 text-sm text-ink placeholder-ink-tertiary focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-ink-muted uppercase font-mono font-medium">Campaign / Project Type</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="bg-canvas border border-hairline hover:border-hairline-strong focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3.5 py-2 text-sm text-ink focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="lead-gen">Lead Generation (Google/Meta Ads)</option>
                      <option value="seo">SEO Audit &amp; Keyword Visibility Optimization</option>
                      <option value="social">Social Media Content Strategy</option>
                      <option value="video">Videography / Anchoring &amp; Video Production</option>
                      <option value="all">Full Digital Marketing Funnel Consultation</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-ink-muted uppercase font-mono font-medium">Brief Description</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Outline your target goals, monthly spend budget range, or primary SEO objectives..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="bg-canvas border border-hairline hover:border-hairline-strong focus:border-primary focus:ring-1 focus:ring-primary rounded-md px-3.5 py-2 text-sm text-ink placeholder-ink-tertiary focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full py-2.5 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold font-mono tracking-wide transition-all btn-transition shadow-lg hover:shadow-primary/10 cursor-pointer"
                  >
                    Transmit Inquiry Parameters
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-canvas border-t border-hairline py-16 px-6 md:px-12 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center text-white text-[10px] font-bold font-mono">
            A
          </div>
          <span className="font-display font-semibold tracking-[-0.4px] text-sm text-ink">
            AMALJITH KJ — DIGITAL MARKETING MANAGER
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 text-xs text-ink-subtle font-mono">
          <span>&copy; {new Date().getFullYear()} Amaljith KJ. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <a href="mailto:amaljithkj023@gmail.com" className="hover:text-ink transition-colors flex items-center gap-1.5">
            amaljithkj023@gmail.com
            <ExternalLinkIcon />
          </a>
        </div>
      </footer>
    </div>
  );
}
