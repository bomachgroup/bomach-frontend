export function baleMediaUrl(url: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();
  if (/^https?:\/\//i.test(clean)) return clean;

  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "https://backend.bomachgroup.com/api"
  )
    .replace(/\/api(?:\/v1)?\/?$/i, "")
    .replace(/\/$/, "");
  return `${apiBase}/${clean.replace(/^\/+/, "")}`;
}
