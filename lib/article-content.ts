function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hasHtmlMarkup(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function normalizeArticleContent(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (hasHtmlMarkup(trimmedValue)) {
    return trimmedValue;
  }

  const paragraphs = trimmedValue
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) =>
      `<p>${paragraph
        .split(/\n/)
        .map((line) => escapeHtml(line.trim()))
        .filter(Boolean)
        .join("<br />")}</p>`,
    );

  return paragraphs.join("");
}

export function extractPlainTextFromArticleContent(value: string) {
  return normalizeArticleContent(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|h2|h3|h4|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
