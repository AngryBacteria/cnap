import { Alert, Box, Flex, Grid, Loader, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { MemberCard } from "../components/Member/MemberCard/MemberCard.tsx";
import { useMembers } from "../hooks/api/useMembers.ts";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const membersQuery = useMembers(false);

	const cnapMembers = useMemo(() => {
		if (!membersQuery.data) {
			return [];
		}
		const filtered = membersQuery.data.filter((member) => member.core);
		return [...filtered].sort(() => Math.random() - 0.5);
	}, [membersQuery.data]);

	const otherMembers = useMemo(() => {
		if (!membersQuery.data) {
			return [];
		}
		const filtered = membersQuery.data.filter((member) => !member.core);
		return [...filtered].sort(() => Math.random() - 0.5);
	}, [membersQuery.data]);

	if (membersQuery.status === "pending") {
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

	if (membersQuery.status === "error") {
		return (
			<Alert
				title={"Fehler beim Laden der Mitglieder"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan können keine Mitglieder geladen werden. Bitte versuche es
				später nochmal.
			</Alert>
		);
	}

	return (
		<Box pr={"md"} pl={"md"}>
			<section>
				<Flex>
					<Title pb={"md"}>Mitglieder der CnAP</Title>
				</Flex>
				<Grid>
					{cnapMembers.map((member) => {
						return (
							<Grid.Col span={{ base: 12, sm: 6 }} key={member.gameName}>
								<MemberCard member={member} />
							</Grid.Col>
						);
					})}
				</Grid>
			</section>

			<section>
				<Flex>
					<Title py={"md"}>Freunde der CnAP</Title>
				</Flex>
				<Grid>
					{otherMembers.map((member) => {
						return (
							<Grid.Col span={{ base: 12, md: 6 }} key={member.gameName}>
								<MemberCard member={member} />
							</Grid.Col>
						);
					})}
				</Grid>
			</section>
		</Box>
	);
}
