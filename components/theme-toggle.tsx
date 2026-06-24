"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  /**
   * "icon" — compact icon-only button (default, for header).
   * "labeled" — sun/moon row with current theme label (for menus).
   */
  variant?: "icon" | "labeled";
};

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  const handleToggle = () => setTheme(next);

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={mounted ? `Switch to ${next} theme` : "Toggle theme"}
        className={cn(
          "flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-sm border border-border bg-card/40 hover:border-primary/40 hover:bg-card transition-colors",
          className,
        )}
      >
        <span className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-mono uppercase tracking-[0.18em] text-foreground/80">
            {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
          </span>
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Switch
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={mounted ? `Switch to ${next} theme` : "Toggle theme"}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        className,
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
