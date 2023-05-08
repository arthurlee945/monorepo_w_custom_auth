import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure } from "../../trpc";
import { createJwtToken, generateHash, hashToken, comparePassword, generateRandomToken } from "../../utilFunc/authFunctions";
import { sendEmail } from "../../utilFunc/mailer";

//---------------------------------------- authenticated verification --------------------
export type authedUser = {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    avatar: string | null;
};
export const authVerify = publicProcedure.query(({ ctx }) => {
    if (!ctx.user) {
        return {
            authenticated: false,
            user: {},
        };
    }
    const { id, username, email, emailVerified, avatar } = ctx.user;
    return {
        authenticated: true,
        user: {
            id,
            username,
            email,
            emailVerified,
            avatar,
        },
    };
});

//---------------------------------------- signup ---------------
export const signup = publicProcedure
    .input(
        z.object({
            username: z.string(),
            email: z.string().email(),
            password: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const { username, email, password } = input;
        if (
            await ctx.prisma.user.findUnique({
                where: {
                    username,
                },
            })
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Username already exists",
            });
        }

        if (
            await ctx.prisma.user.findUnique({
                where: {
                    email,
                },
            })
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Email already exists",
            });
        }

        const { token, hashedToken } = generateRandomToken();

        const hashedPassword = await generateHash(password);
        try {
            const res = await ctx.prisma.user.create({
                data: {
                    username: input.username,
                    email: input.email,
                    password: hashedPassword,
                    emailVerificationToken: hashedToken,
                    avatar: "this will be some random icon",
                },
            });
            sendEmail({
                to: input.email,
                subject: "Please Verify Your Email <Sample App>",
                text: `
        Please click on link provided to verify your email\n
        ${process.env.APP_URL}/verify-email?token=${token} \n
        If you didn't signup for Sample App, please ignore this email!
        `,
            });
            return createJwtToken(res.id);
        } catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "we couldn't sign you up. please try again or contact admin",
            });
        }
    });

//-------------------------------------- email verification -------------------------------------
export const emailVerify = publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const hashedToken = hashToken(input);
    const user = await ctx.prisma.user.findFirst({
        where: {
            emailVerificationToken: hashedToken,
        },
    });
    if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "Token is invalid or user is already verified" });
    await ctx.prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            emailVerificationToken: "",
            emailVerified: true,
        },
    });
    return {
        status: "success",
        message: "Email is verified",
    };
});

//-------------------------------------- login -------------------------------------
export const login = publicProcedure.input(z.object({ username: z.string(), password: z.string() })).mutation(async ({ ctx, input }) => {
    if (!input.username) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username is required",
        });
    }
    if (!input.password) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Password is required",
        });
    }
    const user = await ctx.prisma.user.findUnique({
        where: {
            username: input.username,
        },
    });
    if (!user || !(await comparePassword(input.password, user.password))) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Incorrect username or password",
        });
    }
    return createJwtToken(user.id);
});

//--------------------------------------- logout -----------------------------------
export const logout = protectedProcedure.mutation(({ ctx }) => {
    return {
        status: "successful",
    };
});

//-------------------------------------- forgot password -------------------------------------
export const forgotPassword = publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
        where: {
            email: input,
        },
    });
    if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "There is no user with that email address" });
    const { token, hashedToken, expires } = generateRandomToken();
    //const completeUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const response = await sendEmail({
        to: input,
        subject: "Your password reset token from Sample App! (valid for 10 mins)",
        text: `
      Forgot your password?\n
      Please click on link provided to reset your password!\n
      ${process.env.APP_URL}/reset-password?token=${token} \n
      If you didn't forget your password, please ignore this email!
      `,
    });
    if (response.status !== "success")
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "sorry we couldn't send the email. please try again later or contact the admin",
        });

    await ctx.prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(expires),
        },
    });
    return {
        status: "success",
        message: "email is sent",
    };
});

//-------------------------------------- reset password -------------------------------------
export const resetPassword = publicProcedure
    .input(
        z.object({
            token: z.string(),
            newPassword: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const hashedToken = hashToken(input.token);
        const user = await ctx.prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    gte: new Date(Date.now()),
                },
            },
        });
        if (!user) throw new TRPCError({ code: "BAD_REQUEST", message: "Token is invalid or has expired" });
        try {
            await ctx.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: await generateHash(input.newPassword),
                    passwordChangedAt: new Date(Date.now()),
                },
            });
            return {
                status: "success",
                message: "password reset successful",
            };
        } catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "we couldn't reset your password. please try again or contact admin",
            });
        }
    });

//-------------------------------------- update password -------------------------------------
export const updatePassword = protectedProcedure
    .input(
        z.object({
            currPassword: z.string(),
            newPassword: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        if (!(await comparePassword(input.currPassword, ctx.user.password))) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Current Password is Wrong",
            });
        }

        try {
            await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id,
                },
                data: {
                    password: await generateHash(input.newPassword),
                    passwordChangedAt: new Date(Date.now()),
                },
            });
            return createJwtToken(ctx.user.id);
        } catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Sorry, We couldn't update your password. Please try again later.",
            });
        }
    });
