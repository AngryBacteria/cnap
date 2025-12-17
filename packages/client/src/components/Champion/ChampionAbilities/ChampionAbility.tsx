import { Flex, Image, Text, Title } from "@mantine/core";
import type { Outputs } from "../../../utils/trcp.ts";

interface Props {
	championAbility:
		| Outputs["lol"]["getChampionById"]["passives"][number]
		| Outputs["lol"]["getChampionById"]["spells"][number];
}

export function ChampionAbility({ championAbility }: Props) {
	return (
		<section>
			<section style={{ marginTop: "1rem" }}>
				<Flex direction={"column"} align={"start"} gap={"xs"}>
					<Flex direction={"row"} align={"center"} gap={"md"}>
						<Image src={championAbility.abilityIconPath} h={75} w={75} />
						<Flex direction={"column"} gap={"sm"}>
							<Title order={2}>{championAbility.name}</Title>
						</Flex>
					</Flex>

					<Text>{championAbility.description.replace(/<[^>]*>/g, "")}</Text>
				</Flex>
			</section>
		</section>
	);
}
