import {
	Alert,
	Card,
	Flex,
	Grid,
	Image,
	Loader,
	Text,
	Title,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useMembers } from "../hooks/api/useMembers.ts";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const membersQuery = useMembers(true);

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
		<Grid>
			{membersQuery.data.map((member) => {
				return (
					<Grid.Col span={{ base: 12, md: 6 }} key={member.gameName}>
						<Card shadow={"md"} withBorder padding={0}>
							<Flex direction={"row"} gap={"md"} align={"center"}>
								<Image
									h={100}
									w={100}
									src={
										"https://www.kurin.com/wp-content/uploads/placeholder-square.jpg"
									}
								/>
								<Flex direction={"column"}>
									<Title order={2}>{member.gameName}</Title>
									{member.punchline && (
										<Text c={"dimmed"}>{member.punchline}</Text>
									)}
								</Flex>
							</Flex>
						</Card>
					</Grid.Col>
				);
			})}
		</Grid>
	);
}
