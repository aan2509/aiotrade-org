import "server-only";

import sanitizeHtml from "sanitize-html";
import { normalizeArticleContent } from "@/lib/article-content";

const articleAllowedTags = [
  "a",
  "blockquote",
  "br",
  "div",
  "em",
  "figcaption",
  "figure",
  "h2",
  "h3",
  "h4",
  "hr",
  "img",
  "input",
  "label",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
] as const;

export function sanitizeArticleHtml(value: string) {
  return sanitizeHtml(normalizeArticleContent(value), {
    allowedAttributes: {
      "*": ["class", "title"],
      a: ["href", "rel", "target"],
      img: ["alt", "src"],
      input: ["checked", "disabled", "type"],
      label: ["data-checked", "data-type"],
      li: ["data-checked", "data-type"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowedTags: [...articleAllowedTags],
    disallowedTagsMode: "discard",
  });
}
