import { useEffect, useRef, useState, useCallback, useId } from 'react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// ── Intersection Observer hook ────────────────────────────────────────────────
function useScrollVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Floating Particles ────────────────────────────────────────────────────────
interface Particle {
  id: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  isCircle: boolean;
}

const RING_SIZES = Array.from({ length: 12 }, (_, i) => ({
  w: 200 + i * 30,
  h: 200 + i * 30,
  l: (i * 17) % 90,
  t: (i * 23) % 80,
}));

const COLORS = [
  'oklch(0.58 0.27 340)',
  'oklch(0.42 0.22 340)',
  'oklch(0.75 0.2 340)',
  'oklch(0.9 0.1 340)',
  'oklch(0.7 0.25 0)',
];

function FloatingParticles() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * 100,
      size: 4 + Math.random() * 12,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      isCircle: Math.random() > 0.5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size,
            borderRadius: p.isCircle ? '50%' : '30%',
            backgroundColor: p.color,
            opacity: 0.6,
            animation: `floatUp ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50%  { opacity: 0.5; }
          100% { transform: translateY(-110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Confetti Burst ────────────────────────────────────────────────────────────
interface ConfettiPiece {
  id: string;
  x: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
  isCircle: boolean;
}

const CONFETTI_COLORS = ['#e91e8c', '#9c1060', '#ff69b4', '#fff', '#ff1493', '#fce4ec'];

function ConfettiBurst({ active }: { active: boolean }) {
  const [pieces] = useState<ConfettiPiece[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: `confetti-${i}`,
      x: 20 + Math.random() * 60,
      duration: 0.8 + Math.random() * 0.8,
      delay: Math.random() * 0.4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      isCircle: Math.random() > 0.5,
    }))
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '40%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animation: `confettiBurst ${p.duration}s ${p.delay}s ease-out forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiBurst {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollVisible(0.3);

  useEffect(() => {
    if (!visible || target === 0) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
    </span>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Leaders', id: 'leaders' },
    { label: 'Benefits', id: 'welfare' },
    { label: 'Register', id: 'register' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'linear-gradient(135deg, oklch(0.42 0.22 340), oklch(0.28 0.15 340))'
          : 'linear-gradient(135deg, oklch(0.42 0.22 340 / 0.95), oklch(0.28 0.15 340 / 0.95))',
        boxShadow: scrolled ? '0 4px 30px oklch(0.28 0.15 340 / 0.5)' : 'none',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-display font-black text-base md:text-lg text-white shadow-lg transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, oklch(0.58 0.27 340), oklch(0.42 0.22 340))' }}
              aria-hidden="true"
            >
              TRS
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-sm md:text-base leading-tight">
                Telangana Rashtra Samithi
              </div>
              <div className="text-xs md:text-sm text-white/70 font-sans">Serving the People of Telangana</div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200 font-semibold text-sm"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo('register')}
              className="ml-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'oklch(0.58 0.27 340)', color: 'white', boxShadow: '0 4px 15px oklch(0.58 0.27 340 / 0.5)' }}
            >
              Register Free
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden pb-4 animate-fade-in-up"
            style={{ borderTop: '1px solid oklch(1 0 0 / 0.2)' }}
          >
            {navLinks.map(link => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors font-semibold"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, oklch(0.28 0.15 340) 0%, oklch(0.42 0.22 340) 40%, oklch(0.58 0.27 340) 70%, oklch(0.68 0.2 20) 100%)',
      }}
    >
      <FloatingParticles />

      {/* Decorative rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 animate-spin-slow pointer-events-none"
        style={{ border: '2px solid oklch(1 0 0)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 pointer-events-none"
        style={{ border: '2px solid oklch(1 0 0)', animation: 'spin 15s linear infinite reverse' }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm mb-6 animate-fade-in-up"
          style={{ background: 'oklch(1 0 0 / 0.15)', backdropFilter: 'blur(10px)', border: '1px solid oklch(1 0 0 / 0.3)' }}
        >
          <span aria-hidden="true">🌹</span>
          Official TRS Party Website
        </div>

        {/* Flag banner */}
        <div
          className="inline-flex items-center gap-4 px-6 py-3 rounded-lg text-white font-display font-bold text-lg md:text-2xl mb-4 animate-flag-wave"
          style={{
            background: 'linear-gradient(90deg, oklch(0.42 0.22 340), oklch(0.58 0.27 340), oklch(0.68 0.2 20))',
            boxShadow: '0 8px 30px oklch(0.28 0.15 340 / 0.4)',
          }}
        >
          🟪 జై తెలంగాణ 🟪
        </div>

        {/* Main title */}
        <h1
          className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mt-4 animate-fade-in-up"
          style={{ animationDelay: '0.2s', textShadow: '0 4px 30px oklch(0.28 0.15 340 / 0.5)' }}
        >
          Telangana
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, oklch(0.9 0.1 340), oklch(1 0 0), oklch(0.85 0.15 20))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Rashtra Samithi
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-white/90 text-lg md:text-2xl font-semibold mt-4 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Serving the People of Telangana
        </p>

        <p
          className="text-white/70 text-sm md:text-base mt-2 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          Free Fruits 🍎 · Free Vegetables 🥦 · Free Rice 🍚 — For Every Registered Citizen
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <button
            type="button"
            onClick={() => scrollTo('register')}
            className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'oklch(1 0 0)',
              color: 'oklch(0.42 0.22 340)',
              boxShadow: '0 8px 30px oklch(0.28 0.15 340 / 0.5)',
            }}
          >
            🎁 Register for Free Benefits
          </button>
          <button
            type="button"
            onClick={() => scrollTo('leaders')}
            className="px-8 py-4 rounded-full font-bold text-lg border-2 border-white/60 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            👥 Meet Our Leaders
          </button>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
          <title>Decorative wave</title>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="oklch(0.97 0.012 340)" />
        </svg>
      </div>
    </section>
  );
}

// ── Leader Card ───────────────────────────────────────────────────────────────
interface LeaderCardProps {
  photo: string;
  name: string;
  title: string;
  role: string;
  info: string;
  delay: number;
  emoji: string;
}

function LeaderCard({ photo, name, title, role, info, delay, emoji }: LeaderCardProps) {
  const { ref, visible } = useScrollVisible(0.1);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-3xl overflow-hidden flex flex-col transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s, box-shadow 0.4s ease`,
        background: 'white',
        boxShadow: hovered
          ? '0 20px 60px oklch(0.58 0.27 340 / 0.4), 0 0 0 2px oklch(0.58 0.27 340)'
          : '0 8px 30px oklch(0.42 0.22 340 / 0.12)',
      }}
    >
      {/* Photo area */}
      <div
        className="relative overflow-hidden"
        style={{ height: 280, background: 'linear-gradient(160deg, oklch(0.42 0.22 340), oklch(0.58 0.27 340))' }}
      >
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-7xl" aria-hidden="true">
            {emoji}
          </div>
        ) : (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover object-top transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={() => setImgError(true)}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, oklch(0.28 0.15 340 / 0.6), transparent)' }}
          aria-hidden="true"
        />
        {/* Role badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold"
          style={{ background: 'oklch(0.58 0.27 340)', boxShadow: '0 2px 8px oklch(0.28 0.15 340 / 0.4)' }}
        >
          {role}
        </div>
        {/* Glow ring on hover */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none animate-glow-pulse"
            style={{ border: '3px solid oklch(0.58 0.27 340 / 0.5)' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Text content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3
          className="font-display font-bold text-xl leading-tight mb-1"
          style={{ color: 'oklch(0.28 0.15 340)' }}
        >
          {name}
        </h3>
        <div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3 self-start"
          style={{ background: 'oklch(0.95 0.025 340)', color: 'oklch(0.42 0.22 340)' }}
        >
          🏅 {title}
        </div>
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'oklch(0.45 0.05 340)' }}>
          {info}
        </p>
        <div
          className="mt-4 pt-4 flex items-center gap-2 text-xs font-bold"
          style={{ borderTop: '1px solid oklch(0.9 0.02 340)', color: 'oklch(0.58 0.27 340)' }}
        >
          <span aria-hidden="true">🌹</span> TRS Visionary Leader
        </div>
      </div>
    </article>
  );
}

// ── Leaders Section ───────────────────────────────────────────────────────────
function LeadersSection() {
  const { ref, visible } = useScrollVisible(0.1);

  const leaders: LeaderCardProps[] = [
    {
      photo: '/assets/uploads/Kalvakuntla_Chandrashekar_Rao-2.png',
      name: 'Kalvakuntla Chandrasheker Rao',
      title: 'Chief Minister & TRS Party Head',
      role: 'CM',
      emoji: '👨‍💼',
      info: 'Founder of Telangana Rashtra Samithi, visionary leader who achieved the separate Telangana state. Dedicated to the welfare and development of all Telangana citizens through landmark schemes and progressive governance.',
      delay: 0.1,
    },
    {
      photo: '/assets/uploads/Kalvakuntla_Taraka_Rama_Rao-3.jpg',
      name: 'Kalvakuntla Taraka Rama Rao (KTR)',
      title: 'MLA & Working President, TRS',
      role: 'MLA',
      emoji: '🤝',
      info: 'Dynamic leader driving technology, IT, and industrial growth in Telangana. Champion of youth empowerment, modern governance, and startup ecosystem. Making Telangana a global hub for innovation.',
      delay: 0.25,
    },
    {
      photo: '/assets/uploads/mahandher-reddy-1.jpg',
      name: 'Mahender Reddy',
      title: 'Sarpanch, Gundlagudem, Aler, Telangana',
      role: 'Sarpanch',
      emoji: '🌾',
      info: 'Dedicated grassroots TRS leader serving the people of Gundlagudem village, Aler mandal, Telangana. Tirelessly ensuring welfare schemes reach every household and championing the rights of farmers and villagers.',
      delay: 0.4,
    },
  ];

  return (
    <section id="leaders" className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'oklch(0.97 0.012 340)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
        {RING_SIZES.map(({ w, h, l, t }, idx) => (
          <div
            key={`bg-ring-${w}-${h}`}
            className="absolute rounded-full"
            style={{
              width: w,
              height: h,
              left: `${l}%`,
              top: `${t}%`,
              border: '2px solid oklch(0.58 0.27 340)',
              transform: 'translate(-50%, -50%)',
              zIndex: idx,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <header ref={ref} className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-4"
            style={{
              background: 'oklch(0.58 0.27 340)',
              color: 'white',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            👑 Leadership
          </div>
          <h2
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{
              color: 'oklch(0.28 0.15 340)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Our Visionary Leaders
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: 'oklch(0.45 0.08 340)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease 0.2s',
            }}
          >
            TRS leaders committed to the welfare and development of every Telangana citizen
          </p>
        </header>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map(leader => (
            <LeaderCard key={leader.name} {...leader} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Welfare Card ──────────────────────────────────────────────────────────────
interface WelfareCardProps {
  emoji: string;
  title: string;
  desc: string;
  delay: number;
  color: string;
}

function WelfareCard({ emoji, title, desc, delay, color }: WelfareCardProps) {
  const { ref, visible } = useScrollVisible(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-6 text-center flex flex-col items-center gap-4 transition-all duration-400"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${color}, oklch(0.42 0.22 340))`
          : 'white',
        boxShadow: hovered
          ? '0 20px 50px oklch(0.42 0.22 340 / 0.3)'
          : '0 6px 20px oklch(0.58 0.27 340 / 0.1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s, background 0.4s, box-shadow 0.4s`,
      }}
    >
      <div
        className="text-5xl md:text-6xl"
        aria-hidden="true"
        style={{
          animation: `bounceIcon 1.8s ease-in-out ${delay}s infinite`,
        }}
      >
        {emoji}
      </div>
      <h3
        className="font-display font-bold text-xl transition-colors duration-300"
        style={{ color: hovered ? 'white' : 'oklch(0.28 0.15 340)' }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed transition-colors duration-300"
        style={{ color: hovered ? 'oklch(1 0 0 / 0.85)' : 'oklch(0.45 0.05 340)' }}
      >
        {desc}
      </p>
      <div
        className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300"
        style={{
          background: hovered ? 'oklch(1 0 0 / 0.2)' : 'oklch(0.95 0.025 340)',
          color: hovered ? 'white' : 'oklch(0.42 0.22 340)',
        }}
      >
        FREE for Registered Citizens
      </div>
    </article>
  );
}

// ── Welfare Section ───────────────────────────────────────────────────────────
function WelfareSection() {
  const { ref, visible } = useScrollVisible(0.1);

  const benefits: WelfareCardProps[] = [
    {
      emoji: '🍎',
      title: 'Free Fruits',
      desc: 'Fresh seasonal fruits delivered directly to your doorstep every month. Rich in vitamins and nutrition for your family.',
      delay: 0.1,
      color: 'oklch(0.58 0.27 340)',
    },
    {
      emoji: '🥦',
      title: 'Free Vegetables',
      desc: 'Farm-fresh vegetables sourced locally from Telangana farmers. Nutritious, organic, and completely free for registered households.',
      delay: 0.25,
      color: 'oklch(0.52 0.24 340)',
    },
    {
      emoji: '🍚',
      title: 'Free Rice',
      desc: 'Premium quality Telangana rice every month. Ensuring food security and nutrition for every family in our state.',
      delay: 0.4,
      color: 'oklch(0.48 0.22 340)',
    },
  ];

  return (
    <section
      id="welfare"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, white 0%, oklch(0.97 0.012 340) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <header ref={ref} className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-4"
            style={{
              background: 'oklch(0.95 0.025 340)',
              color: 'oklch(0.42 0.22 340)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            🎁 Welfare Schemes
          </div>
          <h2
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{
              color: 'oklch(0.28 0.15 340)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Free Welfare Benefits
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto font-semibold"
            style={{
              color: 'oklch(0.42 0.22 340)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease 0.2s',
            }}
          >
            TRS ensures every registered citizen receives essential food items — absolutely FREE!
          </p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {benefits.map(b => (
            <WelfareCard key={b.title} {...b} />
          ))}
        </div>

        {/* Banner */}
        <div
          className="mt-12 rounded-2xl p-6 md:p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.42 0.22 340), oklch(0.58 0.27 340), oklch(0.68 0.2 20))',
            boxShadow: '0 12px 40px oklch(0.42 0.22 340 / 0.35)',
          }}
        >
          <div className="text-white text-2xl md:text-3xl font-display font-black mb-2">
            🌟 Register Today &amp; Avail All Benefits
          </div>
          <p className="text-white/85 text-sm md:text-base mb-4">
            Join thousands of Telangana families already receiving free food items through TRS welfare schemes
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: 'white', color: 'oklch(0.42 0.22 340)', boxShadow: '0 4px 15px oklch(0.28 0.15 340 / 0.4)' }}
          >
            Register Now →
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Benefit Checkbox ──────────────────────────────────────────────────────────
interface BenefitCheckboxProps {
  id: string;
  emoji: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function BenefitCheckbox({ id, emoji, label, checked, onChange }: BenefitCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: checked ? 'oklch(0.95 0.025 340)' : 'oklch(0.98 0.005 340)',
        border: `2px solid ${checked ? 'oklch(0.58 0.27 340)' : 'oklch(0.88 0.02 340)'}`,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-pink-500"
      />
      <span className="text-lg" aria-hidden="true">{emoji}</span>
      <span className="text-sm font-semibold" style={{ color: 'oklch(0.35 0.1 340)' }}>
        {label}
      </span>
    </label>
  );
}

// ── Registration Section ──────────────────────────────────────────────────────
function RegistrationSection() {
  const { actor } = useActor();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSectionVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const nameId = useId();
  const phoneId = useId();
  const addressId = useId();
  const fruitsId = useId();
  const vegsId = useId();
  const riceId = useId();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [wantsFruits, setWantsFruits] = useState(false);
  const [wantsVegetables, setWantsVegetables] = useState(false);
  const [wantsRice, setWantsRice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!actor) return;
    try {
      const n = await actor.getTotalRegistrants();
      setTotalCount(Number(n));
    } catch (_) { /* silent */ }
  }, [actor]);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) { toast.error('Please wait, loading...'); return; }
    if (!fullName.trim() || !phoneNumber.trim() || !address.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!wantsFruits && !wantsVegetables && !wantsRice) {
      toast.error('Please select at least one benefit you want to receive.');
      return;
    }

    setSubmitting(true);
    try {
      const isReg = await actor.isRegistered(phoneNumber);
      if (isReg) {
        setAlreadyRegistered(true);
        setSuccess(false);
        toast.error('This phone number is already registered!');
        setSubmitting(false);
        return;
      }

      await actor.registerRegistrant(fullName, phoneNumber, address, wantsFruits, wantsVegetables, wantsRice);

      setSuccess(true);
      setAlreadyRegistered(false);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
      toast.success('🎉 Registration successful! You will receive your free benefits.');
      await fetchCount();
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '2px solid oklch(0.88 0.02 340)',
    outline: 'none',
    fontSize: 15,
    background: 'white',
    color: 'oklch(0.18 0.04 340)',
    fontFamily: 'Nunito, system-ui, sans-serif',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'oklch(0.58 0.27 340)';
    e.target.style.boxShadow = '0 0 0 3px oklch(0.58 0.27 340 / 0.15)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'oklch(0.88 0.02 340)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <section
      id="register"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, oklch(0.97 0.012 340), white)' }}
    >
      <ConfettiBurst active={confetti} />

      {/* Blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'oklch(0.58 0.27 340)', transform: 'translate(30%, -30%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-15"
        style={{ background: 'oklch(0.42 0.22 340)', transform: 'translate(-30%, 30%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Heading */}
        <header ref={sectionRef} className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-4"
            style={{
              background: 'oklch(0.58 0.27 340)',
              color: 'white',
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            📋 Free Registration
          </div>
          <h2
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-3"
            style={{
              color: 'oklch(0.28 0.15 340)',
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Register to Avail
            <br />
            <span style={{ color: 'oklch(0.58 0.27 340)' }}>Free Benefits</span>
          </h2>

          {/* Counter */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold mt-3"
            style={{
              background: 'oklch(0.95 0.025 340)',
              color: 'oklch(0.42 0.22 340)',
              opacity: sectionVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.3s',
            }}
          >
            👥 <AnimatedCounter target={totalCount} /> citizens already registered!
          </div>
        </header>

        {/* Form card */}
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{
            background: 'white',
            boxShadow: '0 20px 60px oklch(0.42 0.22 340 / 0.15)',
            border: '1px solid oklch(0.9 0.02 340)',
          }}
        >
          {success ? (
            /* Success state */
            <div className="text-center py-8 animate-fade-in-up">
              <div className="text-6xl mb-4" aria-hidden="true">🎉</div>
              <h3 className="font-display font-black text-2xl mb-2" style={{ color: 'oklch(0.28 0.15 340)' }}>
                Registration Successful!
              </h3>
              <p className="text-base mb-4" style={{ color: 'oklch(0.45 0.05 340)' }}>
                You are now registered! Your free benefits will be delivered.
              </p>
              <div
                className="rounded-2xl p-4 mb-6 text-sm"
                style={{ background: 'oklch(0.95 0.025 340)', color: 'oklch(0.42 0.22 340)' }}
              >
                🌹 Thank you for registering with TRS. Our team will contact you shortly regarding your free fruits, vegetables, and rice delivery.
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setFullName('');
                  setPhoneNumber('');
                  setAddress('');
                  setWantsFruits(false);
                  setWantsVegetables(false);
                  setWantsRice(false);
                }}
                className="px-6 py-2 rounded-full font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'oklch(0.58 0.27 340)', color: 'white' }}
              >
                Register Another Person
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {alreadyRegistered && (
                <div
                  className="rounded-xl p-4 text-sm font-semibold animate-fade-in-up"
                  role="alert"
                  style={{ background: 'oklch(0.95 0.03 25)', color: 'oklch(0.4 0.2 25)', border: '1px solid oklch(0.85 0.06 25)' }}
                >
                  ⚠️ This phone number is already registered in our system.
                </div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor={nameId} className="block text-sm font-bold mb-1.5" style={{ color: 'oklch(0.35 0.1 340)' }}>
                  Full Name *
                </label>
                <input
                  id={nameId}
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="name"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor={phoneId} className="block text-sm font-bold mb-1.5" style={{ color: 'oklch(0.35 0.1 340)' }}>
                  Phone Number *
                </label>
                <input
                  id={phoneId}
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="tel"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor={addressId} className="block text-sm font-bold mb-1.5" style={{ color: 'oklch(0.35 0.1 340)' }}>
                  Village / Address *
                </label>
                <textarea
                  id={addressId}
                  placeholder="Enter your village, mandal, district, and state"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="street-address"
                />
              </div>

              {/* Benefits checkboxes */}
              <fieldset>
                <legend className="text-sm font-bold mb-3" style={{ color: 'oklch(0.35 0.1 340)' }}>
                  Select Benefits You Want *
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <BenefitCheckbox
                    id={fruitsId}
                    emoji="🍎"
                    label="Free Fruits"
                    checked={wantsFruits}
                    onChange={setWantsFruits}
                  />
                  <BenefitCheckbox
                    id={vegsId}
                    emoji="🥦"
                    label="Free Vegetables"
                    checked={wantsVegetables}
                    onChange={setWantsVegetables}
                  />
                  <BenefitCheckbox
                    id={riceId}
                    emoji="🍚"
                    label="Free Rice"
                    checked={wantsRice}
                    onChange={setWantsRice}
                  />
                </div>
              </fieldset>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: submitting
                    ? 'oklch(0.7 0.1 340)'
                    : 'linear-gradient(135deg, oklch(0.58 0.27 340), oklch(0.42 0.22 340))',
                  color: 'white',
                  boxShadow: '0 8px 25px oklch(0.58 0.27 340 / 0.4)',
                  fontSize: 16,
                }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white inline-block"
                      style={{ animation: 'spin 0.7s linear infinite' }}
                      aria-hidden="true"
                    />
                    Registering...
                  </span>
                ) : (
                  '🎁 Register & Avail Free Benefits'
                )}
              </button>

              <p className="text-xs text-center" style={{ color: 'oklch(0.6 0.04 340)' }}>
                By registering, you agree to receive welfare benefits from TRS party.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, oklch(0.28 0.15 340), oklch(0.42 0.22 340))',
      }}
    >
      {/* Wave top */}
      <div className="relative" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
          <title>Decorative wave</title>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-base text-white"
                style={{ background: 'oklch(0.58 0.27 340)' }}
                aria-hidden="true"
              >
                TRS
              </div>
              <div>
                <div className="font-display font-bold text-base leading-tight">Telangana Rashtra Samithi</div>
                <div className="text-xs text-white/70">Official Party Website</div>
              </div>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">
              Committed to the welfare, development, and prosperity of every citizen of Telangana. Building a better tomorrow through progressive governance.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h4 className="font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Our Leaders', id: 'leaders' },
                { label: 'Welfare Benefits', id: 'welfare' },
                { label: 'Register', id: 'register' },
              ].map(l => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                  >
                    → {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <h4 className="font-bold text-base mb-4 not-italic">Contact Info</h4>
            <div className="space-y-2 text-sm text-white/75">
              <p>📍 Gundlagudem, Aler, Yadadri Bhuvangiri</p>
              <p>📍 Telangana, India</p>
              <p>🌹 Telangana Rashtra Samithi (TRS)</p>
              <p className="mt-4 pt-4 border-t border-white/20 text-xs text-white/60">
                Free Fruits 🍎 · Free Vegetables 🥦 · Free Rice 🍚
              </p>
            </div>
          </address>
        </div>

        <div
          className="mt-10 pt-6 text-center text-sm text-white/60"
          style={{ borderTop: '1px solid oklch(1 0 0 / 0.15)' }}
        >
          <p className="mb-1">
            🌹 Jai Telangana! TRS — Telangana Rashtra Samithi. All rights reserved © {new Date().getFullYear()}
          </p>
          <p>
            Built with{' '}
            <span aria-hidden="true" style={{ color: 'oklch(0.75 0.2 340)' }}>♥</span>{' '}
            using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Inner page (needs QueryClient context) ─────────────────────────────────────
function TRSWebsiteInner() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}>
      <Navbar />
      <main>
        <HeroSection />
        <LeadersSection />
        <WelfareSection />
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TRSWebsite() {
  return (
    <QueryClientProvider client={queryClient}>
      <TRSWebsiteInner />
    </QueryClientProvider>
  );
}
