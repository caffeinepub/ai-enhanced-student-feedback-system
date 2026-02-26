import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Brain, Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Submit', path: '/submit' },
  { label: 'My Dashboard', path: '/dashboard' },
  { label: 'Instructor Panel', path: '/admin' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-amber-teal shadow-sm group-hover:shadow-glow transition-shadow duration-300">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Smart<span className="text-primary">Feedback</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/submit">
            <Button size="sm" className="gradient-amber-teal text-white border-0 hover:opacity-90 shadow-sm font-semibold">
              <GraduationCap className="h-4 w-4 mr-1.5" />
              Submit Work
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link to="/submit" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full gradient-amber-teal text-white border-0 font-semibold">
                  <GraduationCap className="h-4 w-4 mr-1.5" />
                  Submit Work
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
