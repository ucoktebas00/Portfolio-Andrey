import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SECTIONS = ["home","about","resume","services","portfolio","testimonial","blog","contact"];

const SKILLS_LEFT  = [{ name:"HTML",pct:95},{name:"CSS",pct:80},{name:"PHP",pct:80},{name:"jQuery",pct:60}];
const SKILLS_RIGHT = [{ name:"Python",pct:85},{name:"JavaScript",pct:70},{name:"Microsoft Office",pct:95},{name:"Photoshop",pct:85}];

const EDUCATION = [
  { title:"Bachelor in Information Systems", period:"2020 – 2024", desc:"Graduated from STMK Triguna Dharma Medan with GPA 3.71 / 4.00." },
  { title:"Studied at Mikroskil University",  period:"2017 – 2020", desc:"Started at Universitas Mikroskil, then focused on professional experience before completing degree at STMK Triguna Dharma." },
];
const EXPERIENCE = [
  { title:"Administrative & Graphic Design",                          period:"Present",    desc:"Construction planning & consulting firm — graphic design, admin, site surveys." },
  { title:"Sales & Social Media Admin",                               period:"2023–2024",  desc:"Managed live-selling accounts, tracked payments and inventory for a shoe store." },
  { title:"Sysadmin & Cybersecurity Intern — Infinite Learning & IBM",period:"2022–2023",  desc:"Managed IT systems, AI concepts, ethical hacking at Infinite Learning." },
  { title:"Web Design / UI-UX Intern — PT. GLU",                      period:"2022–2023",  desc:"Responsive web layouts at a Medan startup, collaborating with dev & product teams." },
  { title:"Junior Web Developer — Freelance",                         period:"2019–2023",  desc:"Website projects for individual and small business clients." },
];
const SERVICES = [
  { icon:"🎨", title:"Graphic Design",      desc:"Creative visual solutions for branding, marketing materials, and digital assets." },
  { icon:"💼", title:"Portfolio of Works",  desc:"Curated showcase of completed projects demonstrating expertise across industries." },
  { icon:"📱", title:"Responsive Theme",    desc:"Fully adaptive websites delivering optimal experience across all devices." },
  { icon:"🌐", title:"Go Beyond Limits",    desc:"Innovative solutions pushing boundaries through cutting-edge technologies." },
];
const PORTFOLIO_ITEMS = [
  { id:1, img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", cat:"seo",                   label:"SEO Project"    },
  { id:2, img:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80", cat:"graphic",               label:"Graphic Design"  },
  { id:3, img:"https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80", cat:"webdesign graphic",     label:"Web & Graphic"   },
  { id:4, img:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80", cat:"webdesign",           label:"Web Design"      },
  { id:5, img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80", cat:"mobiledesign seo",    label:"Mobile & SEO"    },
  { id:6, img:"https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80", cat:"webdesign seo",       label:"Web SEO"         },
  { id:7, img:"https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&q=80", cat:"mobiledesign",         label:"Mobile Design"   },
  { id:8, img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", cat:"mobiledesign webdesign",label:"Mobile & Web"  },
  { id:9, img:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80", cat:"mobiledesign webdesign",label:"Web & Mobile"  },
];
const FILTERS = [
  { key:"*",            label:"All"          },
  { key:"webdesign",    label:"Web Design"   },
  { key:"mobiledesign", label:"Mobile Design"},
  { key:"seo",          label:"SEO"          },
  { key:"graphic",      label:"Graphic"      },
];
const TESTIMONIALS = [
  { name:"Rizky Pratama", role:"CEO, Startup Medan",   text:"Andrey delivered exceptional work. His attention to design details and coding quality exceeded our expectations completely." },
  { name:"Sari Dewi",     role:"Marketing Manager",    text:"Working with Andrey was a pleasure. He understood our brand vision and translated it into a stunning visual identity." },
  { name:"Budi Santoso",  role:"SEO Consultant",       text:"Highly professional and responsive. The website he built ranked well from launch and brought measurable business results." },
  { name:"Lina Hasibuan", role:"UX Designer",          text:"Andrey has a great eye for user experience. His UI work is clean, modern, and always user-friendly. Highly recommended." },
];
const BLOGS = [
  { title:"Be Your Best Version",      img:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80", desc:"Tips for continuous self-improvement and becoming the best version of yourself as a creative professional." },
  { title:"5 Tips In UI/UX Web Design",img:"https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&q=80", desc:"Essential UI/UX principles every web designer needs to master for creating delightful user experiences." },
  { title:"Write Your Dreams",          img:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80", desc:"How setting clear goals and writing them down can accelerate your career growth in tech and design." },
];

/* ─────────────────────────────────────────────
   BREAKPOINT HOOK
   sm < 480 | md < 768 | lg < 1024 | xl >= 1024
───────────────────────────────────────────── */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { w, isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024, isSm: w < 480 };
}

/* ─────────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────────── */
function useTypewriter(words, speed = 120, pause = 2200) {
  const [display, setDisplay]   = useState("");
  const [wordIdx, setWordIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(w => (w+1)%words.length); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

/* ─────────────────────────────────────────────
   INTERSECTION HOOK
───────────────────────────────────────────── */
function useIntersection(ref, threshold = 0.2) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ─────────────────────────────────────────────
   SKILL BAR
───────────────────────────────────────────── */
function SkillBar({ name, pct, visible }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:12, letterSpacing:1, textTransform:"uppercase", color:"#c8a96e" }}>{name}</span>
        <span style={{ fontSize:11, color:"#888", fontWeight:700 }}>{pct}%</span>
      </div>
      <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:2, height:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:visible?`${pct}%`:"0%", background:"linear-gradient(90deg,#c8a96e,#e8c98e)", borderRadius:2, transition:"width 1.4s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────── */
function Counter({ target, visible }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let s = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => { s += step; if (s >= target) { setVal(target); clearInterval(t); } else setVal(s); }, 30);
    return () => clearInterval(t);
  }, [visible, target]);
  return <>{val}+</>;
}

/* ─────────────────────────────────────────────
   PORTFOLIO MODAL
───────────────────────────────────────────── */
function PortfolioModal({ item, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#111",border:"1px solid rgba(200,169,110,.2)",borderRadius:12,maxWidth:680,width:"100%",overflow:"hidden",animation:"modalIn .3s ease",position:"relative",maxHeight:"90vh",overflowY:"auto" }}>
        <img src={item.img} alt={item.label} style={{ width:"100%",display:"block",maxHeight:360,objectFit:"cover" }} />
        <div style={{ padding:"20px 24px" }}>
          <h3 style={{ color:"#c8a96e",fontFamily:"'Playfair Display',serif",marginBottom:8,fontSize:"clamp(16px,3vw,20px)" }}>{item.label}</h3>
          <p style={{ color:"#888",fontSize:14,lineHeight:1.7,margin:0 }}>A professional project showcasing expertise in {item.cat.replace(/\s+/g,", ")}. Crafted with attention to detail and modern design principles.</p>
          <div style={{ display:"flex",gap:10,marginTop:16,flexWrap:"wrap" }}>
            <span style={{ background:"rgba(200,169,110,.12)",color:"#c8a96e",padding:"4px 12px",borderRadius:20,fontSize:12,border:"1px solid rgba(200,169,110,.3)" }}>By: Andrey</span>
            <span style={{ background:"rgba(200,169,110,.12)",color:"#c8a96e",padding:"4px 12px",borderRadius:20,fontSize:12,border:"1px solid rgba(200,169,110,.3)" }}>HTML5 / CSS3 / PHP</span>
          </div>
        </div>
        <button onClick={onClose} style={{ position:"absolute",top:12,right:12,background:"rgba(0,0,0,.65)",border:"none",color:"#fff",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BLOG MODAL
───────────────────────────────────────────── */
function BlogModal({ post, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#111",border:"1px solid rgba(200,169,110,.2)",borderRadius:12,maxWidth:620,width:"100%",overflow:"hidden",animation:"modalIn .3s ease",position:"relative",maxHeight:"90vh",overflowY:"auto" }}>
        <img src={post.img} alt={post.title} style={{ width:"100%",display:"block",maxHeight:260,objectFit:"cover" }} />
        <div style={{ padding:"22px 24px" }}>
          <p style={{ color:"#c8a96e",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>By Andrey</p>
          <h3 style={{ color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:"clamp(16px,3vw,20px)",marginBottom:12 }}>{post.title}</h3>
          <p style={{ color:"#999",lineHeight:1.8,fontSize:14,marginBottom:12 }}>{post.desc}</p>
          <p style={{ color:"#888",lineHeight:1.8,fontSize:13 }}>In the world of design and development, continuous learning is the cornerstone of growth. Every project teaches something new — from client communication to technical problem-solving.</p>
        </div>
        <button onClick={onClose} style={{ position:"absolute",top:12,right:12,background:"rgba(0,0,0,.65)",border:"none",color:"#fff",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const { isMobile, isTablet, isDesktop, isSm } = useBreakpoint();
  const [currentSection, setCurrentSection] = useState(0);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [darkMode,        setDarkMode]        = useState(true);
  const [activeFilter,    setActiveFilter]    = useState("*");
  const [testimonialIdx,  setTestimonialIdx]  = useState(0);
  const [portfolioModal,  setPortfolioModal]  = useState(null);
  const [blogModal,       setBlogModal]       = useState(null);
  const [sending,         setSending]         = useState(false);
  const [msgStatus,       setMsgStatus]       = useState(null);
  const [form,            setForm]            = useState({ name:"", email:"", comments:"" });
  const [isScrolling,     setIsScrolling]     = useState(false);

  const containerRef = useRef(null);
  const aboutRef     = useRef(null);
  const resumeRef    = useRef(null);
  const aboutVisible  = useIntersection(aboutRef);
  const resumeVisible = useIntersection(resumeRef);
  const typed = useTypewriter(["UI Designer.","Web Designer.","Web Developer."]);

  /* ── PAGE PILING ── */
  const scrollToSection = useCallback((idx) => {
    if (isScrolling) return;
    const bounded = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    setCurrentSection(bounded);
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 900);
  }, [isScrolling]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling) return;
      if (e.deltaY > 40)       scrollToSection(currentSection + 1);
      else if (e.deltaY < -40) scrollToSection(currentSection - 1);
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [currentSection, scrollToSection, isScrolling]);

  /* keyboard nav */
  useEffect(() => {
    const h = (e) => {
      if (menuOpen) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") scrollToSection(currentSection + 1);
      if (e.key === "ArrowUp"   || e.key === "PageUp")   scrollToSection(currentSection - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [currentSection, scrollToSection, menuOpen]);

  /* touch swipe */
  const touchStartY = useRef(null);
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd   = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) scrollToSection(currentSection + (diff > 0 ? 1 : -1));
    touchStartY.current = null;
  };

  /* testimonial auto-rotate */
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* close menu on resize to desktop */
  useEffect(() => { if (isDesktop) setMenuOpen(false); }, [isDesktop]);

  const filtered = PORTFOLIO_ITEMS.filter(p => activeFilter === "*" ? true : p.cat.includes(activeFilter));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.comments) { setMsgStatus({ ok:false, text:"Semua field harus diisi!" }); return; }
    setSending(true);
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ service_id:"service_wzvlg6u", template_id:"template_cet5bxp", user_id:"RStndPUO0m7CSmmFp", template_params:{ name:form.name, email:form.email, comments:form.comments } }),
      });
      if (res.ok) { setMsgStatus({ ok:true, text:"Pesan berhasil dikirim! 🎉" }); setForm({ name:"", email:"", comments:"" }); }
      else setMsgStatus({ ok:false, text:"Gagal mengirim. Coba lagi." });
    } catch { setMsgStatus({ ok:false, text:"Gagal mengirim. Cek koneksi internet." }); }
    setSending(false);
    setTimeout(() => setMsgStatus(null), 4000);
  };

  /* ── THEME ── */
  const bg         = darkMode ? "#0a0a0a" : "#f8f5f0";
  const fg         = darkMode ? "#e8e8e8" : "#1a1a1a";
  const cardBg     = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const borderClr  = darkMode ? "rgba(200,169,110,0.15)" : "rgba(200,169,110,0.3)";
  const inputBg    = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  /* ── RESPONSIVE VALUES ── */
  const px          = isSm ? 16 : isMobile ? 20 : isTablet ? 32 : 60;   // horizontal padding
  const sectionPadT = isMobile ? 72 : 80;                                // top padding (below header)
  const gridCols2   = isMobile ? "1fr" : "1fr 1fr";                      // 2-col grids
  const gridCols3   = isSm ? "1fr" : isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr" : "repeat(3,1fr)";
  const portfolioCols = isSm ? "1fr" : isMobile ? "1fr 1fr" : "repeat(3,1fr)";
  const heroGap     = isMobile ? 32 : 60;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background:bg, color:fg, fontFamily:"'DM Sans',sans-serif", height:"100dvh", overflow:"hidden", position:"relative", transition:"background .4s,color .4s" }}
    >
      {/* ════════════ GLOBAL STYLES ════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{-webkit-text-size-adjust:100%;}
        ::-webkit-scrollbar{display:none;}
        body{overflow:hidden;}

        @keyframes fadeUp  {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes modalIn {from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse   {0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes spin    {to{transform:rotate(360deg)}}

        .section-wrapper{
          position:absolute;inset:0;opacity:0;pointer-events:none;
          transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1);
          transform:translateY(36px);
          overflow-y:auto;-webkit-overflow-scrolling:touch;
        }
        .section-wrapper.active{opacity:1;pointer-events:all;transform:translateY(0);}

        .pill-btn{
          background:linear-gradient(135deg,#c8a96e,#e8c98e);color:#000;border:none;
          padding:11px 24px;border-radius:40px;
          font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;letter-spacing:.7px;
          cursor:pointer;transition:transform .2s,box-shadow .2s;white-space:nowrap;
        }
        .pill-btn:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(200,169,110,.35);}
        .pill-btn:active{transform:translateY(0);}

        .ghost-btn{
          background:transparent;color:#c8a96e;border:1px solid rgba(200,169,110,.5);
          padding:10px 22px;border-radius:40px;
          font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:13px;letter-spacing:.7px;
          cursor:pointer;transition:all .2s;white-space:nowrap;
        }
        .ghost-btn:hover{background:rgba(200,169,110,.1);}

        .nav-dot{width:7px;height:7px;border-radius:50%;border:1.5px solid rgba(200,169,110,.45);cursor:pointer;transition:all .3s;}
        .nav-dot.active{background:#c8a96e;border-color:#c8a96e;transform:scale(1.45);}

        .filter-btn{
          padding:7px 16px;border-radius:30px;border:1px solid rgba(200,169,110,.22);
          background:transparent;color:#999;font-family:'Space Grotesk',sans-serif;
          font-size:11px;font-weight:500;letter-spacing:.5px;cursor:pointer;transition:all .22s;
        }
        .filter-btn.active{background:rgba(200,169,110,.14);color:#c8a96e;border-color:rgba(200,169,110,.48);}
        .filter-btn:hover{color:#c8a96e;border-color:rgba(200,169,110,.38);}

        .portfolio-card{overflow:hidden;border-radius:10px;position:relative;cursor:pointer;aspect-ratio:4/3;}
        .portfolio-card img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.4,0,.2,1);display:block;}
        .portfolio-card:hover img{transform:scale(1.07);}
        .portfolio-overlay{position:absolute;inset:0;background:rgba(0,0,0,.68);opacity:0;transition:opacity .28s;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;}
        .portfolio-card:hover .portfolio-overlay{opacity:1;}
        /* Show overlay on touch devices always on focus */
        @media(hover:none){.portfolio-overlay{opacity:0;}.portfolio-card:active .portfolio-overlay{opacity:1;}}

        .timeline-item{padding-left:18px;border-left:1px solid rgba(200,169,110,.2);padding-bottom:20px;position:relative;}
        .timeline-item::before{content:'';position:absolute;left:-5px;top:5px;width:8px;height:8px;border-radius:50%;background:#c8a96e;}

        .input-field{
          width:100%;padding:12px 15px;background:transparent;
          border:1px solid rgba(200,169,110,.18);border-radius:8px;color:inherit;
          font-family:inherit;font-size:14px;outline:none;transition:border-color .2s;
        }
        .input-field:focus{border-color:rgba(200,169,110,.5);}
        input::placeholder,textarea::placeholder{color:#555;}
        textarea.input-field{resize:vertical;min-height:90px;}

        .social-icon{
          width:38px;height:38px;border-radius:50%;border:1px solid rgba(200,169,110,.25);
          display:flex;align-items:center;justify-content:center;text-decoration:none;
          color:#c8a96e;font-size:11px;font-weight:700;transition:all .22s;
        }
        .social-icon:hover{background:rgba(200,169,110,.14);transform:translateY(-2px);}

        /* ── Mobile-only scroll override for section content ── */
        @media(max-width:767px){
          .section-inner{
            padding-bottom:80px !important;
          }
        }
      `}</style>

      {/* ════════════ HEADER ════════════ */}
      <header style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,
        padding:`16px ${px}px`,
        display:"flex",justifyContent:"space-between",alignItems:"center",
        background: menuOpen ? "transparent" : (darkMode?"rgba(10,10,10,.8)":"rgba(248,245,240,.85)"),
        backdropFilter:"blur(12px)",
        transition:"background .3s",
      }}>
        <a href="#" style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, color:fg, textDecoration:"none", fontWeight:700 }}>
          R<span style={{ color:"#c8a96e" }}>EY.</span>
        </a>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {/* Dark mode toggle — hidden on very small screens to save space */}
          {!isSm && (
            <button onClick={()=>setDarkMode(d=>!d)} style={{
              background:"none",border:"1px solid rgba(200,169,110,.3)",color:"#c8a96e",
              width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:15,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            }}>
              {darkMode?"☀️":"🌙"}
            </button>
          )}
          <button onClick={()=>setMenuOpen(m=>!m)} style={{
            background:"none",border:"1px solid rgba(200,169,110,.3)",color:"#c8a96e",
            width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:17,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            {menuOpen?"✕":"☰"}
          </button>
        </div>
      </header>

      {/* ════════════ OVERLAY MENU ════════════ */}
      {menuOpen && (
        <div style={{
          position:"fixed",inset:0,
          background:darkMode?"rgba(10,10,10,.97)":"rgba(248,245,240,.97)",
          zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",
          backdropFilter:"blur(16px)",animation:"fadeIn .25s ease",
          padding:"60px 20px 40px",overflowY:"auto",
        }}>
          <div style={{ textAlign:"center",width:"100%",maxWidth:420 }}>
            {isSm && (
              <div style={{ display:"flex",justifyContent:"center",gap:10,marginBottom:20 }}>
                <button onClick={()=>setDarkMode(d=>!d)} style={{ background:"none",border:"1px solid rgba(200,169,110,.3)",color:"#c8a96e",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {darkMode?"☀️":"🌙"}
                </button>
              </div>
            )}
            <div style={{ display:"flex",flexDirection:"column",gap:4,marginBottom:36 }}>
              {SECTIONS.map((s,i) => (
                <button key={s} onClick={()=>{ scrollToSection(i); setMenuOpen(false); }} style={{
                  background:"none",border:"none",
                  fontFamily:"'Playfair Display',serif",
                  fontSize: currentSection===i ? (isMobile?28:34) : (isMobile?22:28),
                  color: currentSection===i ? "#c8a96e" : fg,
                  cursor:"pointer",padding:"5px 0",transition:"all .2s",
                  textTransform:"capitalize",letterSpacing:.5,
                }}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
              {[["📍","Medan, ID"],["📞","+62 812-11xxxx"]].map(([icon,v])=>(
                <span key={v} style={{ color:"#666",fontSize:12 }}>{icon} {v}</span>
              ))}
            </div>
            <div style={{ display:"flex",gap:12,justifyContent:"center",marginTop:18 }}>
              {[["IG","https://www.instagram.com/andreyulius8"],["GH","https://github.com/ucoktebas00"],["IN","https://www.linkedin.com/in/andreysinambela"]].map(([l,h])=>(
                <a key={l} href={h} target="_blank" rel="noreferrer" className="social-icon">{l}</a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════ RIGHT NAV DOTS (desktop only) ════════════ */}
      {!isMobile && (
        <div style={{ position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",zIndex:800,display:"flex",flexDirection:"column",gap:12,alignItems:"center" }}>
          {SECTIONS.map((s,i)=>(
            <div key={s} className={`nav-dot${currentSection===i?" active":""}`} onClick={()=>scrollToSection(i)} title={s.charAt(0).toUpperCase()+s.slice(1)} />
          ))}
        </div>
      )}

      {/* ════════════ BOTTOM NAV DOTS (mobile) ════════════ */}
      {isMobile && (
        <div style={{ position:"fixed",bottom:14,left:"50%",transform:"translateX(-50%)",zIndex:800,display:"flex",gap:10,alignItems:"center" }}>
          {SECTIONS.map((s,i)=>(
            <div key={s} className={`nav-dot${currentSection===i?" active":""}`} onClick={()=>scrollToSection(i)} style={{ width:6,height:6 }} />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════
          S E C T I O N S
      ══════════════════════════════════════════ */}

      {/* ── HOME ── */}
      <div className={`section-wrapper${currentSection===0?" active":""}`}
        style={{ display:"flex",alignItems:"center",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?60:40}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%",
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap:heroGap,alignItems:"center" }}>

          {/* Text */}
          <div style={{ animation:currentSection===0?"fadeUp .8s ease":"none", textAlign:isMobile?"center":"left" }}>
            <p style={{ color:"#c8a96e",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:14 }}>
              Welcome to my portfolio
            </p>
            <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:`clamp(${isMobile?"36px":"42px"},${isMobile?"8vw":"5vw"},68px)`,lineHeight:1.1,marginBottom:14,color:fg }}>
              I'm <span style={{ color:"#c8a96e" }}>Andrey</span>
            </h1>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:`clamp(14px,${isMobile?"4vw":"2vw"},22px)`,color:"#888",marginBottom:16,fontWeight:400 }}>
              A <span style={{ color:"#c8a96e",borderRight:"2px solid #c8a96e",paddingRight:2 }}>{typed}</span>
            </h3>
            <p style={{ color:"#777",lineHeight:1.8,fontSize:14,maxWidth:420,marginBottom:28,
              marginLeft:isMobile?"auto":"0",marginRight:isMobile?"auto":"0" }}>
              Crafting digital experiences through clean code and thoughtful design. Available for freelance projects in Medan, Indonesia.
            </p>
            <div style={{ display:"flex",gap:12,flexWrap:"wrap",justifyContent:isMobile?"center":"flex-start" }}>
              <button className="pill-btn" onClick={()=>scrollToSection(2)}>View Resume</button>
              <button className="ghost-btn" onClick={()=>scrollToSection(7)}>Get in Touch</button>
            </div>
            <div style={{ display:"flex",gap:10,marginTop:24,justifyContent:isMobile?"center":"flex-start" }}>
              {[["IG","https://www.instagram.com/andreyulius8"],["GH","https://github.com/ucoktebas00"],["IN","https://www.linkedin.com/in/andreysinambela"]].map(([l,h])=>(
                <a key={l} href={h} target="_blank" rel="noreferrer" className="social-icon">{l}</a>
              ))}
            </div>
          </div>

          {/* Avatar — hidden on very small screens */}
          {!isSm && (
            <div style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
              <div style={{ width:isMobile?220:isTablet?260:300,height:isMobile?220:isTablet?260:300,borderRadius:"50%",border:"1px solid rgba(200,169,110,.2)",position:"relative",animation:"float 6s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <div style={{ width:"88%",height:"88%",borderRadius:"50%",background:"linear-gradient(135deg,rgba(200,169,110,.15),rgba(200,169,110,.03))",border:"1px solid rgba(200,169,110,.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:isMobile?52:68,lineHeight:1 }}>👨‍💻</div>
                    <p style={{ color:"#c8a96e",fontSize:11,marginTop:8,letterSpacing:2,textTransform:"uppercase" }}>Andrey Julius</p>
                  </div>
                </div>
                {[["IG",0],["GH",90],["YT",180],["TG",270]].map(([icon,deg])=>{
                  const r = isMobile ? 108 : isTablet ? 128 : 148;
                  return (
                    <div key={icon} style={{
                      position:"absolute",width:32,height:32,borderRadius:"50%",
                      background:"rgba(200,169,110,.14)",border:"1px solid rgba(200,169,110,.3)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:9,fontWeight:700,color:"#c8a96e",
                      top:`calc(50% - 16px + ${-r*Math.sin(deg*Math.PI/180)}px)`,
                      left:`calc(50% - 16px + ${r*Math.cos(deg*Math.PI/180)}px)`,
                      animation:`pulse 2s ease-in-out infinite ${deg*.01}s`,
                    }}>{icon}</div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div className={`section-wrapper${currentSection===1?" active":""}`} ref={aboutRef}
        style={{ display:"flex",alignItems:isMobile?"flex-start":"center",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:40}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>About me</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:24 }}>
            Hello, I'm <span style={{ color:"#c8a96e" }}>Andrey</span>
          </h2>
          <div style={{ display:"grid",gridTemplateColumns:gridCols2,gap:isMobile?28:48,alignItems:"start" }}>
            {/* Info */}
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:0 }}>
                {[["Birthday","July 1999"],["Degree","Sistem Informasi"],["Age","25"],["Freelance","✅ Available"],["Location","Medan, ID"],["Mail","andrey@gmail.com"]].map(([k,v])=>(
                  <div key={k} style={{ padding:"9px 0",borderBottom:`1px solid ${borderClr}` }}>
                    <span style={{ color:"#666",fontSize:11 }}>{k}</span>
                    <p style={{ color:fg,fontWeight:500,fontSize:13,marginTop:2 }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:10,marginTop:20,flexWrap:"wrap" }}>
                <button className="pill-btn" style={{ fontSize:12,padding:"9px 18px" }}>Download CV</button>
                <button className="ghost-btn" onClick={()=>scrollToSection(7)} style={{ fontSize:12,padding:"9px 18px" }}>Contact Me</button>
              </div>
            </div>

            {/* Counters */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              {[["2+","Files Download","📁"],["25+","Projects Done","🎯"],["20+","Awards","🏆"],["27+","Happy Clients","😊"]].map(([num,label,icon])=>(
                <div key={label} style={{ textAlign:"center",background:cardBg,border:`1px solid ${borderClr}`,borderRadius:12,padding:isMobile?"16px 10px":"22px 14px" }}>
                  <div style={{ fontSize:isMobile?22:26,marginBottom:4 }}>{icon}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:isMobile?24:30,color:"#c8a96e",fontWeight:700 }}>
                    {label==="Files Download" ? (aboutVisible?"2+":"0") : <Counter target={parseInt(num)} visible={aboutVisible} />}
                  </div>
                  <p style={{ fontSize:10,color:"#666",marginTop:4,textTransform:"uppercase",letterSpacing:.8 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RESUME ── */}
      <div className={`section-wrapper${currentSection===2?" active":""}`} ref={resumeRef}
        style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:20}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>Resume</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:20 }}>
            My <span style={{ color:"#c8a96e" }}>Experience</span>
          </h2>
          <div style={{ display:"grid",gridTemplateColumns:gridCols2,gap:isMobile?24:40 }}>
            <div>
              <h4 style={{ color:"#c8a96e",marginBottom:16,fontFamily:"'Space Grotesk',sans-serif",fontSize:12,letterSpacing:2,textTransform:"uppercase" }}>🎓 Education</h4>
              {EDUCATION.map((e,i)=>(
                <div key={i} className="timeline-item">
                  <h5 style={{ color:fg,fontSize:13,fontWeight:600,marginBottom:2 }}>{e.title}</h5>
                  <p style={{ color:"#c8a96e",fontSize:11,marginBottom:5 }}>{e.period}</p>
                  <p style={{ color:"#777",fontSize:12,lineHeight:1.6 }}>{e.desc}</p>
                </div>
              ))}
              <h4 style={{ color:"#c8a96e",margin:"18px 0 14px",fontFamily:"'Space Grotesk',sans-serif",fontSize:12,letterSpacing:2,textTransform:"uppercase" }}>⚡ Skills</h4>
              {SKILLS_LEFT.map(s=><SkillBar key={s.name} {...s} visible={resumeVisible} />)}
            </div>
            <div>
              <h4 style={{ color:"#c8a96e",marginBottom:16,fontFamily:"'Space Grotesk',sans-serif",fontSize:12,letterSpacing:2,textTransform:"uppercase" }}>💼 Experience</h4>
              {EXPERIENCE.map((e,i)=>(
                <div key={i} className="timeline-item">
                  <h5 style={{ color:fg,fontSize:12,fontWeight:600,marginBottom:2 }}>{e.title}</h5>
                  <p style={{ color:"#c8a96e",fontSize:11,marginBottom:4 }}>{e.period}</p>
                  <p style={{ color:"#777",fontSize:12,lineHeight:1.5 }}>{e.desc}</p>
                </div>
              ))}
              <h4 style={{ color:"#c8a96e",margin:"18px 0 14px",fontFamily:"'Space Grotesk',sans-serif",fontSize:12,letterSpacing:2,textTransform:"uppercase" }}>🛠 Tools</h4>
              {SKILLS_RIGHT.map(s=><SkillBar key={s.name} {...s} visible={resumeVisible} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div className={`section-wrapper${currentSection===3?" active":""}`}
        style={{ display:"flex",alignItems:isMobile?"flex-start":"center",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:40}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>What I offer</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:6 }}>
            My <span style={{ color:"#c8a96e" }}>Services</span>
          </h2>
          <p style={{ color:"#666",marginBottom:28,fontSize:13 }}>Services I offer to my clients</p>
          <div style={{ display:"grid",gridTemplateColumns:gridCols2,gap:isMobile?14:18 }}>
            {SERVICES.map((s,i)=>(
              <div key={i}
                style={{ background:cardBg,border:`1px solid ${borderClr}`,borderRadius:12,padding:isMobile?"20px 18px":"26px 22px",transition:"all .3s",cursor:"default" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(200,169,110,.5)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=borderClr; e.currentTarget.style.transform="none"; }}
              >
                <div style={{ fontSize:isMobile?26:30,marginBottom:12 }}>{s.icon}</div>
                <h4 style={{ fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,marginBottom:8,color:fg,fontSize:isMobile?14:15 }}>{s.title}</h4>
                <p style={{ color:"#777",fontSize:13,lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PORTFOLIO ── */}
      <div className={`section-wrapper${currentSection===4?" active":""}`}
        style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:20}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>Portfolio</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:16 }}>
            Creative <span style={{ color:"#c8a96e" }}>Works</span>
          </h2>
          {/* Filters — horizontal scroll on mobile */}
          <div style={{ display:"flex",gap:8,marginBottom:20,flexWrap:isMobile?"nowrap":"wrap",overflowX:isMobile?"auto":"visible",paddingBottom:isMobile?6:0,WebkitOverflowScrolling:"touch" }}>
            {FILTERS.map(f=>(
              <button key={f.key} className={`filter-btn${activeFilter===f.key?" active":""}`}
                onClick={()=>setActiveFilter(f.key)} style={{ flexShrink:0 }}>{f.label}</button>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:portfolioCols,gap:isMobile?10:14 }}>
            {filtered.map(item=>(
              <div key={item.id} className="portfolio-card" onClick={()=>setPortfolioModal(item)}>
                <img src={item.img} alt={item.label} loading="lazy" />
                <div className="portfolio-overlay">
                  <span style={{ color:"#fff",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:13 }}>{item.label}</span>
                  <span style={{ color:"#c8a96e",fontSize:11 }}>Tap to view</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIAL ── */}
      <div className={`section-wrapper${currentSection===5?" active":""}`}
        style={{ display:"flex",alignItems:"center",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:40}px` }}>
        <div className="section-inner" style={{ maxWidth:820,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>Testimonials</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:28 }}>
            What Clients <span style={{ color:"#c8a96e" }}>Say</span>
          </h2>
          <div style={{ background:cardBg,border:`1px solid ${borderClr}`,borderRadius:14,padding:isMobile?"20px 18px":"28px 28px",minHeight:isMobile?180:200 }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{ display:i===testimonialIdx?"block":"none",animation:"fadeUp .5s ease" }}>
                <p style={{ fontSize:28,color:"#c8a96e",fontFamily:"'Playfair Display',serif",lineHeight:1 }}>"</p>
                <p style={{ color:"#999",fontSize:isMobile?14:16,lineHeight:1.8,marginBottom:20,fontStyle:"italic" }}>{t.text}</p>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#c8a96e,#8b6914)",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:700,fontSize:15,flexShrink:0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight:600,color:fg,fontFamily:"'Space Grotesk',sans-serif",fontSize:14 }}>{t.name}</p>
                    <p style={{ color:"#c8a96e",fontSize:12 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Controls */}
          <div style={{ display:"flex",gap:8,marginTop:20,alignItems:"center" }}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setTestimonialIdx(i)} style={{
                width:i===testimonialIdx?24:7,height:7,borderRadius:10,
                background:i===testimonialIdx?"#c8a96e":"rgba(200,169,110,.25)",
                border:"none",cursor:"pointer",transition:"all .3s",
              }} />
            ))}
            <div style={{ marginLeft:"auto",display:"flex",gap:8 }}>
              <button onClick={()=>setTestimonialIdx(i=>(i-1+TESTIMONIALS.length)%TESTIMONIALS.length)}
                style={{ width:34,height:34,borderRadius:"50%",border:"1px solid rgba(200,169,110,.3)",background:"none",color:"#c8a96e",cursor:"pointer",fontSize:14 }}>←</button>
              <button onClick={()=>setTestimonialIdx(i=>(i+1)%TESTIMONIALS.length)}
                style={{ width:34,height:34,borderRadius:"50%",border:"1px solid rgba(200,169,110,.3)",background:"none",color:"#c8a96e",cursor:"pointer",fontSize:14 }}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BLOG ── */}
      <div className={`section-wrapper${currentSection===6?" active":""}`}
        style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:40}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>Blog</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:6 }}>
            Latest <span style={{ color:"#c8a96e" }}>Posts</span>
          </h2>
          <p style={{ color:"#666",marginBottom:24,fontSize:13 }}>Check out my latest blog posts</p>
          <div style={{ display:"grid",gridTemplateColumns:gridCols3,gap:isMobile?16:20 }}>
            {BLOGS.map((b,i)=>(
              <div key={i}
                style={{ background:cardBg,border:`1px solid ${borderClr}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"transform .3s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="none"}
                onClick={()=>setBlogModal(b)}
              >
                <img src={b.img} alt={b.title} style={{ width:"100%",height:isMobile?160:180,objectFit:"cover",display:"block" }} />
                <div style={{ padding:isMobile?"14px 16px":"18px 20px" }}>
                  <p style={{ color:"#c8a96e",fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:5 }}>By Andrey</p>
                  <h4 style={{ fontFamily:"'Playfair Display',serif",color:fg,fontSize:isMobile?15:16,marginBottom:8,lineHeight:1.4 }}>{b.title}</h4>
                  <p style={{ color:"#777",fontSize:12,lineHeight:1.6,marginBottom:12 }}>{b.desc.slice(0,85)}...</p>
                  <span style={{ color:"#c8a96e",fontSize:12,fontWeight:600 }}>Read More →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div className={`section-wrapper${currentSection===7?" active":""}`}
        style={{ display:"flex",alignItems:"flex-start",justifyContent:"center",
          padding:`${sectionPadT}px ${px}px ${isMobile?80:40}px` }}>
        <div className="section-inner" style={{ maxWidth:1100,width:"100%" }}>
          <p style={{ color:"#c8a96e",letterSpacing:3,fontSize:11,textTransform:"uppercase",marginBottom:6 }}>Contact</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,40px)",marginBottom:28 }}>
            Get In <span style={{ color:"#c8a96e" }}>Touch</span>
          </h2>
          <div style={{ display:"grid",gridTemplateColumns:gridCols2,gap:isMobile?28:56,alignItems:"start" }}>
            {/* Info */}
            <div>
              <p style={{ color:"#888",fontSize:13,lineHeight:1.8,marginBottom:22 }}>
                Fresh web development graduate with solid foundation in HTML/CSS/JavaScript. Looking for opportunities to contribute while learning from experienced developers.
              </p>
              {[["📍","Address","Medan, North Sumatera"],["📞","Phone","+62 812-11xxxx"],["✉️","Email","andrey@gmail.com"]].map(([icon,k,v])=>(
                <div key={k} style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:16 }}>
                  <span style={{ fontSize:16,flexShrink:0 }}>{icon}</span>
                  <div>
                    <p style={{ color:"#666",fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:1 }}>{k}</p>
                    <p style={{ color:fg,fontWeight:500,fontSize:13 }}>{v}</p>
                  </div>
                </div>
              ))}
              {/* Map only on tablet/desktop to save mobile space */}
              {!isMobile && (
                <div style={{ marginTop:20 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254832.50533362923!2d98.5046763031866!3d3.642614145903311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131cc1c3eb2fd%3A0x23d431c8a6908262!2sMedan%2C%20Kota%20Medan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1753251885824!5m2!1sid!2sid"
                    width="100%" height="160" style={{ border:0,borderRadius:10,display:"block" }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Medan Map"
                  />
                </div>
              )}
              <div style={{ display:"flex",gap:10,marginTop:18 }}>
                {[["IG","https://www.instagram.com/andreyulius8"],["GH","https://github.com/ucoktebas00"],["IN","https://www.linkedin.com/in/andreysinambela"]].map(([l,h])=>(
                  <a key={l} href={h} target="_blank" rel="noreferrer" className="social-icon">{l}</a>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <h5 style={{ fontFamily:"'Space Grotesk',sans-serif",color:"#c8a96e",fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:4 }}>Send a Message</h5>
              <input  className="input-field" placeholder="Your Name *"    value={form.name}     onChange={e=>setForm(f=>({...f,name:e.target.value}))}     style={{ background:inputBg,color:fg }} />
              <input  className="input-field" type="email" placeholder="Your Email *"   value={form.email}    onChange={e=>setForm(f=>({...f,email:e.target.value}))}    style={{ background:inputBg,color:fg }} />
              <textarea className="input-field" placeholder="Your Message *" value={form.comments} onChange={e=>setForm(f=>({...f,comments:e.target.value}))} style={{ background:inputBg,color:fg }} />
              {msgStatus && (
                <div style={{ padding:"11px 14px",borderRadius:8,background:msgStatus.ok?"rgba(72,199,116,.14)":"rgba(255,99,99,.14)",border:`1px solid ${msgStatus.ok?"rgba(72,199,116,.3)":"rgba(255,99,99,.3)"}`,color:msgStatus.ok?"#48c774":"#ff6363",fontSize:13 }}>
                  {msgStatus.text}
                </div>
              )}
              <button type="submit" className="pill-btn" disabled={sending} style={{ alignSelf:"flex-start",opacity:sending?.7:1 }}>
                {sending?"Sending...":"Send Message"}
              </button>
              <p style={{ color:"#555",fontSize:11,lineHeight:1.6 }}>
                ⚠️ Batasi domain di dashboard EmailJS agar API Key aman.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ════════════ MODALS ════════════ */}
      {portfolioModal && <PortfolioModal item={portfolioModal} onClose={()=>setPortfolioModal(null)} />}
      {blogModal      && <BlogModal     post={blogModal}      onClose={()=>setBlogModal(null)}      />}

      {/* ════════════ SECTION INDICATOR (desktop) ════════════ */}
      {!isMobile && (
        <div style={{ position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",zIndex:700,display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ color:"#444",fontSize:11,fontFamily:"'Space Grotesk',sans-serif" }}>
            {String(currentSection+1).padStart(2,"0")} / {String(SECTIONS.length).padStart(2,"0")}
          </span>
          <div style={{ width:36,height:1,background:"rgba(200,169,110,.3)" }} />
          <span style={{ color:"#c8a96e",fontSize:11,fontFamily:"'Space Grotesk',sans-serif",textTransform:"capitalize" }}>
            {SECTIONS[currentSection]}
          </span>
        </div>
      )}

      {/* Scroll hint on home */}
      {currentSection===0 && !isMobile && (
        <div style={{ position:"fixed",bottom:56,left:"50%",transform:"translateX(-50%)",textAlign:"center",animation:"fadeIn 2s ease 1s both" }}>
          <div style={{ width:1,height:36,background:"linear-gradient(to bottom,transparent,#c8a96e)",margin:"0 auto 5px" }} />
          <p style={{ color:"#555",fontSize:9,letterSpacing:2,textTransform:"uppercase" }}>Scroll</p>
        </div>
      )}
    </div>
  );
}
