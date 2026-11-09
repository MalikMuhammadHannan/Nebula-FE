import DOMPurify from "dompurify";

export function stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeHtml(value: string): string {
    return DOMPurify.sanitize(value);
}

const URL_PATTERN = /https?:\/\/[^\s<>"']+/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

const SOURCES_LABEL = /\bsources?\s*:/i;

/** Separates a trailing "Sources: - url - url" block from the rest of the text. */
export function extractSources(value: string): { text: string; sources: string[] } {
    const match = value.match(SOURCES_LABEL);
    if (!match || match.index === undefined) return { text: value, sources: [] };

    const sources = splitUrls(value.slice(match.index + match[0].length))
        .filter((segment) => segment.type === "url")
        .map((segment) => segment.value);
    if (sources.length === 0) return { text: value, sources: [] };

    return { text: value.slice(0, match.index).trim(), sources };
}

export type TextSegment = { type: "text"; value: string } | { type: "url"; value: string };

export function splitUrls(value: string): TextSegment[] {
    const segments: TextSegment[] = [];
    let lastIndex = 0;

    for (const match of value.matchAll(URL_PATTERN)) {
        const start = match.index ?? 0;
        const trailing = match[0].match(TRAILING_PUNCTUATION)?.[0] ?? "";
        const url = match[0].slice(0, match[0].length - trailing.length);

        if (start > lastIndex) segments.push({ type: "text", value: value.slice(lastIndex, start) });
        segments.push({ type: "url", value: url });
        lastIndex = start + url.length;
    }

    if (lastIndex < value.length) segments.push({ type: "text", value: value.slice(lastIndex) });
    return segments;
}
export function sanitizeAndLinkifyHtml(value: string): string {
    const clean = DOMPurify.sanitize(value);
    const doc = new DOMParser().parseFromString(`<div>${clean}</div>`, "text/html");
    const root = doc.body.firstElementChild;
    if (!root) return clean;

    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (!node.parentElement?.closest("a") && URL_PATTERN.test(node.data)) textNodes.push(node);
        URL_PATTERN.lastIndex = 0;
    }

    for (const node of textNodes) {
        const fragment = doc.createDocumentFragment();
        for (const segment of splitUrls(node.data)) {
            if (segment.type === "text") {
                fragment.appendChild(doc.createTextNode(segment.value));
            } else {
                const anchor = doc.createElement("a");
                anchor.href = segment.value;
                anchor.textContent = segment.value;
                anchor.target = "_blank";
                anchor.rel = "noopener noreferrer";
                fragment.appendChild(anchor);
            }
        }
        node.replaceWith(fragment);
    }

    return root.innerHTML;
}
