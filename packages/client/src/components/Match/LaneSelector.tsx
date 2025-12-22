import { Select } from "@mantine/core";

interface Props {
	selectedLane: string | null;
	setSelectedLane: (lane: string | null) => void;
}

export function LaneSelector({ selectedLane, setSelectedLane }: Props) {
	const lanesData = [
		{ label: "Bottom", value: "BOTTOM" },
		{ label: "Jungle", value: "JUNGLE" },
		{ label: "Middle", value: "MIDDLE" },
		{ label: "Utility", value: "UTILITY" },
		{ label: "Top", value: "TOP" },
	];

	return (
		<Select
			maw={400}
			clearable
			searchable
			data={lanesData}
			value={selectedLane}
			onChange={setSelectedLane}
			label="Filter by a lane"
		/>
	);
}
