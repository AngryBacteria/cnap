import { Select } from "@mantine/core";

interface Props {
	selectedLane: string | null;
	setSelectedLane: (lane: string | null) => void;
	disabled?: boolean;
}

export function LaneSelector({
	selectedLane,
	setSelectedLane,
	disabled,
}: Props) {
	const lanesData = [
		{ label: "Bottom", value: "BOTTOM" },
		{ label: "Jungle", value: "JUNGLE" },
		{ label: "Middle", value: "MIDDLE" },
		{ label: "Utility", value: "UTILITY" },
		{ label: "Top", value: "TOP" },
	];

	return (
		<Select
			clearable
			searchable
			data={lanesData}
			value={selectedLane}
			onChange={setSelectedLane}
			label="Filter by a lane"
			disabled={disabled}
		/>
	);
}
