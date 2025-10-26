import { useMutation } from "@tanstack/react-query";
import { trpc } from "../../utils/trcp.ts";

export function useCreateEmptySession() {
	return useMutation(trpc.penAndPaper.createEmptySession.mutationOptions());
}
