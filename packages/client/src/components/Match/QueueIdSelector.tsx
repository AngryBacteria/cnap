import { Select } from "@mantine/core";
import { useMemo } from "react";
import { useQueues } from "../../hooks/api/useQueues.ts";

interface Props {
	selectedQueueId: string | null;
	setSelectedQueueId: (queue: string | null) => void;
	disabled?: boolean;
}

export function QueueIdSelector({
	selectedQueueId,
	setSelectedQueueId,
	disabled,
}: Props) {
	const queuesQuery = useQueues();
	const formattedQueues = useMemo(() => {
		const output = [];
		if (queuesQuery.data) {
			for (const queue of queuesQuery.data) {
				if (queue.notes?.includes("Deprecated")) {
					continue;
				}

				if (queue.queueId && queue.description) {
					output.push({
						value: `${queue.queueId}`,
						label: queue.description,
					});
				}
			}
		}
		return output;
	}, [queuesQuery.data]);

	return (
		<Select
			clearable
			searchable
			disabled={queuesQuery.isLoading || disabled}
			data={formattedQueues}
			value={selectedQueueId}
			onChange={setSelectedQueueId}
			label="Filter by a queue"
		/>
	);
}
