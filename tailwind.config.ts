import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)"
      },
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 40px -30px rgba(15, 23, 42, 0.35)",
        glow: "0 0 0 1px rgba(6, 148, 148, 0.2), 0 12px 30px -20px rgba(0, 240, 255, 0.6)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out"
      }
    }
  },
  plugins: []
} satisfies Config;
