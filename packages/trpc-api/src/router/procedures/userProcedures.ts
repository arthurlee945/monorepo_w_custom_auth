import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const findAllUsers = publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
        select: {
            username: true,
            avatar: true,
        },
    });
});

export const findUserById = publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
        where: {
            id: input,
        },
        select: {
            username: true,
            avatar: true,
            email: true,
            role: true,
        },
    });
});

export const getAuthenticatedUser = protectedProcedure.query(({ ctx }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "user not found",
        });
    }
    return {};
});
