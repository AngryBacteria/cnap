import {
	Alert,
	Button,
	Flex,
	Modal,
	PasswordInput,
	Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "@tanstack/react-router";
import { useCreateEmptySession } from "../../hooks/api/useCreateEmptySession";
import { useMembers } from "../../hooks/api/useMembers";

interface Props {
	opened: boolean;
	onClose: () => void;
}

export function CreateEmptySessionModal({ opened, onClose }: Props) {
	const navigate = useNavigate();
	const mutation = useCreateEmptySession();
	const membersQuery = useMembers(true);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			password: "",
			dmMemberGameName: membersQuery.data?.[0]?.gameName || "",
		},

		validate: {
			password: (value) => {
				if (!value) return "Admin Passwort ist erforderlich";
				return null;
			},
			dmMemberGameName: (value) => {
				if (!value) return "Spielleiter Name ist erforderlich";
				return null;
			},
		},
	});

	async function mutateFunction(formValues: typeof form.values) {
		mutation.mutate(
			{
				password: formValues.password,
				dmMemberGameName: formValues.dmMemberGameName,
			},
			{
				onSuccess: (data) => {
					onClose();
					form.reset();
					navigate({
						to: "/sessions/edit/$sessionId",
						params: { sessionId: `${data}` },
					});
				},
			},
		);
	}

	const isLoading =
		mutation.status === "pending" || membersQuery.status === "pending";
	function getErrorMessage() {
		if (mutation?.error?.data?.code === "UNAUTHORIZED") {
			return "Das angegebene Admin Passwort ist falsch.";
		}
		if (membersQuery.error) {
			return "Fehler beim Laden der Member Daten. Bitte Seite neu laden und erneut versuchen.";
		}
		return "Beim Erstellen der Session ist ein unbekannter Fehler aufgetreten.";
	}

	return (
		<Modal
			opened={opened}
			onClose={() => {
				form.reset();
				onClose();
			}}
			title="Neue Session erstellen"
			centered
		>
			<form onSubmit={form.onSubmit((values) => mutateFunction(values))}>
				<Flex direction={"column"} gap={"md"}>
					{(mutation.error || membersQuery.error) && (
						<Alert title="Fehler" color="red" variant="light">
							{getErrorMessage()}
						</Alert>
					)}
					<PasswordInput
						withAsterisk
						label={"Admin Passwort"}
						disabled={isLoading}
						key={form.key("password")}
						{...form.getInputProps("password")}
					></PasswordInput>
					<Select
						withAsterisk
						label={"Dungeon Master"}
						disabled={isLoading}
						data={(membersQuery.data ?? []).map((option) => {
							return { value: option.gameName, label: option.gameName };
						})}
						key={form.key("dmMemberGameName")}
						{...form.getInputProps("dmMemberGameName")}
					></Select>
					<Button type="submit" variant={"light"} loading={isLoading}>
						Erstellen
					</Button>
				</Flex>
			</form>
		</Modal>
	);
}
