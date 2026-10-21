---
name: html-to-react-to-shadcn
description: Convert a user-selected HTML section into a React component, using shadcn/ui and the app's existing Tailwind design tokens. Use when a user names an HTML file and identifies a section by line range or a `CONVERT` HTML comment.
---

# HTML to React with shadcn/ui

Convert only the HTML section the user identifies into a React component that follows the existing app conventions.

## Inputs

- The user names the HTML file in their request.
- The user identifies the section with either a line range (for example, `File:50-78`) or an HTML comment beginning with `CONVERT`.
- If the file or selected section cannot be identified, ask a concise clarifying question. Do not guess.

## Workflow

1. Read the named HTML file and inspect the selected section in context. For `CONVERT` comments, use the comment to identify the intended markup; do not include the marker in the rendered output.
2. Inspect nearby React components, routes, and installed shadcn components. Follow repository conventions for component placement, naming, imports, and composition.
3. Trace the selected markup's behavior. Preserve meaningful links, form behavior, interactions, content, and accessibility semantics. Keep the component a server component unless client-only features such as hooks, event handlers, or browser APIs require a client component.
4. Prefer existing shadcn/ui components where they fit. Do not force a shadcn component onto markup it cannot represent. If custom markup is required instead of a suitable shadcn component, ask the user before writing it.
5. Use Tailwind classes for styling. Follow mobile-first responsive conventions and use only colors, fonts, classes, and CSS variables defined by `apps/web/src/app/globals.css`. Do not introduce arbitrary Tailwind values, raw colors, or new design tokens.
6. Make the smallest complete change. Update the relevant caller or route so the converted component is actually used; remove replaced markup when appropriate.
7. Run a targeted smoke check for the changed surface when available, and report only checks actually run.

## Constraints

- Preserve the selected section's intent and behavior; do not convert unrelated HTML.
- Do not create a client component unless the implementation requires client-side behavior.
- Do not add new dependencies or custom component abstractions for a single conversion.
- Use semantic HTML and accessible labels/attributes as appropriate.
- Ask only when a necessary choice is genuinely unclear; use existing repository conventions otherwise.
