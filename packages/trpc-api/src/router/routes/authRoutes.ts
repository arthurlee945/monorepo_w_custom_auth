import { router } from "../../trpc";
import {
    authVerify,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    emailVerify,
    updatePassword,
} from "../procedures/authProcedures";

export const authRouter = router({
    authVerify,
    signup,
    emailVerify,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
});
