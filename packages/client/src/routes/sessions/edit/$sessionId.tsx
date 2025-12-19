import {
	Alert,
	Button,
	FileInput,
	Flex,
	Grid,
	Group,
	Loader,
	MultiSelect,
	Paper,
	PasswordInput,
	Select,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
	IconAlertSquareRounded,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import logger from "../../../../../server/src/helpers/Logger.ts";
import { useCharacters } from "../../../hooks/api/useCharacters.ts";
import { useMembers } from "../../../hooks/api/useMembers.ts";
import { useMutateSession } from "../../../hooks/api/useMutateSession.ts";
import { usePenAndPaperSession } from "../../../hooks/api/usePenAndPaperSession.ts";
import { fileToBase64 } from "../../../utils/GeneralUtil.ts";
import type { Outputs } from "../../../utils/trcp.ts";

export const Route = createFileRoute("/sessions/edit/$sessionId")({
	component: SessionEditViewWrapper,
});

function SessionEditViewWrapper() {
	const sessionId = Route.useParams().sessionId;
	const sessionQuery = usePenAndPaperSession(Number.parseInt(sessionId, 10));
	const membersQuery = useMembers(true);
	const charactersQuery = useCharacters();

	if (
		sessionQuery.status === "pending" ||
		membersQuery.status === "pending" ||
		charactersQuery.status === "pending"
	) {
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

	if (
		sessionQuery.status === "error" ||
		membersQuery.status === "error" ||
		charactersQuery.status === "error"
	) {
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

	return (
		<SessionEditView
			session={sessionQuery.data}
			members={membersQuery.data}
			characters={charactersQuery.data}
		/>
	);
}

interface Props {
	session: Outputs["penAndPaper"]["getSession"];
	members: Outputs["general"]["getMembers"];
	characters: Outputs["penAndPaper"]["getCharacters"];
}

function SessionEditView({ session, members, characters }: Props) {
	const mutation = useMutateSession();
	const navigate = useNavigate();

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			framework: session.framework,
			timestamp: session.timestamp.toISOString(),
			sessionName: session.sessionName,
			campaign: session.campaign,
			summaryLong: session.summaryLong,
			summaryShort: session.summaryShort,
			dmMemberGameName: session.dmMemberGameName,
			characterIds: session.characters.map((char) => `${char.id}`),
			goals: session.goals,
			audioFile: null as File | null,
			transcript: session.transcription ?? "",
			password: "",
		},
		validate: {
			framework: (value) =>
				!value
					? "Framework ist erforderlich"
					: value.length < 2
						? "Der Name des Frameworks muss mindestens 2 Zeichen lang sein"
						: null,
			timestamp: (value) => {
				if (!value) return "Zeitstempel ist erforderlich";
				const date = new Date(value);
				if (date.getTime() > Date.now())
					return "Der Zeitstempel darf nicht in der Zukunft liegen";
				return Number.isNaN(date.getTime()) ? "Ungültiger Zeitstempel" : null;
			},
			sessionName: (value) => {
				if (!value) return "Sitzungsname ist erforderlich";
				if (value.trim().length < 3)
					return "Der Sitzungsname muss mindestens 3 Zeichen enthalten";
				if (value.length > 100)
					return "Der Sitzungsname darf höchstens 100 Zeichen lang sein";
				return null;
			},
			campaign: (value) => {
				if (!value) return "Kampagne ist erforderlich";
				if (value.trim().length < 2)
					return "Der Kampagnenname muss mindestens 2 Zeichen lang sein";
				return null;
			},
			summaryLong: (value) => {
				if (!value) return "Lange Zusammenfassung ist erforderlich";
				if (value.trim().length < 50)
					return "Die lange Zusammenfassung muss mindestens 50 Zeichen enthalten";
				return null;
			},
			summaryShort: (value) => {
				if (!value) return "Kurze Zusammenfassung ist erforderlich";
				if (value.trim().length < 10)
					return "Die kurze Zusammenfassung muss mindestens 10 Zeichen enthalten";
				return null;
			},
			dmMemberGameName: (value) => {
				if (!value) return "Spielleiter Name ist erforderlich";
				return null;
			},
			characterIds: (value) => {
				if (!value || value.length === 0)
					return "Mindestens ein Charakter ist erforderlich";
				return null;
			},
			goals: (value) => {
				if (!value || value.length === 0)
					return "Mindestens ein Ziel ist erforderlich";
				for (const goal of value) {
					if (goal.trim().length < 5) {
						return "Jedes Ziel muss mindestens 5 Zeichen enthalten";
					}
				}
				return null;
			},
			transcript: (value) => {
				if (!value) return "Transkript ist erforderlich";
				return null;
			},
			password: (value) => {
				if (!value) return "Admin Passwort ist erforderlich";
				return null;
			},
		},
	});

	//TODO filtermöglichkeiten in sessions view

	async function mutateFunction(formValues: typeof form.values) {
		let audioFileBase64: string | undefined;
		let audioFileMimeType: string | undefined;
		try {
			if (formValues.audioFile) {
				audioFileBase64 = await fileToBase64(formValues.audioFile);
				audioFileMimeType = formValues.audioFile.type;
			}
		} catch (error) {
			logger.error(
				{ err: error },
				"Fehler beim Konvertieren der Audiodatei in Base64",
			);
		}

		mutation.mutate(
			{
				sessionId: session.id,
				password: formValues.password,
				data: {
					...formValues,
					audioFileBase64,
					audioFileMimeType,
					timestamp: new Date(formValues.timestamp),
					characterIds: formValues.characterIds.map((id) =>
						Number.parseInt(id, 10),
					),
					transcription: formValues.transcript,
					status: "valid",
				},
			},
			{
				onSuccess: async () => {
					await navigate({
						to: "/sessions/view/$sessionId",
						params: { sessionId: `${session.id}` },
					});
				},
			},
		);
	}

	const isLoading = mutation.status === "pending";

	function getErrorMessage() {
		if (mutation?.error?.data?.code === "UNAUTHORIZED") {
			return "Das angegebene Admin Passwort ist falsch.";
		}
		return "Beim Aktualisieren der Session ist ein unbekannter Fehler aufgetreten.";
	}

	return (
		<form onSubmit={form.onSubmit((values) => mutateFunction(values))}>
			{mutation.status === "error" && (
				<Alert
					title={`Fehler beim Aktualisieren der PenAndPaper Session: ${session.id}`}
					variant={"light"}
					color={"red"}
					icon={<IconAlertSquareRounded />}
				>
					{getErrorMessage()}
				</Alert>
			)}
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="md"
						p="md"
						radius="md"
						withBorder
						style={{ height: "100%" }}
					>
						<Title order={4} mb="sm">
							Allgemeine Informationen
						</Title>
						<Flex direction={"column"} gap={"sm"}>
							<Select
								withAsterisk
								label={"Framework"}
								disabled={isLoading}
								data={session.frameworkOptions.map((option) => {
									return { value: option, label: option };
								})}
								key={form.key("framework")}
								{...form.getInputProps("framework")}
							></Select>

							<DatePickerInput
								withAsterisk
								label={"Datum"}
								disabled={isLoading}
								key={form.key("timestamp")}
								{...form.getInputProps("timestamp")}
							></DatePickerInput>

							<TextInput
								withAsterisk
								label={"Session Name"}
								disabled={isLoading}
								key={form.key("sessionName")}
								{...form.getInputProps("sessionName")}
							></TextInput>

							<TextInput
								withAsterisk
								label={"Kampagne"}
								disabled={isLoading}
								key={form.key("campaign")}
								{...form.getInputProps("campaign")}
							></TextInput>
						</Flex>
					</Paper>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="md"
						p="md"
						radius="md"
						withBorder
						style={{ height: "100%" }}
					>
						<Title order={4} mb="sm">
							Zusammenfassungen
						</Title>
						<Flex direction={"column"} gap={"sm"}>
							<Textarea
								withAsterisk
								label={"Kurze Zusammenfassung"}
								resize="vertical"
								disabled={isLoading}
								autosize
								maxRows={3}
								key={form.key("summaryShort")}
								{...form.getInputProps("summaryShort")}
							></Textarea>

							<Textarea
								withAsterisk
								label={"Lange Zusammenfassung"}
								resize="vertical"
								disabled={isLoading}
								autosize
								maxRows={4}
								key={form.key("summaryLong")}
								{...form.getInputProps("summaryLong")}
							></Textarea>
						</Flex>
					</Paper>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="md"
						p="md"
						radius="md"
						withBorder
						style={{ height: "100%" }}
					>
						<Title order={4} mb="sm">
							Mitwirkende
						</Title>
						<Flex direction={"column"} gap={"sm"}>
							<Select
								withAsterisk
								label={"Dungeon Master"}
								disabled={isLoading}
								data={members.map((option) => {
									return { value: option.gameName, label: option.gameName };
								})}
								key={form.key("dmMemberGameName")}
								{...form.getInputProps("dmMemberGameName")}
							></Select>

							<MultiSelect
								withAsterisk
								label={"Charaktere"}
								disabled={isLoading}
								data={characters.map((option) => {
									return { value: `${option.id}`, label: option.name };
								})}
								key={form.key("characterIds")}
								{...form.getInputProps("characterIds")}
							></MultiSelect>
						</Flex>
					</Paper>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="md"
						p="md"
						radius="md"
						withBorder
						style={{ height: "100%" }}
					>
						<Flex direction={"column"} gap={"sm"}>
							<Group justify="space-between" align="center">
								<Title order={4} mb="sm">
									Charakterziele
								</Title>
								<Button
									disabled={isLoading}
									leftSection={<IconPlus size={16} />}
									variant="light"
									size="xs"
									onClick={() => form.insertListItem("goals", "")}
								>
									Ziel hinzufügen
								</Button>
							</Group>

							{form.values.goals.map((goal, index) => (
								<Group key={goal} align="center">
									<TextInput
										placeholder="Zielbeschreibung"
										style={{ flex: 1 }}
										{...form.getInputProps(`goals.${index}`)}
									/>
									<Button
										disabled={isLoading}
										color="red"
										variant="light"
										onClick={() => form.removeListItem("goals", index)}
									>
										<IconTrash size={16} />
									</Button>
								</Group>
							))}
						</Flex>
					</Paper>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="md"
						p="md"
						radius="md"
						withBorder
						style={{ height: "100%" }}
					>
						<Title order={4} mb="sm">
							Audio
						</Title>
						<FileInput
							label={"Audiodatei (optional)"}
							accept={"audio/*"}
							key={form.key("audioFile")}
							disabled={isLoading}
							{...form.getInputProps("audioFile")}
						/>
						<Textarea
							withAsterisk
							label={"Transkript"}
							resize="vertical"
							disabled={isLoading}
							autosize
							maxRows={4}
							key={form.key("transcript")}
							{...form.getInputProps("transcript")}
						></Textarea>
					</Paper>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 6 }}>
					<Paper
						shadow="md"
						p="md"
						radius="md"
						withBorder
						style={{ height: "100%" }}
					>
						<Flex direction={"column"} gap={"sm"}>
							<PasswordInput
								withAsterisk
								label={"Admin Passwort"}
								disabled={isLoading}
								key={form.key("password")}
								{...form.getInputProps("password")}
							></PasswordInput>

							<Group justify="flex-start">
								<Button type="submit" variant={"light"} loading={isLoading}>
									Aktualisieren
								</Button>

								<Button
									variant="light"
									color="gray"
									onClick={() =>
										navigate({
											to: "/sessions/view/$sessionId",
											params: { sessionId: `${session.id}` },
										})
									}
								>
									Abbrechen
								</Button>
							</Group>
						</Flex>
					</Paper>
				</Grid.Col>
			</Grid>
		</form>
	);
}
