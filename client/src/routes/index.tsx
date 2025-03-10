import { Alert, Box, Flex, Grid, Loader, Title } from "@mantine/core";
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
		return membersQuery.data.filter((member) => {
			return member.core;
		});
	}, [membersQuery.data]);

	const otherMembers = useMemo(() => {
		if (!membersQuery.data) {
			return [];
		}
		return membersQuery.data.filter((member) => {
			return !member.core;
		});
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
			<Alert title={"No Members found"} variant={"light"}>
				Right now no members are available. Try again later.
			</Alert>
		);
	}

	return (
		<Box pr={"md"} pl={"md"}>
			<section>
				<Flex>
					<Title pb={"md"}>CnAP Members</Title>
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
					<Title py={"md"}>Friends of the CnAP</Title>
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
