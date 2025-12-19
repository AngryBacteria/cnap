import {
	Alert,
	Badge,
	Button,
	Card,
	Flex,
	Image,
	List,
	Loader,
	ScrollArea,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import {
	IconAlertSquareRounded,
	IconClipboardText,
	IconEdit,
	IconScript,
	IconTargetArrow,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormattedDateText } from "../../../components/General/FormattedDateText.tsx";
import { usePenAndPaperSession } from "../../../hooks/api/usePenAndPaperSession.ts";
import { PRIMARY_COLOR } from "../../../main.tsx";

export const Route = createFileRoute("/sessions/view/$sessionId")({
	component: RouteComponent,
});

function RouteComponent() {
	const sessionId = Route.useParams().sessionId;
	const navigate = useNavigate();
	const query = usePenAndPaperSession(Number.parseInt(sessionId, 10));

	if (query.status === "pending") {
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

	if (query.status === "error") {
		return (
			<Alert
				title={`Fehler beim Laden der PenAndPaper Session: ${sessionId}`}
				variant={"light"}
				color={"red"}
				icon={<IconAlertSquareRounded />}
			>
				Momentan kann die Session {sessionId} nicht geladen werden. Bitte
				versuche es später nochmal.
			</Alert>
		);
	}

	const session = query.data;

	interface PenAndPaperParticipant {
		characterName?: string;
		role: string;
		memberName: string;
		profilePictureBase64: string | null | undefined;
		profilePictureMimeType: string | null | undefined;
	}
	const playerObjects: PenAndPaperParticipant[] = session.characters.map(
		(character) => ({
			characterName: character.name,
			role: "Player",
			memberName: character?.member?.gameName ?? "Unknown Player",
			profilePictureBase64: character?.member?.profilePictureBase64,
			profilePictureMimeType: character?.member?.profilePictureMimeType,
		}),
	);
	const dmObject: PenAndPaperParticipant = {
		memberName: session?.dm?.gameName ?? "Unknown DM",
		role: "Dungeon Master",
		profilePictureBase64: session?.dm?.profilePictureBase64,
		profilePictureMimeType: session?.dm?.profilePictureMimeType,
	};
	const participants: PenAndPaperParticipant[] = [
		...playerObjects,
		dmObject,
	].sort(() => Math.random() - 0.5);

	return (
		<Flex direction={"column"} gap={"md"}>
			<Flex
				direction={"row"}
				gap={"md"}
				align={"center"}
				justify={"space-between"}
				wrap={"wrap"}
			>
				<Flex direction={"row"} align={"center"} gap={"md"} wrap={"wrap"}>
					<Title order={2}>{session.sessionName}</Title>
					<FormattedDateText unixTimestamp={session.timestamp.valueOf()} />
					<Badge color={PRIMARY_COLOR}>{session.framework}</Badge>
				</Flex>

				<Button
					leftSection={<IconEdit size={16} />}
					variant="light"
					color={PRIMARY_COLOR}
					onClick={() => navigate({ to: `/sessions/edit/${sessionId}` })}
				>
					Edit
				</Button>
			</Flex>

			<Card withBorder shadow="sm">
				<Tabs defaultValue="shortSummary">
					<Tabs.List>
						<Tabs.Tab
							value="shortSummary"
							leftSection={<IconClipboardText size={12} />}
						>
							Summary (Short)
						</Tabs.Tab>
						<Tabs.Tab
							value="longSummary"
							leftSection={<IconScript size={12} />}
						>
							Summary (Long)
						</Tabs.Tab>
						<Tabs.Tab value="goals" leftSection={<IconTargetArrow size={12} />}>
							Goals
						</Tabs.Tab>
						<Tabs.Tab value="transcript" leftSection={<IconScript size={12} />}>
							Full Transcript
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="shortSummary" p={"sm"}>
						<Text>{session.summaryShort}</Text>
					</Tabs.Panel>

					<Tabs.Panel value="longSummary" p={"sm"}>
						<ScrollArea h={"50vh"} offsetScrollbars>
							<Text style={{ whiteSpace: "pre-line" }}>
								{session.summaryLong}
							</Text>
						</ScrollArea>
					</Tabs.Panel>

					<Tabs.Panel value="goals" p={"sm"}>
						<List>
							{session.goals.map((goal) => (
								<List.Item key={goal}>{goal}</List.Item>
							))}
						</List>
					</Tabs.Panel>

					<Tabs.Panel value="transcript" p={"sm"}>
						<ScrollArea h={"50vh"} offsetScrollbars>
							<Text style={{ whiteSpace: "pre-line" }}>
								{session.transcription}
							</Text>
						</ScrollArea>
					</Tabs.Panel>
				</Tabs>
			</Card>

			<Title order={3}>Participants</Title>
			<Flex
				direction={"row"}
				wrap={"wrap"}
				gap={"md"}
				justify={{ base: "center", sm: "flex-start" }}
			>
				{participants.map((participant) => (
					<Card
						withBorder
						shadow="sm"
						style={{ flex: "1 0 300px" }}
						key={participant.memberName}
					>
						<Flex direction={"column"} align={"center"} gap={"sm"} p="md">
							<Flex
								direction={"row"}
								gap={"sm"}
								align={"center"}
								justify={"center"}
								wrap={"wrap"}
							>
								<Title order={4}>{participant.characterName}</Title>
								<Badge color={PRIMARY_COLOR}>{participant.role}</Badge>
							</Flex>
							<Text c={"dimmed"}>{participant.memberName}</Text>
							{participant.profilePictureBase64 &&
								participant.profilePictureMimeType && (
									<Image
										src={`data:${participant.profilePictureMimeType};base64,${participant.profilePictureBase64}`}
										h={200}
										w="auto"
									/>
								)}
						</Flex>
					</Card>
				))}
			</Flex>
		</Flex>
	);
}
