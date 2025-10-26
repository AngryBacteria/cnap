import {
	ActionIcon,
	Alert,
	Badge,
	Card,
	Flex,
	Loader,
	Menu,
	Text,
	Title,
} from "@mantine/core";
import { IconAlertSquareRounded, IconEdit } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FormattedDateText } from "../../components/General/FormattedDateText.tsx";
import { CreateCharacterModal } from "../../components/Session/createCharacterModal.tsx";
import { CreateEmptySessionModal } from "../../components/Session/createEmptySessionModal.tsx";
import { usePenAndPaperSessions } from "../../hooks/api/usePenAndPaperSessions.ts";
import { PRIMARY_COLOR } from "../../main.tsx";
import { truncateText } from "../../utils/GeneralUtil.ts";
import styles from "./index.module.css";

export const Route = createFileRoute("/sessions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const sessionQuery = usePenAndPaperSessions();

	const [emptySessionOpen, setEmptySessionOpen] = useState(false);
	const [characterOpen, setCharacterOpen] = useState(false);

	if (sessionQuery.status === "pending") {
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

	if (sessionQuery.status === "error") {
		return (
			<Alert
				title={"Fehler beim Laden der PenAndPaper Sessions"}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan können keine PenAndPaper Sessions geladen werden. Bitte
				versuche es später nochmal.
			</Alert>
		);
	}

	return (
		<Flex direction={"column"} gap={"md"}>
			<Flex justify={"flex-end"}>
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

			{sessionQuery.data?.map((session) => (
				<div className={"fillSpace"} key={session.id}>
					<Link
						to={"/sessions/view/$sessionId"}
						params={{ sessionId: `${session.id}` }}
						className={styles.navigationItem}
					>
						<Card shadow={"md"} withBorder className={"fillSpacePointer"}>
							<Flex direction={"column"} gap={"md"}>
								<Flex
									wrap={"wrap"}
									direction={"row"}
									justify={"space-between"}
									align={"center"}
									gap={"md"}
								>
									<Title order={2}>{session.sessionName}</Title>
									<Flex direction={"row"} gap={"md"} align={"center"}>
										<FormattedDateText
											unixTimestamp={session.timestamp.valueOf()}
										/>
										<Badge color={PRIMARY_COLOR}>{session.framework}</Badge>
									</Flex>
								</Flex>
								<Text hiddenFrom={"sm"}>
									{truncateText(session.summaryShort, 500)}
								</Text>
								<Text visibleFrom={"sm"}>{session.summaryShort}</Text>
							</Flex>
						</Card>
					</Link>
				</div>
			))}
		</Flex>
	);
}
