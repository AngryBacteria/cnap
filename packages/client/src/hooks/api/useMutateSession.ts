import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export function useMutateSession() {
	const queryClient = useQueryClient();

	return useMutation(
		trpc.penAndPaper.updateSession.mutationOptions({
			onSuccess: async (_result, variables) => {
				await Promise.all([
					queryClient.invalidateQueries({
						queryKey: trpc.penAndPaper.getSession.queryKey(variables.sessionId),
					}),
					queryClient.invalidateQueries({
						queryKey: trpc.penAndPaper.getSessions.queryKey(),
					}),
				]);
			},
		}),
	);
}
