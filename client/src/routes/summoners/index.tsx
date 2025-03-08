import { Alert, Flex, TextInput, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SummonerCard } from "../../components/Summoner/SummonerCard.tsx";
import { SummonerCardSkeleton } from "../../components/Summoner/SummonerCardSkeleton.tsx";
import { useSummoners } from "../../hooks/api/useSummoners.ts";
import styles from "./index.module.css";

export const Route = createFileRoute("/summoners/")({
	component: SummonersPage,
});

function SummonersPage() {
	const [nameSearch, setNameSearch] = useState("");

	const query = useSummoners();

	const filteredSummoners = useMemo(() => {
		if (!query.data) {
			return [];
		}

		return query.data.filter((summoner) => {
			return (
				summoner.gameName.toLowerCase().includes(nameSearch.toLowerCase()) ||
				summoner.tagLine.toLowerCase().includes(nameSearch.toLowerCase())
			);
		});
	}, [query.data, nameSearch]);

	if (query.status === "pending") {
		return (
			<>
				<Flex direction={"column"} pb={"xs"}>
					<Title order={1} pb={"sm"}>
						The Summoners of CnAP
					</Title>
					<Flex>
						<TextInput placeholder="Summoner Name / Tag" disabled />
					</Flex>
				</Flex>

				<section className={styles.summoners}>
					{[...Array(10).keys()].map((value) => {
						return <SummonerCardSkeleton key={value} />;
					})}
				</section>
			</>
		);
	}

	if (query.status === "error") {
		return (
			<Alert title={"No summoners found"} variant={"light"}>
				Right now no summoners are available. Try again later.
			</Alert>
		);
	}

	return (
		<>
			<Flex direction={"column"} pb={"xs"}>
				<Title order={1} pb={"sm"}>
					The Summoners of CnAP
				</Title>
				<Flex>
					<TextInput
						placeholder="Summoner Name / Tag"
						onChange={(event) => setNameSearch(event.currentTarget.value)}
					/>
				</Flex>
			</Flex>

			<section className={styles.summoners}>
				{filteredSummoners.map((summoner) => {
					return <SummonerCard summoner={summoner} key={summoner.puuid} />;
				})}
			</section>
		</>
	);
}
