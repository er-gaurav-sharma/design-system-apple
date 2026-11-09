import * as React from "react";

import { cn } from "@/lib/utils";

export interface CodeBlockProps
  extends Omit<React.HTMLAttributes<HTMLPreElement>, "children" | "dangerouslySetInnerHTML"> {
  /** The text to show, such as raw log lines. Always rendered as text. */
  text: string;
  /** Wrap long lines. Off, long lines scroll sideways. @default true */
  wrap?: boolean;
  /** A height limit, such as 320 or "20rem". Taller text scrolls. */
  maxHeight?: number | string;
}

/**
 * Monospace text in a tinted box, for raw log lines, keys and requests.
 *
 * It renders text only, never HTML: `text` is a string child, which React
 * escapes, and `children` and `dangerouslySetInnerHTML` are not accepted. It
 * hides nothing, so mask secrets (cookies, tokens, passwords) before the text
 * reaches it. When the text can scroll, the block takes keyboard focus so it
 * can be scrolled without a mouse.
 */
const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ text, wrap = true, maxHeight, className, style, ...props }, ref) => {
    // Defence in depth for untyped callers: drop markup props that the types
    // already forbid.
    const { children: _children, dangerouslySetInnerHTML: _html, ...rest } =
      props as React.HTMLAttributes<HTMLPreElement>;
    const scrolls = !wrap || maxHeight !== undefined;
    return (
      <pre
        ref={ref}
        tabIndex={scrolls ? 0 : undefined}
        className={cn(
          "overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed text-foreground",
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30",
          className,
        )}
        style={maxHeight !== undefined ? { maxHeight, ...style } : style}
        {...rest}
      >
        {String(text)}
      </pre>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
