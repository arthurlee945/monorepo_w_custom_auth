import { router } from "../../trpc";
import { findAllUsers, findUserById, getAuthenticatedUser } from "../procedures/userProcedures";

export const userRouter = router({
    all: findAllUsers,
    byId: findUserById,
    getAuthenticatedUser,
});
