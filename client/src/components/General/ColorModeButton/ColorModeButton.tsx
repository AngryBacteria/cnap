import {
	Button,
	Flex,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

interface Props {
	withLabel?: boolean;
}

export function ColorModeButton({ withLabel }: Props) {
	const computedColorScheme = useComputedColorScheme("dark");
	const { setColorScheme } = useMantineColorScheme();

	return (
		<Button
			size={"xs"}
			onClick={() =>
				setColorScheme(computedColorScheme === "light" ? "dark" : "light")
			}
		>
			<Flex direction={"row"} align={"center"} gap={"md"}>
				{withLabel && (
					<span>{computedColorScheme === "dark" ? "Light" : "Dark"}</span>
				)}
				{computedColorScheme === "dark" ? (
					<IconMoon size={20} />
				) : (
					<IconSun size={20} />
				)}
			</Flex>
		</Button>
	);
}
