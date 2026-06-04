import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Matter from 'matter-js';
import {
  Zap,
  ArrowRight,
  Award,
  UserPlus,
  Search,
  Users,
  ShieldCheck,
  Briefcase,
  Wifi,
  Clock,
  QrCode,
  Download,
  Globe,
  Building2,
  GraduationCap,
  Sparkles
} from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

const TAGS = [
  { text: 'Mentor dəstəyi', style: { bg: 'var(--color-brand)', color: 'var(--color-ink)', border: 'none' } },
  { text: 'Sertifikat', style: { bg: 'var(--color-ink)', color: '#FFFFFF', border: 'none' } },
  { text: 'Remote iş', style: { bg: '#FFFFFF', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'Karyera', style: { bg: 'var(--color-brand)', color: 'var(--color-ink)', border: 'none' } },
  { text: 'Proqramlar', style: { bg: 'var(--color-ink)', color: '#FFFFFF', border: 'none' } },
  { text: 'Online', style: { bg: '#FFFFFF', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'Real tapşırıqlar', style: { bg: 'var(--color-ink)', color: '#FFFFFF', border: 'none' } },
  { text: 'Feedback', style: { bg: 'var(--color-brand)', color: 'var(--color-ink)', border: 'none' } },
  { text: 'Portfolio', style: { bg: '#FFFFFF', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'Bacarıq', style: { bg: 'var(--color-surface-muted)', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'İş imkanı', style: { bg: 'var(--color-ink)', color: '#FFFFFF', border: 'none' } },
  { text: 'Azərbaycan', style: { bg: 'var(--color-brand)', color: 'var(--color-ink)', border: 'none' } },
  { text: 'CV üçün təcrübə', style: { bg: '#FFFFFF', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'İnkişaf', style: { bg: 'var(--color-brand)', color: 'var(--color-ink)', border: 'none' } },
  { text: 'Workspace', style: { bg: 'var(--color-ink)', color: '#FFFFFF', border: 'none' } },
  { text: 'Task', style: { bg: '#FFFFFF', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'Layihə', style: { bg: 'var(--color-surface-muted)', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'Şirkətlərlə iş', style: { bg: 'var(--color-ink)', color: '#FFFFFF', border: 'none' } },
  { text: 'Pulsuz qeydiyyat', style: { bg: '#FFFFFF', color: 'var(--color-ink)', border: '2px solid var(--color-border-soft)' } },
  { text: 'Təcrübə', style: { bg: 'var(--color-brand)', color: 'var(--color-ink)', border: 'none' } },
]

interface PhysicsTagCloudProps {
  dark?: boolean
}

function resolveTagStyle(tag: typeof TAGS[number], dark: boolean) {
  if (!dark) return { bg: tag.style.bg, color: tag.style.color, border: tag.style.border }

  if (tag.style.bg === 'var(--color-ink)') {
    return { bg: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }
  }
  if (tag.style.bg === '#FFFFFF') {
    return { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }
  }
  if (tag.style.bg === 'var(--color-brand)') {
    return { bg: 'rgba(209,231,40,0.15)', color: 'var(--color-brand)', border: '1px solid rgba(209,231,40,0.3)' }
  }
  return { bg: tag.style.bg, color: tag.style.color, border: tag.style.border }
}

function PhysicsTagCloud({ dark = false }: PhysicsTagCloudProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const bodiesRef = useRef<Matter.Body[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!sceneRef.current) return

    const W = sceneRef.current.offsetWidth
    const H = 220

    const tagSizes: { w: number; h: number }[] = TAGS.map((tag) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: absolute; visibility: hidden; pointer-events: none;
        padding: 12px 28px; font-size: 18px; font-weight: 700;
        border-radius: 16px; white-space: nowrap;
      `
      el.textContent = tag.text
      document.body.appendChild(el)
      const size = { w: el.offsetWidth + 8, h: el.offsetHeight + 8 }
      document.body.removeChild(el)
      return size
    })

    const { Engine, Runner, Bodies, Body, World } = Matter
    const engine = Engine.create({ gravity: { y: 1.8 } })
    engineRef.current = engine

    const ground = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, render: { visible: false } })
    const wallL = Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true, render: { visible: false } })
    const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true, render: { visible: false } })

    const bodies = tagSizes.map((size, i) => {
      const x = Math.random() * (W - size.w) + size.w / 2
      const y = -30 - i * 15
      const body = Bodies.rectangle(x, y, size.w, size.h, {
        restitution: 0.6,
        friction: 0.05,
        frictionAir: 0.015,
        chamfer: { radius: 16 },
        label: `tag-${i}`,
      })
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3)
      return body
    })

    bodiesRef.current = bodies
    World.add(engine.world, [ground, wallL, wallR, ...bodies])

    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return
      const rect = sceneRef.current.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      bodiesRef.current.forEach((body) => {
        const dx = body.position.x - mx
        const dy = body.position.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 185

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 0.05
          Body.applyForce(body, body.position, {
            x: (dx / dist) * force,
            y: (dy / dist) * force,
          })
          Body.applyForce(body, body.position, {
            x: 0,
            y: -force * 0.4,
          })
          // Add spin on hit
          Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - 0.5) * 0.2)
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    const tagEls = TAGS.map((tag) => {
      const el = document.createElement('div')
      el.textContent = tag.text
      const { bg, color, border } = resolveTagStyle(tag, dark)
      el.style.cssText = `
        position: absolute; padding: 12px 28px; font-size: 18px; font-weight: 700;
        border-radius: 16px; white-space: nowrap; pointer-events: none; user-select: none;
        background-color: ${bg}; color: ${color};
        ${border ? `border: ${border};` : ''}
        box-shadow: 0 2px 8px rgba(0,0,0,0.08); transform-origin: center center; will-change: transform;
      `
      sceneRef.current!.appendChild(el)
      return el
    })

    const runner = Runner.create()
    Runner.run(runner, engine)

    const loop = () => {
      bodies.forEach((body, i) => {
        const el = tagEls[i]
        const { x, y } = body.position
        const angle = body.angle
        const w = tagSizes[i].w
        const h = tagSizes[i].h
        el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${angle}rad)`
      })
      animFrameRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      tagEls.forEach(el => el.remove())
      World.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [dark])

  return (
    <div
      ref={sceneRef}
      className="w-screen relative left-1/2 -translate-x-1/2"
      style={{ height: '220px', overflow: 'hidden', position: 'relative', cursor: 'crosshair' }}
    />
  )
}


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const bgVariant = 1 as number;



  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-surface min-h-screen text-ink">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .anim-float { animation: float 5s ease-in-out infinite; }
        .anim-float2 { animation: float2 6s ease-in-out infinite 1s; }
        .anim-float3 { animation: float3 4s ease-in-out infinite 0.5s; }
      `}</style>

      {/* SECTION 1 — Hero */}
      <section
        className="pt-24 overflow-hidden flex flex-col items-center justify-center text-center  px-6 relative"
        style={
          bgVariant === 1 ? { background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(209,231,40,0.18) 0%, transparent 60%), var(--color-surface)' } :
          bgVariant === 3 ? { backgroundColor: 'var(--color-dark)' } :
          { backgroundColor: 'var(--color-surface)' }
        }
      >
        {/* Decorative Layers based on bgVariant */}
        {bgVariant === 1 && (
          <>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: '600px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(209,231,40,0.22) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(209,231,40,0.1) 0%, transparent 70%)' }} />
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(209,231,40,0.08) 0%, transparent 70%)' }} />
          </>
        )}

        {bgVariant === 2 && (
          <>
            {/* Large diagonal brand shape bottom-right */}
            <div className="absolute bottom-0 right-0 pointer-events-none" style={{
              width: '55%', height: '55%', background: 'var(--color-brand)', opacity: 0.12,
              clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }} />
            {/* Secondary diagonal dark shape */}
            <div className="absolute bottom-0 right-0 pointer-events-none" style={{
              width: '35%', height: '35%', background: 'var(--color-dark)', opacity: 0.06,
              clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }} />
            {/* Top-left soft glow */}
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(209,231,40,0.15) 0%, transparent 60%)', filter: 'blur(60px)',
            }} />
            {/* Horizontal line texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, var(--color-ink) 0px, var(--color-ink) 1px, transparent 1px, transparent 40px)',
            }} />
          </>
        )}

        {bgVariant === 3 && (
          <>
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />
            {/* Brand glow center */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
              width: '800px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(209,231,40,0.18) 0%, transparent 65%)', filter: 'blur(50px)',
            }} />
            {/* Bottom left glow */}
            <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(209,231,40,0.08) 0%, transparent 70%)', filter: 'blur(40px)',
            }} />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px',
            }} />
          </>
        )}

        {bgVariant === 4 && (
          <>
            {/* Aurora blob 1 — brand top-left */}
            <div className="absolute pointer-events-none" style={{
              top: '-10%', left: '-5%', width: '500px', height: '500px',
              background: 'radial-gradient(circle, rgba(209,231,40,0.25) 0%, transparent 60%)', filter: 'blur(80px)',
            }} />
            {/* Aurora blob 2 — dark top-right */}
            <div className="absolute pointer-events-none" style={{
              top: '-15%', right: '-10%', width: '450px', height: '450px',
              background: 'radial-gradient(circle, rgba(15,23,42,0.12) 0%, transparent 60%)', filter: 'blur(80px)',
            }} />
            {/* Aurora blob 3 — brand center-right */}
            <div className="absolute pointer-events-none" style={{
              top: '20%', right: '5%', width: '350px', height: '350px',
              background: 'radial-gradient(circle, rgba(209,231,40,0.15) 0%, transparent 60%)', filter: 'blur(60px)',
            }} />
            {/* Aurora blob 4 — soft warm bottom */}
            <div className="absolute pointer-events-none" style={{
              bottom: '-10%', left: '20%', width: '600px', height: '300px',
              background: 'radial-gradient(ellipse, rgba(209,231,40,0.1) 0%, transparent 60%)', filter: 'blur(70px)',
            }} />
            {/* Subtle dot grid on top */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
              backgroundImage: 'radial-gradient(circle, var(--color-ink) 1px, transparent 1px)', backgroundSize: '40px 40px',
            }} />
          </>
        )}

        <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bgVariant === 3 ? 'border-white/10 bg-white/5 text-white/60' : 'border-border-soft bg-white/60 text-text-muted'} text-xs font-medium mb-4 backdrop-blur-sm`}>
            <Zap size={12} className="text-brand" fill="currentColor" />
            <span>Azərbaycanda ilk online internship platformu</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }} className={`text-center mb-3 ${bgVariant === 3 ? 'text-white' : 'text-ink'}`}>
            <span className="block">Karyeranı</span>
            <span className="block">real təcrübə ilə qur.</span>
          </h1>

          {/* Subheadline */}
          <p className={`text-lg ${bgVariant === 3 ? 'text-white/50' : 'text-text-muted'} text-center max-w-lg mx-auto mb-6 leading-relaxed`}>
            Şirkətlərin real layihələrində işlə. Mentor rəhbərliyində inkişaf et. Sertifikatla fərqlən.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => navigate(ROUTES.AUTH.REGISTER)}
              className="px-8 py-4 rounded-2xl font-bold bg-dark text-white text-base hover:opacity-90 transition-opacity"
            >
              Pulsuz başla →
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`px-8 py-4 rounded-2xl font-semibold border-2 ${bgVariant === 3 ? 'border-white/20 text-white bg-white/5' : 'border-border-soft text-ink bg-white/50'} text-base hover:border-ink transition-colors backdrop-blur-sm`}
            >
              Necə işləyir?
            </button>
          </div>

          {/* Physics tags */}
          <div className="hidden md:block w-full mt-8">
            <PhysicsTagCloud dark={bgVariant === 3} />
          </div>

          {/* Mobile fallback */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 px-4 pt-8 pb-4">
            {TAGS.map(tag => (
              <span
                key={tag.text}
                style={{ backgroundColor: tag.style.bg, color: tag.style.color, border: tag.style.border }}
                className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-surface-muted">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand mb-3">NECƏ İŞLƏYİR</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 tracking-tight">Üç addımda başlayın</h2>
            <p className="text-sm text-text-muted">Qeydiyyatdan sertifikata qədər sadə bir yol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard num="01" icon={<UserPlus size={28} />} title="Qeydiyyat" desc="Hesab yarat, maraqlarını seç və profilini tamamla" />
            <StepCard num="02" icon={<Search size={28} />} title="Proqram seç" desc="Şirkətin proqramına müraciət et, sənədlərini göndər və qəbul ol" />
            <StepCard num="03" icon={<Award size={28} />} title="Sertifikat al" desc="Tapşırıqları tamamla, mentordan feedback al və sertifikatını qazan" />
          </div>
        </div>
      </section>

      {/* SECTION 3 — Why Taskilled */}
      <section id="about" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
            <FeatureCard icon={<Users size={22} />} title="Mentor dəstəyi" desc="Sahə mütəxəssisləri hər tapşırıqda yanınızda — sual ver, feedback al və inkişaf et" />
            <FeatureCard icon={<ShieldCheck size={22} />} title="Rəsmi sertifikat" desc="Unikal doğrulama kodlu sertifikat — işəgötürənlər tərəfindən asanlıqla yoxlanıla bilər" />
            <FeatureCard icon={<Briefcase size={22} />} title="Real layihələr" desc="Şirkətlərin həqiqi ehtiyaclarına əsaslanan tapşırıqlar — CV üçün real iş təcrübəsi" />
            <FeatureCard icon={<Wifi size={22} />} title="Tam remote" desc="İstənilən yerdən, yalnız internet bağlantısı ilə proqramlarda iştirak etmək imkanı" />
          </div>
        </div>
      </section>

      {/* SECTION 4 — Programs */}
      <section id="programs" className="py-24 px-6 bg-surface-muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <ProgramCard logo="T" company="TechAZ" title="UI/UX Design Internship" duration="Müddətli" price="Pulsuz" mentor={true} onAction={() => navigate(ROUTES.AUTH.REGISTER)} />
            <ProgramCard logo="C" company="CodeLab" title="Frontend Development" duration="Müddətli" price="Ödənişli" mentor={true} onAction={() => navigate(ROUTES.AUTH.REGISTER)} />
            <ProgramCard logo="B" company="BrandCo" title="Digital Marketing" duration="Müddətli" price="Pulsuz" mentor={false} onAction={() => navigate(ROUTES.AUTH.REGISTER)} />
          </div>
        </div>
      </section>

      {/* SECTION 5 — Certificate */}
      <section id="certificate" className="py-24 px-6 bg-surface">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl font-extrabold text-ink mb-6">
              Karyeranızı <br />
              <span className="text-brand">sübut edin.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center flex-shrink-0">
                  <QrCode size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Unikal doğrulama kodu</p>
                  <p className="text-xs text-text-muted">Hər sertifikatın özünəməxsus ID-si var</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center flex-shrink-0">
                  <Download size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">PDF formatında</p>
                  <p className="text-xs text-text-muted">Yüksək keyfiyyətli PDF kimi yükləyin</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="text-brand" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Online yoxlama</p>
                  <p className="text-xs text-text-muted">İşəgötürənlər istənilən vaxt yoxlaya bilər</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group cursor-pointer" style={{ perspective: '1000px' }} onClick={() => setFlipped(!flipped)}>
            <div className={`relative w-full h-[300px] transition-transform duration-700`} style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              {/* Front */}
              <div className="absolute inset-0 bg-white border-2 border-border-soft rounded-3xl p-8 overflow-hidden shadow-2xl backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-brand/20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-1">
                      <Zap size={16} className="text-brand" fill="currentColor" />
                      <span className="font-black tracking-widest text-ink text-xs">TASKILLED</span>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">✓ DOĞRULANDI</span>
                  </div>
                  <div className="border-t border-border-soft my-4" />
                  <h3 className="text-xl font-bold text-ink">Tamamlama Sertifikatı</h3>
                  <p className="text-base text-ink mt-1">Rahim Əliyev</p>
                  <p className="text-xs text-text-muted mt-4">Frontend Development Internship</p>
                  <div className="flex items-center justify-between mt-8">
                    <span className="font-mono text-[10px] text-text-muted">VERIFY-ID-AUTH</span>
                    <Award size={20} className="text-brand" />
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 bg-white border-2 border-brand rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="w-32 h-32 bg-brand/15 border-2 border-dashed border-brand rounded-xl flex items-center justify-center mb-4">
                  <QrCode size={48} className="text-brand" />
                </div>
                <p className="text-xs font-mono text-text-muted">taskilled.com/verify/ID</p>
                <p className="text-[10px] text-text-muted mt-4">Bu sertifikat rəsmi olaraq Taskilled tərəfindən verilmişdir.</p>
              </div>
            </div>
            <p className="text-xs text-center mt-4 text-text-muted">Çevirmək üçün klikləyin →</p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Partner & Mentor */}
      <section id="partners" className="py-24 px-6 bg-surface-muted">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mt-14">
          <PartnerCard
            icon={<Building2 size={26} />}
            title="Şirkətsiniz?"
            desc="İstedadları tapın və onlara real tapşırıqlar verərək potensial komanda üzvlərinizi seçin."
            points={["Proqram yarat", "İnternləri izlə", "İstedadları tap"]}
            btnText="Partner ol"
            onAction={() => navigate(ROUTES.AUTH.REGISTER)}
          />
          <PartnerCard
            icon={<GraduationCap size={26} />}
            title="Mütəxəssissiniz?"
            desc="Təcrübənizi paylaşın, gənclərə yol göstərin və peşəkar reputasiyanızı gücləndirin."
            points={["Cədvəlini qur", "Feedback ver", "Reputasiya qur"]}
            btnText="Mentor ol"
            onAction={() => navigate(ROUTES.AUTH.REGISTER)}
          />
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3"
             style={{ color: 'var(--color-brand)' }}>
            QİYMƏTLƏR
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
              style={{ color: 'var(--color-ink)' }}>
            Hamı üçün əlçatan
          </h2>
          <p className="text-sm mb-12"
             style={{ color: 'var(--color-text-muted)' }}>
             Tezliklə...
          </p>
        </div>
      </section>

      {/* FAQ placeholder */}
      <section id="faq" className="py-24 px-6 bg-surface-muted">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3"
             style={{ color: 'var(--color-brand)' }}>
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
              style={{ color: 'var(--color-ink)' }}>
            Tez-tez soruşulanlar
          </h2>
          <p className="text-sm"
             style={{ color: 'var(--color-text-muted)' }}>
            Tezliklə...
          </p>
        </div>
      </section>

      {/* SECTION 7 — Final CTA */}
      <section className="py-28 px-6 text-center relative overflow-hidden bg-dark">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-brand) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 bg-brand" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-brand/20 text-brand border border-brand/30 text-xs font-semibold">
            <Sparkles size={12} />
            <span>Pulsuz başlayın</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-5 text-white tracking-tight">Bu gün başlayın.</h2>
          <p className="text-base mb-10 text-dark-muted">Qeydiyyat pulsuzdur və cəmi bir neçə an vaxtınızı alacaq.</p>
          <button
            onClick={() => navigate(ROUTES.AUTH.REGISTER)}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold bg-brand text-ink hover:bg-brand-hover transition-colors"
          >
            Qeydiyyatdan keç <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
};

// --- Sub-components ---

const StepCard: React.FC<{ num: string; icon: React.ReactNode; title: string; desc: string }> = ({ num, icon, title, desc }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`bg-white border border-border-soft rounded-3xl p-8 relative overflow-hidden hover:border-brand hover:shadow-lg transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="absolute -top-4 -right-4 text-8xl font-black opacity-[0.04] text-ink select-none">{num}</div>
      <div className="w-10 h-10 rounded-2xl bg-brand text-ink font-bold text-sm flex items-center justify-center mb-5">{num}</div>
      <div className="text-ink mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{desc}</p>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`bg-white border border-border-soft rounded-3xl p-8 hover:border-brand hover:shadow-md transition-all duration-700 group flex items-start gap-5 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface-muted group-hover:bg-brand flex items-center justify-center flex-shrink-0 transition-colors duration-300">
        <div className="text-text-muted group-hover:text-ink transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-1.5 text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-text-muted">{desc}</p>
      </div>
    </div>
  );
};

const ProgramCard: React.FC<{ logo: string, company: string, title: string, duration: string, price: string, mentor: boolean, onAction: () => void }> = ({ logo, company, title, duration, price, mentor, onAction }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      onClick={onAction}
      className={`bg-white border border-border-soft rounded-3xl overflow-hidden hover:border-brand hover:shadow-xl hover:-translate-y-1 transition-all duration-700 cursor-pointer group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="h-1 bg-brand" />
      <div className="p-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-muted mb-5">
          <div className="w-6 h-6 rounded-lg bg-ink text-brand flex items-center justify-center text-xs font-bold">{logo}</div>
          <span className="text-xs font-semibold text-ink">{company}</span>
        </div>
        <h3 className="text-base font-bold text-ink mb-4">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-muted text-text-muted flex items-center gap-1">
            <Clock size={10} /> {duration}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${price === 'Pulsuz' ? 'bg-brand/15 text-brand' : 'bg-yellow-100 text-yellow-800'}`}>
            {price}
          </span>
          {mentor && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
              <Users size={10} /> Mentor var
            </span>
          )}
          {!mentor && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-600">Mentor yoxdur</span>
          )}
        </div>
        <button className="w-full py-3 rounded-xl text-sm font-bold bg-surface-muted text-ink group-hover:bg-ink group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
          Müraciət et <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

const PartnerCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; points: string[]; btnText: string; onAction: () => void }> = ({ icon, title, desc, points, btnText, onAction }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`bg-white border border-border-soft rounded-3xl p-9 hover:border-brand hover:shadow-xl hover:-translate-y-1 transition-all duration-700 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand/15 group-hover:bg-brand flex items-center justify-center mb-6 transition-colors">
        <div className="text-brand group-hover:text-ink transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-extrabold text-ink mb-3">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted mb-8">{desc}</p>
      <div className="space-y-2 mb-8">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
            {p}
          </div>
        ))}
      </div>
      <button onClick={onAction} className="w-full py-3.5 rounded-2xl font-bold text-sm bg-ink text-white hover:opacity-90 transition-opacity">
        {btnText}
      </button>
    </div>
  );
};
