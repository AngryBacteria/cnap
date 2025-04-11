import { RadarChart } from "@mantine/charts";
import { useMemo } from "react";
import type { Outputs } from "../../utils/trcp.ts";
import {PRIMARY_COLOR} from "../../main.tsx";

interface Props {
	champion: Outputs["lol"]["getChampionById"];
}

export function ChampionAttributeRadar({ champion }: Props) {
	const chartData = useMemo(() => {
		const output = Object.entries(champion.playstyleInfo).map(
			([key, value]) => {
				return {
					attribute: key,
					value: value as number,
				};
			},
		);

		output.push({
			attribute: "difficulty",
			value: champion.tacticalInfo.difficulty,
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
