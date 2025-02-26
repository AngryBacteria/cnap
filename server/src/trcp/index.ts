import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { publicProcedure, router } from "./trcp.js";
import {loggedProcedure} from "./middlewares/executionTime.js";

const appRouter = router({
	userList: loggedProcedure.query(() => {
		return [
			{ id: 1, name: "John Doe" },
			{ id: 2, name: "Jane Doe" },
		];
	}),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
	router: appRouter,
});

server.listen(3000);
console.log("TRCP Server is running on http://localhost:3000");
