import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../server/src/trcp/routers/_app.ts";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 60 * 1000, // 1 hour,
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

const PORT = import.meta.env.port ? Number(import.meta.env.port) : 3000;
const trpcURL =
	import.meta.env.MODE === "production"
		? "https://cnap.ch/trpc"
		: `http://localhost:${PORT}/trpc`;
const trpcClient = createTRPCClient<AppRouter>({
	links: [httpBatchStreamLink({ url: trpcURL })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});
export type Outputs = inferRouterOutputs<AppRouter>;
export type Inputs = inferRouterInputs<AppRouter>;
