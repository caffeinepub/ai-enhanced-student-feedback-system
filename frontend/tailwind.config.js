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
        /* Anurag University brand */
        "au-red":       "var(--au-red)",
        "au-navy":      "var(--au-navy)",
        "au-red-light": "var(--au-red-light)",
        "au-red-dark":  "var(--au-red-dark)",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   "calc(var(--radius) + 4px)",
        "2xl":"calc(var(--radius) + 8px)",
      },
      boxShadow: {
        "glow-red":  "0 0 20px 4px oklch(0.45 0.22 22 / 0.30)",
        "glow-navy": "0 0 20px 4px oklch(0.22 0.07 260 / 0.25)",
        "card-hover":"0 8px 30px oklch(0.45 0.22 22 / 0.12)",
      },
      keyframes: {
        logoEnter: {
          "0%":   { opacity: "0", transform: "scale(0.6) rotate(-10deg)" },
          "60%":  { opacity: "1", transform: "scale(1.08) rotate(2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        logoTextEnter: {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        logoPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.04)" },
        },
        logoGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 oklch(0.45 0.22 22 / 0)" },
          "50%":      { boxShadow: "0 0 18px 6px oklch(0.45 0.22 22 / 0.35)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        feedbackSlide: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scoreBadgePop: {
          "0%":   { transform: "scale(0.5)", opacity: "0" },
          "70%":  { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pingRing: {
          "0%":   { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        "logo-enter":      "logoEnter 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "logo-text-enter": "logoTextEnter 0.6s ease forwards",
        "logo-pulse":      "logoPulse 3s ease-in-out infinite",
        "logo-glow":       "logoGlow 3s ease-in-out infinite",
        "fade-up":         "fadeUp 0.45s ease forwards",
        "feedback-slide":  "feedbackSlide 0.5s ease forwards",
        "score-badge-pop": "scoreBadgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "slide-up":        "slideUp 0.4s ease forwards",
        "shimmer":         "shimmer 1.5s infinite",
        "ping-ring":       "pingRing 1.4s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
