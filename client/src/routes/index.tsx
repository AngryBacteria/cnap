import { Flex, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<Flex direction={"column"} gap={"md"} className="p-2">
			<Text>Welcome Home!</Text>
		</Flex>
	);
}
