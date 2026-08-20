"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
};

/**
 * Client boundary that drives every reveal inside it. Children are authored in
 * server components and stream through untouched — only the scroll wiring is
 * client-side.
 */
export default function RevealSection({
  children,
  className = "",
  id,
  as: Tag = "section",
}: RevealSectionProps) {
  const scope = useReveal<HTMLElement>();

  return (
    <Tag ref={scope} id={id} className={className}>
      {children}
    </Tag>
  );
}
