import removeMd from "remove-markdown";

export function stripMarkdown(text = "") {
  const cleaned = removeMd(text || "");

  // Xoá các dòng chỉ có dấu gạch ngang (---, ***, ___)
  return cleaned
    .replace(/^\s*[-*_]{3,}\s*$/gm, "") // remove horizontal rules
    .replace(/^\s*\n/gm, "") // remove empty lines
    .trim();
}