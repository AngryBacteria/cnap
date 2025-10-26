import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export function useCreateCharacter() {
	const queryClient = useQueryClient();
	return useMutation(
		trpc.penAndPaper.createCharacter.mutationOptions({
			onSuccess: async (_result, __variables) => {
				await queryClient.invalidateQueries({
					queryKey: trpc.penAndPaper.getCharacters.queryKey(),
				});
			},
		}),
	);
}
