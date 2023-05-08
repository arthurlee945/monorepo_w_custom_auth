// import type { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage, ServerResponse } from "http";
import httpProxy from "http-proxy";
import Cookies from "cookies";
import url from "url";

import { getBaseUrl } from "../../../utils/getBaseUrl";

const API_URL = getBaseUrl();

const proxyOption = {
    // ignorePath: true,
    secure: false,
};

const proxy = httpProxy.createProxyServer();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    return new Promise<void>((resolve, reject) => {
        if (!req.url) return reject({ message: "require api url path" });
        if (!req || !res) return reject({ message: "require req or res body" });
        const pathname = url.parse(req.url).pathname;

        const isJwtDeliverable = pathname?.endsWith("auth.signup") || pathname?.endsWith("auth.login");
        const isLogout = pathname?.endsWith("auth.logout");

        const cookies = new Cookies(req, res);
        const jwt = cookies.get("jwt");

        req.url = req.url.replace(/^\/api\/proxy/, "");

        delete req.headers.cookie;
        delete req.headers.host;

        jwt && (req.headers["Authorization"] = `Bearer ${jwt}`);

        isJwtDeliverable && proxy.once("proxyRes", interceptJwtResponse);

        isLogout && proxy.once("proxyRes", interceptLogoutResponse);

        proxy.once("error", reject);

        proxy.web(req, res, {
            target: API_URL,
            autoRewrite: false,
            selfHandleResponse: isJwtDeliverable,
        });

        function interceptJwtResponse(proxyRes: IncomingMessage, req: any, res: any) {
            let apiResBody = "";
            proxyRes.on("data", (chunk) => {
                apiResBody += chunk;
            });
            proxyRes.on("end", () => {
                try {
                    const data = JSON.parse(apiResBody)[0];
                    if (data.error) {
                        res.status(400).json(data);
                        reject(data.error);
                    }
                    const authToken = data.result.data.json;
                    const cookies = new Cookies(req, res);
                    cookies.set("jwt", authToken, {
                        httpOnly: true,
                        sameSite: "lax",
                    });
                    data.result.data.json = {
                        loggedIn: true,
                    };
                    res.status(200).json(data);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
        function interceptLogoutResponse(proxyRes: IncomingMessage, req: any, res: any) {
            const cookies = new Cookies(req, res);
            cookies.set("jwt", null, {
                httpOnly: true,
                sameSite: "lax",
            });
        }
    });
}
