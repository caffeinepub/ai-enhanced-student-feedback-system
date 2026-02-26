import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Brain, BarChart3, FileText, ArrowRight, Users, Award, Zap } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    icon: FileText,
    title: "Easy Submission",
    description:
      "Submit assignments effortlessly through our intuitive interface. Just paste your text and let the system handle the rest.",
  },
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    description:
      "Receive intelligent, detailed feedback generated instantly. Our system analyzes your work and provides actionable insights.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Monitor your academic journey with comprehensive dashboards. See your scores, trends, and areas for improvement.",
  },
];

const stats = [
  { icon: Users,  label: "Students Enrolled", value: 1200, suffix: "+" },
  { icon: FileText, label: "Submissions Processed", value: 8500, suffix: "+" },
  { icon: Award,  label: "Average Score",      value: 82,   suffix: "%" },
  { icon: Zap,    label: "Feedback Speed",     value: 2,    suffix: "s" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCard({ icon: Icon, label, value, suffix }: typeof stats[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
    >
      <Icon size={24} className="text-white/80" />
      <span className="text-3xl font-bold text-white animate-count-up">
        {count}{suffix}
      </span>
      <span className="text-xs text-white/70 text-center">{label}</span>
    </div>
  );
}

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setFeaturesVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (featuresRef.current) obs.observe(featuresRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-au-red via-red-700 to-au-navy pt-28 pb-20 px-4">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-white/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div
            className={`flex justify-center mb-6 transition-all duration-700 ${
              heroReady ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping-ring" />
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping-ring" style={{ animationDelay: "0.5s" }} />
              <img
                src="/assets/generated/anuragu-logo.dim_256x256.png"
                alt="Anurag University"
                className="relative h-24 w-24 object-contain rounded-full bg-white/10 p-1 shadow-glow-red animate-logo-pulse"
              />
            </div>
          </div>

          {/* Heading */}
          <div
            className={`transition-all duration-700 delay-200 ${
              heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-2">
              ANURAG UNIVERSITY
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Student Feedback
              <span className="block text-red-200">System</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
              Submit your assignments and receive instant AI-powered feedback to
              accelerate your academic growth and performance.
            </p>
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 ${
              heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              to="/submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-au-red font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Submit Assignment
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-200 text-sm backdrop-blur-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresRef} className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-au-red mb-2">
              Why Choose Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-au-navy mb-3">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Everything you need to submit, review, and improve your academic work
              in one seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
                animationDelay={i * 150}
                visible={featuresVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4 bg-gradient-to-r from-au-navy to-red-900 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <img
            src="/assets/generated/anuragu-logo.dim_256x256.png"
            alt=""
            className="w-64 h-64 object-contain"
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8 text-sm leading-relaxed">
            Join hundreds of Anurag University students already using the platform
            to improve their academic performance.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-au-red text-white font-semibold rounded-full shadow-glow-red hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Get Started Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
