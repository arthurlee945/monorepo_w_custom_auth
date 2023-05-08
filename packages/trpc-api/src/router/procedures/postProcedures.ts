import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure } from "../../trpc";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  categories: z.array(z.string()),
  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      long: z.number().optional(),
      lat: z.number().optional(),
    })
    .optional(),
});

export const findAllPosts = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.post.findMany({ orderBy: { createdAt: "asc" } });
});

export const findPostById = publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
  return ctx.prisma.post.findFirst({
    where: {
      id: input.id,
    },
  });
});

export const createPost = protectedProcedure.input(postSchema).mutation(({ ctx, input }) => {
  const location = input.location || {};
  return ctx.prisma.post.create({
    data: {
      title: input.title,
      content: input.content,
      ...location,
      categories: {
        connect: input.categories.map((cat) => ({ id: cat })),
      },
      author: {
        connect: {
          id: ctx.user.id,
        },
      },
    },
  });
});

export const deletePost = protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
  const post = await ctx.prisma.post.findUnique({ where: { id: input } });
  if (!post) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "post does not exists",
      cause: "noPost",
    });
  }
  if (post.authorId !== ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "unauthorized to delete the post",
      cause: "unauthorized",
    });
  }
  return ctx.prisma.post.delete({ where: { id: input } });
});
