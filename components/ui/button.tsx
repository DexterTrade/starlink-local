import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        // Solid gold — the signature CTA
        default:
          "bg-[image:var(--grad-gold)] text-primary-foreground shadow-[0_8px_30px_-12px_oklch(0.78_0.13_84/0.7)] hover:brightness-110 hover:-translate-y-px",
        // Onyx pill — quiet primary
        onyx:
          "bg-secondary text-foreground border border-border hover:border-primary/60 hover:bg-card",
        // Gold outline — secondary CTA
        outline:
          "border border-primary/60 text-primary hover:bg-primary/10 hover:text-primary",
        // Ghost — used in nav
        ghost:
          "text-foreground/80 hover:text-primary hover:bg-primary/5",
        // Link — inline text
        link:
          "text-primary underline-offset-4 hover:underline px-0",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Secondary — subtle
        secondary:
          "bg-muted text-foreground hover:bg-muted/70",
      },
      size: {
        default: "h-10 px-5 rounded-sm",
        sm: "h-8 px-3 rounded-sm",
        lg: "h-12 px-7 rounded-sm tracking-wider",
        xl: "h-14 px-9 rounded-sm tracking-widest text-[0.95rem]",
        icon: "size-10 rounded-sm",
        "icon-sm": "size-8 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
