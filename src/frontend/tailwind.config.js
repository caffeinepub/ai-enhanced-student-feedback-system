/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:  "oklch(var(--background) / <alpha-value>)",
        foreground:  "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT:    "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT:    "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT:    "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT:    "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border:  "oklch(var(--border) / <alpha-value>)",
        input:   "oklch(var(--input) / <alpha-value>)",
        ring:    "oklch(var(--ring) / <alpha-value>)",
        /* TRS brand colors */
        "trs-hot":    "oklch(0.58 0.27 340 / <alpha-value>)",
        "trs-dark":   "oklch(0.42 0.22 340 / <alpha-value>)",
        "trs-light":  "oklch(0.95 0.025 340 / <alpha-value>)",
        "trs-pale":   "oklch(0.97 0.012 340 / <alpha-value>)",
        "trs-deep":   "oklch(0.28 0.15 340 / <alpha-value>)",
      },
      fontFamily: {
        sans:    ["Nunito", "system-ui", "sans-serif"],
        display: ["Cinzel", "Georgia", "serif"],
      },
      borderRadius: {
        lg:    "var(--radius)",
        md:    "calc(var(--radius) - 2px)",
        sm:    "calc(var(--radius) - 4px)",
        xl:    "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        "glow-pink":    "0 0 20px 4px oklch(0.58 0.27 340 / 0.35)",
        "glow-pink-lg": "0 0 40px 12px oklch(0.58 0.27 340 / 0.4)",
        "card-pink":    "0 8px 30px oklch(0.58 0.27 340 / 0.15)",
        "card-hover":   "0 16px 50px oklch(0.42 0.22 340 / 0.25)",
        "inner-pink":   "inset 0 2px 8px oklch(0.58 0.27 340 / 0.1)",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        bounceIcon: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px 2px oklch(0.58 0.27 340 / 0.2)" },
          "50%":      { boxShadow: "0 0 30px 8px oklch(0.58 0.27 340 / 0.6)" },
        },
        flagWave: {
          "0%, 100%": { transform: "skewX(0deg) scaleX(1)" },
          "25%":      { transform: "skewX(-3deg) scaleX(0.97)" },
          "75%":      { transform: "skewX(3deg) scaleX(1.03)" },
        },
        gradientShift: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        countUp: {
          from: { opacity: "0", transform: "translateY(10px) scale(0.9)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pageEnter: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%":      { transform: "scale(1.1)" },
          "50%":      { transform: "scale(1)" },
          "75%":      { transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-in-up":   "fadeInUp 0.7s ease forwards",
        "bounce-icon":  "bounceIcon 1.8s ease-in-out infinite",
        "glow-pulse":   "glowPulse 2.5s ease-in-out infinite",
        "flag-wave":    "flagWave 3s ease-in-out infinite",
        "count-up":     "countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "shimmer":      "shimmer 1.5s infinite",
        "page-enter":   "pageEnter 0.35s ease forwards",
        "spin-slow":    "spinSlow 8s linear infinite",
        "heartbeat":    "heartbeat 2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
