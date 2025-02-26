import { Card, Flex, Tabs } from "@mantine/core";
import type { ChampionDTO } from "../../../model/Api.ts";
import { capitalizeFirstLetter } from "../../../utils/GeneralUtil.ts";
import { ChampionAbility } from "./ChampionAbility.tsx";
import { ChampionAbilityStats } from "./ChampionAbilityStats.tsx";

interface Props {
	champion: ChampionDTO;
}

export function ChampionAbilitiesTabs({ champion }: Props) {
	return (
		<>
			<Card shadow={"md"} withBorder>
				<Tabs defaultValue="P">
					<Tabs.List>
						<Tabs.Tab value="P">P</Tabs.Tab>
						{champion.spells.map((spell) => {
							return (
								<Tabs.Tab key={spell.spellKey} value={spell.spellKey}>
									{capitalizeFirstLetter(spell.spellKey)}
								</Tabs.Tab>
							);
						})}
					</Tabs.List>

					<Tabs.Panel value="P">
						<ChampionAbility championAbility={champion.passive} />
					</Tabs.Panel>

					{champion.spells.map((spell) => {
						return (
							<Tabs.Panel value={spell.spellKey} key={spell.name}>
								<Flex direction={"column"} gap={"md"}>
									<ChampionAbility championAbility={spell} />
									<ChampionAbilityStats championAbility={spell} />
								</Flex>
							</Tabs.Panel>
						);
					})}
				</Tabs>
			</Card>
		</>
	);
}
