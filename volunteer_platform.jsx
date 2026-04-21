import { useState, useEffect, useRef } from "react";

// ── Fake data ──────────────────────────────────────────────────────────────
const NEEDS = [
  { id: 1, area: "Dharavi, Mumbai", category: "Food Relief", urgency: 92, volunteers: 3, needed: 12, icon: "🍱", color: "#ef4444" },
  { id: 2, area: "Govandi, Mumbai", category: "Medical Aid", urgency: 87, volunteers: 5, needed: 8, icon: "🏥", color: "#f97316" },
  { id: 3, area: "Kurla West", category: "Education", urgency: 74, volunteers: 8, needed: 10, icon: "📚", color: "#eab308" },
  { id: 4, area: "Mankhurd", category: "Shelter", urgency: 68, volunteers: 2, needed: 6, icon: "🏠", color: "#84cc16" },
  { id: 5, area: "Chembur East", category: "Clean Water", urgency: 61, volunteers: 7, needed: 9, icon: "💧", color: "#06b6d4" },
  { id: 6, area: "Trombay", category: "Disaster Relief", urgency: 55, volunteers: 4, needed: 7, icon: "🌊", color: "#6366f1" },
];

const VOLUNTEERS = [
  { id: 1, name: "Priya Sharma", skills: ["Medical", "First Aid"], available: true, matched: "Govandi, Mumbai" },
  { id: 2, name: "Arjun Mehta", skills: ["Teaching", "Counseling"], available: true, matched: "Kurla West" },
  { id: 3, name: "Sneha Patil", skills: ["Logistics", "Food"], available: false, matched: null },
  { id: 4, name: "Rohit Desai", skills: ["Construction", "Shelter"], available: true, matched: "Mankhurd" },
  { id: 5, name: "Ananya Rao", skills: ["Medical", "Nutrition"], available: true, matched: "Govandi, Mumbai" },
  { id: 6, name: "Dev Kulkarni", skills: ["Water Mgmt", "Engineering"], available: false, matched: null },
];

const STATS = [
  { label: "Communities Served", value: 148, suffix: "+", color: "#22d3ee" },
  { label: "Active Volunteers", value: 2340, suffix: "", color: "#a3e635" },
  { label: "Needs Resolved", value: 87, suffix: "%", color: "#f472b6" },
  { label: "NGO Partners", value: 62, suffix: "", color: "#fb923c" },
];

// ── Animated counter ──────────────────────────────────────────────────────
function Counter({ target, suffix, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(start));
        }, 20);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref} style={{ color, fontFamily: "'Syne', sans-serif", fontSize: "2.6rem", fontWeight: 800 }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ── Urgency bar ───────────────────────────────────────────────────────────
function UrgencyBar({ value, color }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setW(value), 100);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 6, width: "100%", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 99, background: color,
        width: `${w}%`, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: `0 0 12px ${color}88`
      }} />
    </div>
  );
}

// ── Floating particle ─────────────────────────────────────────────────────
function Particle({ x, y, delay, size, color }) {
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: "50%",
      background: color, opacity: 0.15,
      animation: `float ${3 + Math.random() * 4}s ease-in-out ${delay}s infinite alternate`,
      pointerEvents: "none"
    }} />
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("needs");
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [matchAnim, setMatchAnim] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    delay: i * 0.3, size: `${4 + Math.random() * 8}px`,
    color: ["#22d3ee", "#a3e635", "#f472b6", "#fb923c"][i % 4]
  }));

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #050a0f; }
    @keyframes float { from { transform: translateY(0px) scale(1); } to { transform: translateY(-20px) scale(1.1); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes glow { 0%,100% { box-shadow: 0 0 20px #22d3ee44; } 50% { box-shadow: 0 0 50px #22d3ee99; } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
    @keyframes matchPulse { 0% { transform:scale(1); } 50% { transform:scale(1.04); } 100% { transform:scale(1); } }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0f1a; } ::-webkit-scrollbar-thumb { background: #22d3ee44; border-radius:3px; }
  `;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#050a0f", color: "#e2e8f0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(5,10,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(34,211,238,0.12)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#22d3ee,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>🤝</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: 1 }}>
            <span style={{ color: "#22d3ee" }}>Seva</span>Link
          </span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Dashboard", "Needs Map", "Volunteers", "Reports"].map(item => (
            <span key={item} style={{ fontSize: "0.82rem", color: "#94a3b8", cursor: "pointer", letterSpacing: 0.5, fontWeight: 500,
              transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#22d3ee"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}>{item}</span>
          ))}
        </div>
        <button style={{
          background: "linear-gradient(135deg,#22d3ee22,#6366f122)",
          border: "1px solid #22d3ee55", color: "#22d3ee",
          padding: "8px 20px", borderRadius: 8, cursor: "pointer",
          fontSize: "0.8rem", fontWeight: 600, letterSpacing: 0.5
        }}>Register NGO →</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 80 }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        {/* Gradient blob */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none"
        }} />
        {/* Particles */}
        {particles.map((p, i) => <Particle key={i} {...p} />)}

        <div style={{
          textAlign: "center", zIndex: 1, maxWidth: 780, padding: "0 24px",
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(50px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)"
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)",
            borderRadius: 99, padding: "6px 16px", marginBottom: 28, fontSize: "0.75rem",
            color: "#22d3ee", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Mono',monospace"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", animation: "pulse 2s infinite" }}></span>
            Live · Smart Resource Allocation
          </div>

          <h1 style={{
            fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.4rem,6vw,4.2rem)",
            fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: -1
          }}>
            Connect <span style={{ color: "#22d3ee", position: "relative" }}>
              Community Needs
              <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#22d3ee,#6366f1)", borderRadius: 99 }} />
            </span>{" "}
            with the Right <span style={{ background: "linear-gradient(90deg,#a3e635,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Volunteers
            </span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            SevhLink aggregates scattered field reports from NGOs & local groups, surfaces the most urgent needs, and intelligently matches available volunteers — in real time.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{
              background: "linear-gradient(135deg,#22d3ee,#6366f1)", border: "none",
              color: "#fff", padding: "14px 32px", borderRadius: 12, cursor: "pointer",
              fontSize: "0.95rem", fontWeight: 600, animation: "glow 3s infinite",
              transition: "transform 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >View Live Needs →</button>
            <button style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
              color: "#e2e8f0", padding: "14px 32px", borderRadius: 12, cursor: "pointer",
              fontSize: "0.95rem", fontWeight: 500,
              transition: "all 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee55"; e.currentTarget.style.color = "#22d3ee"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#e2e8f0"; }}
            >Join as Volunteer</button>
          </div>

          {/* Scroll cue */}
          <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#475569", fontSize: "0.7rem", letterSpacing: 2 }}>
            <span>SCROLL</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(#22d3ee,transparent)" }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <Counter target={s.value} suffix={s.suffix} color={s.color} />
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 6, letterSpacing: 0.5, fontFamily: "'DM Mono',monospace" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", color: "#22d3ee", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Real-Time Dashboard</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800 }}>
            Where Help Is Needed <span style={{ color: "#22d3ee" }}>Most</span>
          </h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 32, width: "fit-content", margin: "0 auto 32px" }}>
          {["needs", "volunteers", "matching"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "9px 22px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", fontWeight: 600, letterSpacing: 0.3,
              background: activeTab === tab ? "linear-gradient(135deg,#22d3ee22,#6366f122)" : "transparent",
              color: activeTab === tab ? "#22d3ee" : "#64748b",
              borderColor: activeTab === tab ? "#22d3ee33" : "transparent",
              borderStyle: "solid", borderWidth: 1,
              transition: "all 0.25s"
            }}>
              {tab === "needs" ? "🗺 Urgent Needs" : tab === "volunteers" ? "👥 Volunteers" : "⚡ Smart Match"}
            </button>
          ))}
        </div>

        {/* NEEDS TAB */}
        {activeTab === "needs" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20, animation: "fadeUp 0.5s ease" }}>
            {NEEDS.map((n, i) => (
              <div key={n.id}
                onClick={() => setSelectedNeed(selectedNeed?.id === n.id ? null : n)}
                style={{
                  background: selectedNeed?.id === n.id ? `${n.color}11` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedNeed?.id === n.id ? n.color + "55" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 16, padding: 22, cursor: "pointer",
                  transition: "all 0.3s", animation: `slideIn 0.4s ease ${i * 0.07}s both`,
                  transform: selectedNeed?.id === n.id ? "scale(1.01)" : "scale(1)"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = n.color + "55"}
                onMouseLeave={e => { if (selectedNeed?.id !== n.id) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{n.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 }}>{n.category}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "'DM Mono',monospace" }}>{n.area}</div>
                  </div>
                  <div style={{
                    background: `${n.color}22`, border: `1px solid ${n.color}44`,
                    color: n.color, padding: "4px 10px", borderRadius: 99,
                    fontSize: "0.7rem", fontFamily: "'DM Mono',monospace", fontWeight: 700
                  }}>
                    {n.urgency}% urgent
                  </div>
                </div>
                <UrgencyBar value={n.urgency} color={n.color} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: "0.75rem", color: "#64748b" }}>
                  <span>👤 {n.volunteers}/{n.needed} volunteers</span>
                  <span style={{ color: n.volunteers < n.needed * 0.5 ? "#ef4444" : "#a3e635" }}>
                    {n.needed - n.volunteers} more needed
                  </span>
                </div>
                {selectedNeed?.id === n.id && (
                  <button onClick={e => { e.stopPropagation(); setActiveTab("matching"); setMatchAnim(true); setTimeout(() => setMatchAnim(false), 600); }}
                    style={{
                      marginTop: 14, width: "100%", background: `linear-gradient(135deg,${n.color}33,${n.color}11)`,
                      border: `1px solid ${n.color}66`, color: n.color,
                      padding: "9px 0", borderRadius: 8, cursor: "pointer",
                      fontSize: "0.82rem", fontWeight: 600, transition: "all 0.2s"
                    }}>
                    ⚡ Find Volunteers for This →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VOLUNTEERS TAB */}
        {activeTab === "volunteers" && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {VOLUNTEERS.map((v, i) => (
                <div key={v.id} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: 20, animation: `slideIn 0.4s ease ${i * 0.08}s both`,
                  transition: "all 0.3s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)"; e.currentTarget.style.background = "rgba(34,211,238,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: `linear-gradient(135deg,${v.available ? "#22d3ee" : "#475569"},${v.available ? "#6366f1" : "#334155"})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.1rem", fontWeight: 700, color: "#fff",
                      fontFamily: "'Syne',sans-serif"
                    }}>{v.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{v.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: v.available ? "#a3e635" : "#64748b", animation: v.available ? "pulse 2s infinite" : "none" }} />
                        <span style={{ fontSize: "0.7rem", color: v.available ? "#a3e635" : "#64748b", fontFamily: "'DM Mono',monospace" }}>
                          {v.available ? "Available" : "Engaged"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {v.skills.map(s => (
                      <span key={s} style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22d3ee", padding: "3px 9px", borderRadius: 99, fontSize: "0.68rem", fontFamily: "'DM Mono',monospace" }}>{s}</span>
                    ))}
                  </div>
                  {v.matched && (
                    <div style={{ fontSize: "0.75rem", color: "#64748b", padding: "8px 10px", background: "rgba(163,230,53,0.06)", borderRadius: 8, border: "1px solid rgba(163,230,53,0.12)" }}>
                      📍 Assigned → <span style={{ color: "#a3e635" }}>{v.matched}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATCHING TAB */}
        {activeTab === "matching" && (
          <div style={{ animation: matchAnim ? "matchPulse 0.6s ease" : "fadeUp 0.5s ease" }}>
            <div style={{
              background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.15)",
              borderRadius: 20, padding: 28, marginBottom: 24, textAlign: "center"
            }}>
              <div style={{ fontSize: "0.75rem", color: "#22d3ee", fontFamily: "'DM Mono',monospace", letterSpacing: 3, marginBottom: 10, textTransform: "uppercase" }}>
                ⚡ AI Matching Engine Active
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
                Scoring volunteers by: skill match · proximity · availability · past performance
              </p>
            </div>

            {NEEDS.slice(0, 4).map((n, ni) => {
              const matched = VOLUNTEERS.filter(v => v.available && v.matched === n.area);
              return (
                <div key={n.id} style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center",
                  marginBottom: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, padding: 20, animation: `slideIn 0.4s ease ${ni * 0.1}s both`
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{n.icon} {n.category}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "'DM Mono',monospace" }}>{n.area}</div>
                    <div style={{ fontSize: "0.72rem", color: n.color, marginTop: 4 }}>Urgency {n.urgency}%</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#22d3ee,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", animation: "glow 3s infinite" }}>⚡</div>
                    <div style={{ fontSize: "0.6rem", color: "#22d3ee", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>MATCHED</div>
                  </div>
                  <div>
                    {matched.length > 0 ? matched.map(v => (
                      <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#22d3ee,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{v.name[0]}</div>
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{v.name}</div>
                          <div style={{ fontSize: "0.65rem", color: "#64748b" }}>{v.skills.join(" · ")}</div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ color: "#ef4444", fontSize: "0.8rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 12px" }}>
                        ⚠ No match found — posting to volunteer pool
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.7rem", color: "#a3e635", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>Process</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, marginBottom: 56 }}>
            From Survey to <span style={{ color: "#a3e635" }}>Action</span> in Minutes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 0 }}>
            {[
              { icon: "📋", step: "01", title: "NGO Data Input", desc: "Field reports & paper surveys digitized via mobile form", color: "#22d3ee" },
              { icon: "🧠", step: "02", title: "AI Aggregation", desc: "Scattered data consolidated, duplicates removed, prioritized", color: "#6366f1" },
              { icon: "🗺", step: "03", title: "Needs Mapping", desc: "Live urgency map generated for all community areas", color: "#f472b6" },
              { icon: "⚡", step: "04", title: "Auto Matching", desc: "Volunteers matched by skill, location & availability", color: "#a3e635" },
              { icon: "✅", step: "05", title: "Impact Tracked", desc: "Resolution confirmed, feedback loops NGO data quality", color: "#fb923c" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "24px 16px", position: "relative" }}>
                {i < 4 && <div style={{ position: "absolute", top: "30px", right: -2, width: "calc(50% - 30px)", height: 1, background: `linear-gradient(90deg,${s.color}44,transparent)`, zIndex: 1 }} />}
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}15`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", margin: "0 auto 14px" }}>{s.icon}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "0.65rem", color: s.color, letterSpacing: 2, marginBottom: 6 }}>STEP {s.step}</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{
          maxWidth: 640, margin: "0 auto",
          background: "linear-gradient(135deg,rgba(34,211,238,0.06),rgba(99,102,241,0.06))",
          border: "1px solid rgba(34,211,238,0.15)", borderRadius: 24, padding: "52px 40px"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🤝</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 800, marginBottom: 14 }}>
            Your NGO Can Make <span style={{ color: "#22d3ee" }}>Smarter Decisions</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: 32 }}>
            Join 62+ NGOs already using SevaLink to allocate resources where they matter most. Free for social impact organizations.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: "linear-gradient(135deg,#22d3ee,#6366f1)", border: "none", color: "#fff", padding: "13px 28px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              Register Your NGO →
            </button>
            <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", padding: "13px 28px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 }}>
              See Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "28px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem" }}>
          <span style={{ color: "#22d3ee" }}>Seva</span>Link
        </span>
        <span style={{ fontSize: "0.75rem", color: "#334155", fontFamily: "'DM Mono',monospace" }}>
          Smart Resource Allocation · Data-Driven Volunteer Coordination
        </span>
        <span style={{ fontSize: "0.75rem", color: "#334155" }}>© 2025 SevaLink</span>
      </footer>
    </div>
  );
}
