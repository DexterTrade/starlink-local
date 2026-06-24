import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-[0.16em] border",
  {
    variants: {
      variant: {
        default: "border-primary/40 text-primary bg-primary/10",
        outline: "border-border text-foreground/80 bg-transparent",
        success: "border-[color:var(--success)]/40 text-[color:var(--success)] bg-[color:var(--success)]/10",
        muted: "border-border/60 text-muted-foreground bg-muted/40",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
