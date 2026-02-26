import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const footerLinks = [
  { label: "Home",       to: "/" },
  { label: "Submit",     to: "/submit" },
  { label: "Dashboard",  to: "/dashboard" },
  { label: "Instructor", to: "/instructor" },
];

export default function Footer() {
  const year    = new Date().getFullYear();
  const appId   = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "anurag-feedback"
  );
  const cafLink = `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`;

  return (
    <footer className="bg-au-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/anuragu-logo.dim_256x256.png"
                alt="Anurag University"
                className="h-10 w-10 object-contain rounded-full bg-white/10 p-0.5 animate-logo-pulse"
              />
              <div>
                <p className="text-sm font-bold tracking-widest uppercase text-au-red leading-none">
                  ANURAG UNIVERSITY
                </p>
                <p className="text-xs text-white/70 leading-tight mt-0.5">
                  Student Feedback System
                </p>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs">
              Empowering students with AI-driven feedback to enhance academic
              performance and learning outcomes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-au-red mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-au-red mb-3">
              About
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              An intelligent feedback platform built for Anurag University
              students and instructors to streamline assignment evaluation.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} Anurag University. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart size={12} className="text-au-red fill-au-red mx-0.5" />{" "}
            using{" "}
            <a
              href={cafLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-au-red hover:text-red-300 transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
