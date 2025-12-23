import {
	Alert,
	Avatar,
	Badge,
	Flex,
	Group,
	Loader,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { MatchBannerSummaryLoader } from "../../components/Match/MatchBannerSummaryLoader.tsx";
import { useSummoner } from "../../hooks/api/useSummoner.ts";

export const Route = createFileRoute("/summoners/$summonerNameTag")({
	component: SummonerPage,
});

function SummonerPage() {
	const { summonerNameTag } = Route.useParams();

	const gameName = summonerNameTag.split("-")[0];
	const tagLine = summonerNameTag.split("-")[1];

	const summonerQuery = useSummoner({ gameName, tagLine });

	const iconUrl = `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summonerQuery.data?.profileIconId}.png`;

	if (summonerQuery.status === "pending") {
		return (
			<Flex
				justify={"center"}
				align={"center"}
				h={"calc(100vh - var(--app-shell-header-height))"}
				w={"100%"}
			>
				<Loader size="xl" type="dots" />
			</Flex>
		);
	}

	if (summonerQuery.status === "error") {
		return (
			<Alert
				title={"Fehler beim des Summoners"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan kann dieser Summoner nicht angezeigt werden. Bitte versuche es
				später erneut.
			</Alert>
		);
	}

	return (
		<Flex direction={"column"} gap={"md"}>
			<Paper withBorder p="sm" radius="md" shadow="sm">
				<Flex align={"center"} gap={"md"} wrap={"wrap"}>
					<Avatar src={iconUrl} size={100} radius="md" />

					<Stack gap={0}>
						<Flex gap="xs" align="baseline" wrap={"wrap"}>
							<Title order={1} style={{ textOverflow: "ellipsis" }}>
								{summonerQuery.data.gameName}
							</Title>
							<Text c="dimmed" size="xl" fw={700}>
								#{summonerQuery.data.tagLine}
							</Text>
						</Flex>

						<Group gap="xs" mt="sm">
							<Badge variant="light" color="blue">
								Summoner Level {summonerQuery.data.summonerLevel}
							</Badge>
						</Group>
					</Stack>
				</Flex>
			</Paper>

			<MatchBannerSummaryLoader gameName={gameName} tagLine={tagLine} />
		</Flex>
	);
}
