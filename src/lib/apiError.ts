export function getApiErrorMessage(
  err: any,
  fallback = "Something went wrong"
) {
  const data = err?.data ?? err?.response?.data;

  if (!data) return fallback;

  if (typeof data === "string") return data;
  if (data.detail)
    return Array.isArray(data.detail)
      ? data.detail.join(", ")
      : String(data.detail);
  if (data.message)
    return Array.isArray(data.message)
      ? data.message.join(", ")
      : String(data.message);

  if (typeof data === "object") {
    const parts: string[] = [];
    for (const [, val] of Object.entries(data)) {
      if (Array.isArray(val)) parts.push(val.join(", "));
      else if (val && typeof val === "object") parts.push(JSON.stringify(val));
      else parts.push(String(val));
    }
    if (parts.length) return parts.join("\n");
  }

  return fallback;
}
