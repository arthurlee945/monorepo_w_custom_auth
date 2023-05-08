import jwt from "jsonwebtoken";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "database";

export const createContextInner = async <T>(user: T) => ({ user, prisma });

export const createContext = async ({ req }: CreateNextContextOptions) => {
    async function getUser() {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !process.env.JWT_SECRET) return null;
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return null;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (typeof decoded === "string") return null;
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (
                !user ||
                (user.passwordChangedAt && decoded.iat && user.passwordChangedAt.getTime() > decoded.iat * 1000) ||
                (decoded.exp && decoded.exp * 1000 < Date.now())
            )
                return null;
            return user;
        } catch (err) {
            return null;
        }
    }
    const user = await getUser();
    return createContextInner(user);
};

export type Context = inferAsyncReturnType<typeof createContext>;
