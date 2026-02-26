import { Brain, Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'smartfeedback-app');

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-amber-teal">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">
              Smart<span className="text-primary">Feedback</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/submit" className="hover:text-foreground transition-colors">Submit</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Instructor</Link>
          </nav>

          {/* Attribution */}
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            © {year} Built with{' '}
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
