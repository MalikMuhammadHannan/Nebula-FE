import DOMPurify from "dompurify";

export function stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeHtml(value: string): string {
    return DOMPurify.sanitize(value);
}
