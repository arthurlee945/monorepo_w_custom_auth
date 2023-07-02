import { createTRPCNext } from "@trpc/next";
import { httpBatchLink, loggerLink } from "@trpc/client";
import Cookies from "cookies";
//--------------custom packages
import type { AppRouter } from "trpc-api";
import { transformer } from "trpc-api/transformer";
import { getBaseUrl } from "./getBaseUrl";

let token: string;

export function setToken(newToken: string) {
    token = newToken;
}

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        return {
            transformer,
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/proxy/trpc`,
                    headers() {
                        if (!ctx || !ctx.req || !ctx.res) {
                            return {};
                        }
                        const cookies = new Cookies(ctx.req, ctx.res);
                        const token = cookies.get("jwt");
                        return {
                            Authorization: token ? `Bearer ${token}` : "",
                        };
                    },
                }),
            ],
        };
    },
});

export { type RouterInputs, type RouterOutputs } from "trpc-api";
