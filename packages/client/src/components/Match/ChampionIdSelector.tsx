import { Select } from "@mantine/core";
import { useMemo } from "react";
import { useChampions } from "../../hooks/api/useChampions.ts";

interface Props {
	selectedChampionId: string | null;
	setSelectedChampionId: (queue: string | null) => void;
	disabled?: boolean;
}

export function ChampionIdSelector({
	selectedChampionId,
	setSelectedChampionId,
	disabled,
}: Props) {
	const championsQuery = useChampions();
	const formattedChampions = useMemo(() => {
		const output = [];
		if (championsQuery.data) {
			for (const champion of championsQuery.data) {
				if (champion.id <= 1) {
					continue;
				}
				output.push({
					label: `${champion.name}`,
					value: `${champion.id}`,
				});
			}
		}
		return output;
	}, [championsQuery.data]);

	return (
		<Select
			clearable
			searchable
			disabled={championsQuery.isLoading || disabled}
			data={formattedChampions}
			value={selectedChampionId}
			onChange={setSelectedChampionId}
			label="Filter by a champion"
		/>
	);
}
