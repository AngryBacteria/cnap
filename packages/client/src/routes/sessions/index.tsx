import { ActionIcon, Alert, Flex, Loader, Menu, Select } from "@mantine/core";
import { IconAlertSquareRounded, IconEdit } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreateCharacterModal } from "../../components/Session/createCharacterModal.tsx";
import { CreateEmptySessionModal } from "../../components/Session/createEmptySessionModal.tsx";
import { SessionList } from "../../components/Session/SessionList.tsx";
import { useCampaignOptions } from "../../hooks/api/useCampaignOptions.ts";
import { usePenAndPaperSessions } from "../../hooks/api/usePenAndPaperSessions.ts";

export const Route = createFileRoute("/sessions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [campaign, setCampaign] = useState<string | undefined>(undefined);
	const sessionQuery = usePenAndPaperSessions(campaign);
	const campaignOptionsQuery = useCampaignOptions();

	const [emptySessionOpen, setEmptySessionOpen] = useState(false);
	const [characterOpen, setCharacterOpen] = useState(false);

	return (
		<Flex direction={"column"} gap={"md"}>
			<Flex justify={"space-between"} align={"center"}>
				<Select
					label="Kampagne"
					data={campaignOptionsQuery.data ?? []}
					value={campaign}
					onChange={(value) => {
						if (value) {
							setCampaign(value);
						}
					}}
				/>

				<Menu shadow="md">
					<Menu.Target>
						<ActionIcon size="lg" variant="light" aria-label="Settings">
							<IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Dropdown>
							<Menu.Item onClick={() => setEmptySessionOpen(true)}>
								Session erstellen
							</Menu.Item>
							<Menu.Item onClick={() => setCharacterOpen(true)}>
								Charakter erstellen
							</Menu.Item>
						</Menu.Dropdown>
					</Menu.Dropdown>
				</Menu>
			</Flex>

			<CreateEmptySessionModal
				opened={emptySessionOpen}
				onClose={() => setEmptySessionOpen(false)}
			/>
			<CreateCharacterModal
				opened={characterOpen}
				onClose={() => setCharacterOpen(false)}
			/>

			{sessionQuery.status === "pending" && (
				<Flex
					justify={"center"}
					align={"center"}
					h={"calc(100vh - var(--app-shell-header-height))"}
					w={"100%"}
				>
					<Loader size="xl" type="dots" />
				</Flex>
			)}

			{sessionQuery.status === "error" && (
				<Alert
					title={"Fehler beim Laden der PenAndPaper Sessions"}
					variant={"light"}
					color={"red"}
					icon={<IconAlertSquareRounded />}
				>
					Momentan können keine PenAndPaper Sessions geladen werden. Bitte
					versuche es später nochmal.
				</Alert>
			)}

			<SessionList sessions={sessionQuery.data ?? []} />
		</Flex>
	);
}
