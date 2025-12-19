import { RadarChart } from "@mantine/charts";
import { useMemo } from "react";
import { PRIMARY_COLOR } from "../../main.tsx";
import type { Outputs } from "../../utils/trcp.ts";

interface Props {
	champion: Outputs["lol"]["getChampionById"];
}

export function ChampionAttributeRadar({ champion }: Props) {
	const chartData = useMemo(() => {
		const output = Object.entries(champion?.playstyle ?? {})
			.filter(([key]) => key !== "id" && key !== "championId")
			.map(([key, value]) => {
				return {
					attribute: key,
					value: value,
				};
			});

		output.push({
			attribute: "difficulty",
			value: champion?.tacticalInfo?.difficulty ?? 0,
		});

		return output;
	}, [champion]);

	return (
		<RadarChart
			h={300}
			dataKey="attribute"
			withPolarRadiusAxis={false}
			data={chartData}
			series={[{ name: "value", color: PRIMARY_COLOR, opacity: 0.5 }]}
		/>
	);
}
