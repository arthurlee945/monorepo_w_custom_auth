import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "./src/router/index";

export { appRouter, type AppRouter } from "./src/router/index";

export { createContext, type Context } from "./src/context/context";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
