import { Card, Flex, Image, Text, Tooltip } from "@mantine/core";
import { PRIMARY_COLOR } from "../../../main.tsx";
import type { Outputs } from "../../../utils/trcp.ts";
import { FormattedDateText } from "../../General/FormattedDateText.tsx";
import { LeagueItemGrid } from "../LeagueItemGrid/LeagueItemGrid";
import styles from "./MatchBannerSummary.module.css";

interface Props {
	match: Outputs["lol"]["getMatchesParticipant"]["data"][number];
	queues: Outputs["lol"]["getQueues"];
	summonerSpells: Outputs["lol"]["getSummonerSpells"];
	items: Outputs["lol"]["getItems"];
}

export function MatchBannerSummary({
	match,
	queues,
	summonerSpells,
	items,
}: Props) {
	const participant = match.info.participants;

	const championImage = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant.championId}.png`;

	const formattedGameDuration = `${Math.round(match.info.gameDuration / 60)} minutes`;

	const kda =
		participant.deaths === 0
			? participant.kills + participant.assists
			: Math.round(
					(participant.kills + participant.assists) / participant.deaths,
				);

	const csPerMinute = Math.round(
		(participant.totalMinionsKilled + participant.neutralMinionsKilled) /
			Math.round(match.info.gameDuration / 60),
	);

	const queue = queues.find((q) => q.queueId === match.info.queueId);

	const summonerSpell1 = summonerSpells.find(
		(s) => s.id === participant.summoner1Id,
	);
	const summonerSpell2 = summonerSpells.find(
		(s) => s.id === participant.summoner2Id,
	);

	return (
		<>
			<Card
				shadow={"md"}
				withBorder
				padding={"xs"}
				className={participant.win ? styles.wonCard : styles.lostCard}
			>
				<Card.Section withBorder inheritPadding py="4px">
					<Flex direction={"row"} gap={"md"}>
						<Text>
							{queue?.description?.replace("games", "").trim() ||
								"Unknown Queue"}
						</Text>

						<FormattedDateText unixTimestamp={match.info.gameCreation} />

						<Text c="dimmed">{formattedGameDuration}</Text>
					</Flex>
				</Card.Section>

				<Card.Section withBorder inheritPadding py="4px">
					<Flex
						direction={"row"}
						columnGap={"xl"}
						rowGap={"xs"}
						align={"center"}
						wrap={"wrap"}
					>
						<Flex
							direction={"row"}
							justify={"center"}
							align={"center"}
							gap={"2px"}
						>
							<Tooltip
								label={participant.championName}
								color={PRIMARY_COLOR}
								position="bottom"
								transitionProps={{ transition: "fade-up", duration: 300 }}
							>
								<Image src={championImage} h={50} w={50} radius="5px" />
							</Tooltip>

							<Flex direction={"column"} gap={"2px"}>
								<Image
									src={summonerSpell1?.iconPath}
									h={24}
									w={24}
									radius="5px"
								/>
								<Image
									src={summonerSpell2?.iconPath}
									h={24}
									w={24}
									radius="5px"
								/>
							</Flex>
						</Flex>

						<Flex direction={"column"} justify={"center"} align={"center"}>
							<Text>{participant.riotIdGameName}</Text>
							<Text c="dimmed">#{participant.riotIdTagline}</Text>
						</Flex>

						<Flex direction={"column"} justify={"center"} align={"center"}>
							<Text>
								{participant.kills}/{participant.deaths}/{participant.assists}
							</Text>
							<Tooltip
								label="A KDA of above 2 is considered good"
								color={PRIMARY_COLOR}
								position="bottom"
								transitionProps={{ transition: "fade-up", duration: 300 }}
							>
								<Text c={kda > 2 ? "green.7" : "red.7"}>{kda} KDA</Text>
							</Tooltip>
						</Flex>

						<Flex direction={"column"} justify={"center"} align={"center"}>
							<Text>
								{participant.totalMinionsKilled +
									participant.neutralMinionsKilled}{" "}
								CS
							</Text>
							<Tooltip
								label="A CS per minute of 5 or above is considered good"
								color={PRIMARY_COLOR}
								position="bottom"
								transitionProps={{ transition: "fade-up", duration: 300 }}
							>
								<Text c={csPerMinute > 5 ? "green.7" : "red.7"}>
									{csPerMinute} CS / Min
								</Text>
							</Tooltip>
						</Flex>

						<LeagueItemGrid participant={participant} items={items} />
					</Flex>
				</Card.Section>
			</Card>
		</>
	);
}
