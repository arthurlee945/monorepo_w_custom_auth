export function getBaseUrl() {
    if (typeof window !== "undefined") return "";
    if (process.env.APP_URL) return process.env.APP_URL;
    return `http://localhost:${process.env.PORT ?? 3000}`;
}
