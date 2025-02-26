import { Flex, Image, Text, Title } from "@mantine/core";
import type {
	LolV1ChampionPassive,
	LolV1ChampionSpell,
} from "../../../model/Api.ts";

interface Props {
	championAbility: LolV1ChampionPassive | LolV1ChampionSpell;
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
