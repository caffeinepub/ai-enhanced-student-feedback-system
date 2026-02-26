import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, GraduationCap } from "lucide-react";

const navLinks = [
  { label: "Home",        to: "/" },
  { label: "Submit",      to: "/submit" },
  { label: "Dashboard",   to: "/dashboard" },
  { label: "Instructor",  to: "/instructor" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLogoReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-red-100"
          : "bg-white/90 backdrop-blur-sm border-b border-red-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`relative transition-all duration-700 ${
                logoReady ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <div className="absolute inset-0 rounded-full animate-logo-glow pointer-events-none" />
              <img
                src="/assets/generated/anuragu-logo.dim_256x256.png"
                alt="Anurag University"
                className="h-10 w-10 object-contain rounded-full animate-logo-pulse drop-shadow-sm"
              />
            </div>

            <div
              className={`transition-all duration-500 delay-200 ${
                logoReady ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <p className="text-xs font-bold tracking-widest uppercase text-au-red leading-none">
                ANURAG UNIVERSITY
              </p>
              <p className="text-[10px] font-medium tracking-wide text-au-navy leading-tight mt-0.5">
                Student Feedback System
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-au-red text-white shadow-sm"
                      : "text-au-navy hover:bg-red-50 hover:text-au-red"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-au-navy hover:bg-red-50 hover:text-au-red transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-red-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "bg-au-red text-white"
                      : "text-au-navy hover:bg-red-50 hover:text-au-red"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
