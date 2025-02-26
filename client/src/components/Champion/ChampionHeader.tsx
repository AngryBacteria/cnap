import { Badge, Card, Flex, Grid, Image, Text, Title } from "@mantine/core";
import type { ChampionDTO } from "../../model/Api";
import { ChampionAttributeRadar } from "./ChampionAttributeRadar.tsx";

interface Props {
	champion: ChampionDTO;
}

export function ChampionHeader({ champion }: Props) {
	return (
		<Card shadow={"md"} withBorder>
			<Grid justify="space-between" gutter={"xs"}>
				<Grid.Col span={{ base: 12, md: 7 }}>
					<Flex gap={"md"}>
						<Image
							visibleFrom={"md"}
							h={300}
							w={"auto"}
							src={champion.skins[0].loadScreenPath}
						/>
						<Flex direction={"column"}>
							<Flex
								align={"center"}
								columnGap={"md"}
								rowGap={"xs"}
								wrap={"wrap"}
								pb={"xs"}
							>
								<Title order={1}>{champion.name}</Title>
								{champion.roles.map((role) => {
									return (
										<Badge color="teal" key={role}>
											{role}
										</Badge>
									);
								})}
							</Flex>
							<Text tt={"capitalize"} c={"dimmed"}>
								{champion.title}
							</Text>
							<Text>{champion.shortBio}</Text>
						</Flex>
					</Flex>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 5 }}>
					<ChampionAttributeRadar champion={champion} />
				</Grid.Col>
			</Grid>
		</Card>
	);
}
