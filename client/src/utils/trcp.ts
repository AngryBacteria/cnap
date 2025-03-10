import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../server/src/trcp/routers/_app.ts";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 60 * 1000, // 1 hour,
			retry: false,
		},
	},
});

const trpcURL =
	import.meta.env.MODE === "production"
		? "https://cnap.ch/trpc"
		: "http://localhost:3000/trpc";
const trpcClient = createTRPCClient<AppRouter>({
	links: [httpBatchLink({ url: trpcURL })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});
export type Outputs = inferRouterOutputs<AppRouter>;
