import {
	Alert,
	Button,
	FileInput,
	Flex,
	Loader,
	Select,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import logger from "../../../../../server/src/helpers/Logger.ts";
import { useMutateSession } from "../../../hooks/api/useMutateSession.ts";
import { usePenAndPaperSession } from "../../../hooks/api/usePenAndPaperSession.ts";
import { fileToBase64 } from "../../../utils/GeneralUtil.ts";
import type { Outputs } from "../../../utils/trcp.ts";

export const Route = createFileRoute("/sessions/edit/$sessionId")({
	component: SessionEditViewWrapper,
});

function SessionEditViewWrapper() {
	const sessionId = Route.useParams().sessionId;
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

	return <SessionEditView session={query.data} />;
}

interface Props {
	session: Outputs["penAndPaper"]["getSession"];
}

function SessionEditView({ session }: Props) {
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
			password: "",
			audioFile: null as File | null,
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
			password: (value) => {
				if (!value) return "Admin Passwort ist erforderlich";
				return null;
			},
		},
	});

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

		await mutation.mutateAsync({
			sessionId: session.id,
			password: formValues.password,
			data: {
				...formValues,
				audioFileBase64,
				audioFileMimeType,
				timestamp: new Date(formValues.timestamp),
			},
		});
		await navigate({
			to: "/sessions/view/$sessionId",
			params: { sessionId: `${session.id}` },
		});
	}

	const isLoading = mutation.status === "pending";

	function getErrorMessage() {
		if (mutation?.error?.data?.code === "UNAUTHORIZED") {
			return "Das angegebene Admin Passwort ist falsch.";
		}
		return "Beim Aktualisieren der Session ist ein unbekannter Fehler aufgetreten.";
	}

	//TODO editing of dm
	//TODO goals
	//TODO editing of players

	return (
		<form onSubmit={form.onSubmit((values) => mutateFunction(values))}>
			<Flex direction={"column"} gap={"md"}>
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

				<Title order={1}>{session.sessionName}</Title>

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
				</Flex>

				<Flex direction={"column"} gap={"sm"}>
					<DatePickerInput
						withAsterisk
						label={"Datum"}
						disabled={isLoading}
						key={form.key("timestamp")}
						{...form.getInputProps("timestamp")}
					></DatePickerInput>
				</Flex>

				<Flex direction={"column"} gap={"sm"}>
					<TextInput
						withAsterisk
						label={"Session Name"}
						disabled={isLoading}
						key={form.key("sessionName")}
						{...form.getInputProps("sessionName")}
					></TextInput>
				</Flex>

				<Flex direction={"column"} gap={"sm"}>
					<TextInput
						withAsterisk
						label={"Kampagne"}
						disabled={isLoading}
						key={form.key("campaign")}
						{...form.getInputProps("campaign")}
					></TextInput>
				</Flex>

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
				</Flex>

				<Flex direction={"column"} gap={"sm"}>
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

				<Flex direction={"column"} gap={"sm"}>
					<TextInput
						withAsterisk
						label={"Admin Passwort"}
						type="password"
						disabled={isLoading}
						key={form.key("password")}
						{...form.getInputProps("password")}
					></TextInput>
				</Flex>

				<Flex direction={"column"} gap={"sm"}>
					<Title order={2}>Datei Upload (optional)</Title>
					<FileInput
						accept={"audio/*"}
						placeholder="Wähle eine Datei aus"
						key={form.key("audioFile")}
						disabled={isLoading}
						{...form.getInputProps("audioFile")}
					/>
				</Flex>

				<Button loading={isLoading} type="submit">
					Aktualisieren
				</Button>
			</Flex>
		</form>
	);
}
