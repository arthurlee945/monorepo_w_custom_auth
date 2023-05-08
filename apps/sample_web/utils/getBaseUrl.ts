export function getBaseUrl() {
    if (typeof window !== "undefined") return "";
    if (process.env.API_URL) return process.env.API_URL;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }