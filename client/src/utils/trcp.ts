import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../server/src/trcp";

//TODO: replace old query with this

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 60 * 1000, // 1 hour,
			retry: false,
		},
	},
});

const trpcClient = createTRPCClient<AppRouter>({
	links: [httpBatchLink({ url: "http://localhost:3000" })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});
