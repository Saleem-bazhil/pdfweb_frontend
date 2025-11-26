import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card Container — unified padding, rounded corners, and shadow
 */
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        // ✨ Balanced padding and spacing
        "bg-card text-card-foreground flex flex-col rounded-2xl border border-border/40 shadow-sm",
        // 💎 Optional hover for reusable premium components
        "hover:shadow-md transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Header — top section with tight spacing and balanced padding
 */
function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // 🧩 Use minimal top padding for header images or gradients
        "grid auto-rows-min gap-2 px-6 pt-4 pb-0",
        // 👇 For actions or buttons on right
        "has-[data-slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Title — strong visual weight for headers
 */
function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Description — subtle subtitle or text
 */
function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm leading-relaxed tracking-normal",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Action — aligns icons/buttons in header corner
 */
function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Content — main content zone
 */
function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // Consistent horizontal padding and vertical rhythm
        "px-6 pt-4 pb-6 space-y-4",
        className
      )}
      {...props}
    />
  );
}

/**
 * Card Footer — bottom section with top border separation
 */
function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Perfect top border, good breathing room
        "flex items-center justify-between px-6 py-5 border-t border-border/40",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
