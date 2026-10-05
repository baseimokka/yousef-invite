"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades a section in and lifts it slightly as it scrolls into view.
 *
 * `whileInView` with `once: true` means a section animates the first time it
 * is reached and then stays put — scrolling back up does not replay it.
 *
 * When the visitor has asked their system for reduced motion, the content is
 * rendered in its final position with no transform and no transition. That
 * matters more than usual here: almost every section of this page is wrapped
 * in one of these, so a motion-sensitive guest would otherwise be moving
 * through a page that never stops sliding.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 0px 0px" }}
      transition={{ duration: 0.16, delay: delay / 1000, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </Tag>
  );
}
