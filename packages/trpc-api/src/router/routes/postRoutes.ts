import { router } from "../../trpc";
import { createPost, findAllPosts, findPostById, deletePost } from "../procedures/postProcedures";

export const postRouter = router({
  all: findAllPosts,
  findById: findPostById,
  create: createPost,
  delete: deletePost,
});
