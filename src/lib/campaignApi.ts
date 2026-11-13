const PRODUCTION_CAMPAIGN_BACKEND = "https://bomachauth.bgbot.app";
const PREVIEW_CAMPAIGN_BACKEND = "https://bomachauthtest.bgbot.app";

export function getCampaignBackendOrigin() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isPreview = process.env.VERCEL_ENV === "preview";
  const configured = isDevelopment
    ? process.env.CAMPAIGN_BACKEND_INTERNAL_URL
    : isPreview
      ? process.env.CAMPAIGN_BACKEND_PREVIEW_URL
      : process.env.CAMPAIGN_BACKEND_PRODUCTION_URL;
  const fallback = isDevelopment
    ? "http://127.0.0.1:8000"
    : isPreview
      ? PREVIEW_CAMPAIGN_BACKEND
      : PRODUCTION_CAMPAIGN_BACKEND;
  const value = configured && /^https?:\/\//i.test(configured) ? configured : fallback;
  return value.replace(/\/api(?:\/v1)?\/?$/i, "").replace(/\/$/, "");
}

export function getCampaignBackendApiBase() {
  return `${getCampaignBackendOrigin()}/api/v1`;
}

export function isCampaignPublicApiPath(path: string[]) {
  return path[0] === "v1"
    && path[1] === "public"
    && (path[2] === "campaign-pages" || path[2] === "lead-forms");
}
