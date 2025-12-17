import {
	Alert,
	Autocomplete,
	Button,
	Flex,
	Modal,
	PasswordInput,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateCharacter } from "../../hooks/api/useCreateCharacter";
import { useMembers } from "../../hooks/api/useMembers";

interface Props {
	opened: boolean;
	onClose: () => void;
}

export function CreateCharacterModal({ opened, onClose }: Props) {
	const mutation = useCreateCharacter();
	const membersQuery = useMembers(true);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			password: "",
			memberGameName: membersQuery.data?.[0]?.gameName || "",
			characterName: "",
		},

		validate: {
			password: (value) => {
				if (!value) return "Admin Passwort ist erforderlich";
				return null;
			},
			characterName: (value) => {
				if (!value) return "Charakter Name ist erforderlich";
				return null;
			},
			memberGameName: (value) => {
				if (!value) return "Member Name ist erforderlich";
				return null;
			},
		},
	});

	async function mutateFunction(formValues: typeof form.values) {
		mutation.mutate(
			{
				password: formValues.password,
				memberGameName: formValues.memberGameName,
				name: formValues.characterName,
			},
			{
				onSuccess: () => {
					onClose();
					form.reset();
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
		return "Beim Erstellen des Charakters ist ein unbekannter Fehler aufgetreten.";
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
					<Autocomplete
						withAsterisk
						label={"Member Name"}
						disabled={isLoading}
						placeholder="Member suchen..."
						data={(membersQuery.data ?? []).map((option) => option.gameName)}
						key={form.key("memberGameName")}
						{...form.getInputProps("memberGameName")}
					/>
					<TextInput
						withAsterisk
						label={"Charakter Name"}
						disabled={isLoading}
						key={form.key("characterName")}
						{...form.getInputProps("characterName")}
					></TextInput>
					<Button type="submit" variant={"light"} loading={isLoading}>
						Erstellen
					</Button>
				</Flex>
			</form>
		</Modal>
	);
}
