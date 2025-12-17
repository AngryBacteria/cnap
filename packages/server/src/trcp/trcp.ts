import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod/v4";

const t = initTRPC.create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodErrorTree:
					error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
				prettyZodError:
					error.cause instanceof ZodError ? z.prettifyError(error.cause) : null,
			},
		};
	},
});

export const router = t.router;
export const publicProcedure = t.procedure;
