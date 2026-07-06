# Animation Reference — Best Practices & Code Patterns

> A practical guide for AI agents building web UIs. Every pattern includes copy-paste code. Pick the right animation for the job, keep it performant, and never overdo it.

---

## 1. Core Principles

- **Animate only `transform` and `opacity`.** These two properties are GPU-composited — they skip layout and paint. Animating `width`, `height`, `top`, `left`, `margin`, or `padding` causes layout thrashing and jank.
- **60 fps or nothing.** If a transition can't run smoothly, remove it. A janky animation is worse than no animation.
- **One hero animation per view.** Spend your motion budget on one memorable moment. Keep everything else subtle.
- **Respect `prefers-reduced-motion`.** Always wrap non-essential animations in a media query check.
- **Duration sweet spots:** micro-interactions 150–250ms, entrances 300–600ms, page transitions 400–800ms, background/ambient 8–30s. Anything under 100ms feels instant (pointless). Anything over 1s feels sluggish (unless ambient).

---

## 2. Easing Cheat Sheet

```css
/* ── Natural / default choice ── */
--ease-out:      cubic-bezier(0.22, 1, 0.36, 1);     /* elements entering — fast start, gentle land */
--ease-in:       cubic-bezier(0.55, 0, 1, 0.45);     /* elements exiting — slow start, fast exit */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);     /* looping / symmetric moves */

/* ── Expressive / bouncy ── */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* playful overshoot, good for buttons/badges */
--ease-snap:     cubic-bezier(0.68, -0.6, 0.32, 1.6);/* snappy with slight reverse at start */

/* ── Smooth / premium feel ── */
--ease-smooth:   cubic-bezier(0.25, 0.1, 0.25, 1);   /* iOS-style smooth glide */
--ease-power3:   cubic-bezier(0.33, 0, 0, 1);        /* strong deceleration, feels weighty */

/* ── Linear ── */
/* ONLY for: progress bars, color cycling, infinite rotation. Never for entrances/exits. */
```

**Rule of thumb:** Elements entering the screen → `ease-out`. Elements leaving → `ease-in`. Looping → `ease-in-out` or `linear`.

---

## 3. Entrance Animations

### 3a. Fade Up (most versatile — use as default)

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

**Stagger children** — add incremental delay to each item:

```css
.fade-up:nth-child(1) { animation-delay: 0ms; }
.fade-up:nth-child(2) { animation-delay: 80ms; }
.fade-up:nth-child(3) { animation-delay: 160ms; }
/* ...or in JS/React: style={{ animationDelay: `${index * 80}ms` }} */
```

### 3b. Fade In (no movement — for overlays, modals, toasts)

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-out both;
}
```

### 3c. Scale In (modals, popups, cards)

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

### 3d. Slide In from Left/Right (sidebars, drawers, cards)

```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 3e. Blur Reveal (hero text, titles — premium feel)

```css
@keyframes blurReveal {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.blur-reveal {
  animation: blurReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

**Warning:** `filter: blur()` triggers paint on every frame. Only use for hero-level text, never on long lists.

### 3f. Clip Reveal (text lines, section dividers)

```css
@keyframes clipReveal {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0% 0 0); }
}

.clip-reveal {
  animation: clipReveal 0.8s cubic-bezier(0.65, 0, 0.35, 1) both;
}
```

---

## 4. Scroll-Triggered Animations

### 4a. Intersection Observer (preferred — vanilla JS & React)

```jsx
// React hook — reuse everywhere
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// Usage
function Card({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

### 4b. CSS-Only Scroll Animation (modern browsers)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.scroll-animate {
  animation: fadeUp both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

**Support note:** `animation-timeline: view()` works in Chrome 115+ and Edge. Not yet in Safari/Firefox. Use Intersection Observer as fallback.

---

## 5. Micro-Interactions

### 5a. Button Hover & Press

```css
.btn {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.btn:active {
  transform: translateY(0) scale(0.97);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition-duration: 0.08s;
}
```

### 5b. Card Hover Lift

```css
.card {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}
```

### 5c. Link Underline Grow

```css
.link {
  position: relative;
  text-decoration: none;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.link:hover::after {
  width: 100%;
}
```

### 5d. Toggle / Switch

```css
.toggle-knob {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* spring easing gives it a satisfying snap */
}

.toggle.active .toggle-knob {
  transform: translateX(24px);
}
```

### 5e. Icon Rotate on Hover

```css
.icon-btn svg {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.icon-btn:hover svg {
  transform: rotate(15deg) scale(1.1);
}
```

---

## 6. Loading & Progress

### 6a. Skeleton Shimmer

```css
@keyframes shimmer {
  from { background-position: -400px 0; }
  to   { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.8s linear infinite;
  border-radius: 6px;
}
```

### 6b. Spinner (simple, performant)

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2.5px solid rgba(255, 255, 255, 0.1);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
```

### 6c. Progress Bar Fill

```css
.progress-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
  /* set width via inline style or JS */
}
```

### 6d. Counting Number (React)

```jsx
function AnimatedCounter({ target, duration = 1200, suffix = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const steps = 50;
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
  }, [target, duration]);

  return <span>{value}{suffix}</span>;
}
```

---

## 7. Background & Ambient Effects

### 7a. Gradient Shift (subtle background life)

```css
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.ambient-bg {
  background: linear-gradient(135deg, #0a1628, #1a2a4a, #0e1f3d);
  background-size: 300% 300%;
  animation: gradientShift 15s ease-in-out infinite;
}
```

### 7b. Floating Particles (React)

```jsx
function Particles({ count = 20 }) {
  const dots = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
    }))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {dots.current.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'currentColor',
            opacity: 0.15,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
```

```css
@keyframes float {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(20px, -30px); }
}
```

### 7c. Pulse Glow (accent elements, badges, active states)

```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(0, 212, 170, 0.15); }
  50%      { box-shadow: 0 0 32px rgba(0, 212, 170, 0.35); }
}

.glow {
  animation: pulseGlow 2.5s ease-in-out infinite;
}
```

### 7d. Border Shimmer (premium card edges)

```css
@keyframes borderShimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.shimmer-border {
  position: relative;
  border-radius: 12px;
  padding: 1px; /* the "border" width */
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 212, 170, 0.5) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: borderShimmer 3s linear infinite;
}

.shimmer-border-inner {
  background: #0a1628;
  border-radius: 11px;
  padding: 20px;
}
```

---

## 8. SVG Animations

### 8a. Path Draw (line art, icons, signatures)

```css
.draw-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

**Tip:** Measure exact path length with `path.getTotalLength()` and use that value instead of 1000.

### 8b. SVG Pulse (node diagrams, orbit dots)

```xml
<circle cx="50" cy="50" r="10" fill="#00D4AA">
  <animate attributeName="r" values="10;14;10" dur="2.5s" repeatCount="indefinite" />
  <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
</circle>
```

### 8c. Orbit Rotation

```xml
<g transform-origin="160 160">
  <animateTransform
    attributeName="transform"
    type="rotate"
    from="0 160 160"
    to="360 160 160"
    dur="20s"
    repeatCount="indefinite"
  />
  <!-- children here orbit around cx=160, cy=160 -->
</g>
```

---

## 9. Stagger Patterns

Staggering makes groups of elements feel intentional rather than dumped on screen.

### 9a. CSS Stagger (known count)

```css
.stagger-item {
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* each child 80ms after the previous */
.stagger-item:nth-child(1)  { animation-delay: 0ms; }
.stagger-item:nth-child(2)  { animation-delay: 80ms; }
.stagger-item:nth-child(3)  { animation-delay: 160ms; }
.stagger-item:nth-child(4)  { animation-delay: 240ms; }
.stagger-item:nth-child(5)  { animation-delay: 320ms; }
.stagger-item:nth-child(6)  { animation-delay: 400ms; }
```

### 9b. React Stagger (dynamic lists)

```jsx
{items.map((item, i) => (
  <div
    key={item.id}
    style={{
      animation: `fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both`,
      animationDelay: `${i * 80}ms`,
    }}
  >
    {item.content}
  </div>
))}
```

### 9c. Stagger Rules

| Item count | Delay per item | Total stagger time | Feels like          |
|------------|----------------|--------------------|---------------------|
| 3–5        | 100ms          | 300–500ms          | Quick cascade       |
| 6–10       | 80ms           | 480–800ms          | Flowing reveal      |
| 10–20      | 50ms           | 500–1000ms         | Wave                |
| 20+        | 30ms           | Keep under 1.2s    | Rapid stream        |

Never let total stagger time exceed ~1.2s. The last item should not feel "late."

---

## 10. Text Animations

### 10a. Typewriter

```css
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid currentColor;
  width: 0;
  animation:
    typing 2s steps(30) 0.5s forwards,
    blink 0.6s step-end infinite;
}

@keyframes typing {
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

### 10b. Title Swap (rotating headlines)

```jsx
function RotatingTitle({ titles, interval = 3000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(p => (p + 1) % titles.length), interval);
    return () => clearInterval(t);
  }, [titles.length, interval]);

  return (
    <div style={{ height: '1.3em', overflow: 'hidden' }}>
      <span
        key={index}
        style={{ display: 'block', animation: 'slideInTitle 0.5s ease-out' }}
      >
        {titles[index]}
      </span>
    </div>
  );
}
```

```css
@keyframes slideInTitle {
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 10c. Character-by-Character Reveal (React)

```jsx
function TextReveal({ text, delay = 30, startDelay = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setCount(c => {
          if (c >= text.length) { clearInterval(timer); return c; }
          return c + 1;
        });
      }, delay);
      return () => clearInterval(timer);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, delay, startDelay]);

  return <span>{text.slice(0, count)}</span>;
}
```

---

## 11. Accessibility — Reduced Motion

Always include this. Non-negotiable.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

React check:

```jsx
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// Usage: const reduced = usePrefersReducedMotion();
// Then skip or simplify animations when reduced === true
```

---

## 12. Performance Rules

1. **Only animate `transform` and `opacity`** — everything else triggers layout or paint.
2. **Use `will-change` sparingly** — add it only to elements about to animate, remove after.
3. **Avoid animating `filter: blur()`** on more than 1–2 elements at a time.
4. **Infinite animations** should use `linear` or gentle easing — sharp curves waste GPU cycles recalculating.
5. **Remove off-screen animations** — use Intersection Observer to pause what isn't visible.
6. **Prefer CSS over JS** for simple transitions. JS is for orchestration and scroll-linked logic.
7. **Test on low-end devices** — if it drops frames on a $150 Android phone, simplify.

---

## 13. Decision Matrix — Which Animation to Use

| Situation                         | Animation           | Duration  | Easing            |
|-----------------------------------|---------------------|-----------|-------------------|
| Page first load — hero section    | Blur reveal         | 600–800ms | ease-out          |
| Cards/items entering viewport     | Fade up + stagger   | 400–500ms | ease-out          |
| Modal or popup opening            | Scale in + fade     | 300–350ms | ease-out          |
| Modal closing                     | Scale out + fade    | 200–250ms | ease-in           |
| Sidebar / drawer opening          | Slide in from edge  | 350ms     | ease-out          |
| Button hover                      | Lift + shadow       | 200ms     | ease-out          |
| Button press                      | Scale down          | 80ms      | ease-in           |
| Toggle switch                     | Translate X         | 250ms     | spring            |
| Data loading placeholder          | Skeleton shimmer    | 1.8s loop | linear            |
| Spinner                           | Rotate 360          | 700ms     | linear            |
| Progress bar                      | Width transition    | 1s        | ease-out          |
| Stat counter                      | Number count up     | 1–1.5s    | linear steps      |
| Background mood                   | Gradient shift      | 12–20s    | ease-in-out       |
| Active/live indicator             | Pulse glow          | 2–3s      | ease-in-out       |
| Premium card border               | Border shimmer      | 3s        | linear            |
| Heading swap / rotating text      | Slide + fade        | 500ms     | ease-out          |
| Skill bar fill                    | Width + glow        | 1–1.2s    | ease-out          |
| SVG icon entrance                 | Path draw           | 1.5–2s    | ease-in-out       |
| Orbit / diagram nodes             | SVG animate pulse   | 2–3s      | ease-in-out       |

---

## 14. Common Mistakes to Avoid

- **Animating `height: auto`** — CSS cannot transition to `auto`. Use `max-height` with a generous value, or `grid-template-rows: 0fr → 1fr`.
- **Stacking too many `box-shadow` animations** — each shadow is repainted every frame. One is fine, five kills performance.
- **Forgetting `animation-fill-mode: both`** — without it, elements snap back to their pre-animation state.
- **Using `setTimeout` for sequencing** — it drifts. Use `animation-delay` or `requestAnimationFrame`.
- **Animating layout properties on scroll** — `width`, `height`, `top`, `left` in a scroll handler is a guaranteed jank source.
- **Too many particles** — 15–25 is enough. 100+ floating dots tanks mobile browsers.
- **Ignoring reduced motion** — some users get motion sickness. Always provide the media query escape hatch.