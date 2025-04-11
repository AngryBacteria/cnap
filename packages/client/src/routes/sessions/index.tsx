import { Alert, Badge, Card, Flex, Loader, Text, Title } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { FormattedDateText } from "../../components/General/FormattedDateText.tsx";
import { usePenAndPaperSessions } from "../../hooks/api/usePenAndPaperSessions.ts";
import { PRIMARY_COLOR } from "../../main.tsx";
import { truncateText } from "../../utils/GeneralUtil.ts";
import styles from "./index.module.css";

export const Route = createFileRoute("/sessions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const query = usePenAndPaperSessions();

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
			{query.data?.map((session) => (
				<motion.div
					layout
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{
						duration: 0.25,
					}}
					className={"fillSpace"}
					key={session._id}
				>
					<Link
						to={"/sessions/$sessionObjectId"}
						params={{ sessionObjectId: session._id || "" }}
						className={styles.navigationItem}
					>
						<Card shadow={"md"} withBorder className={"fillSpacePointer"}>
							<Flex direction={"column"} gap={"md"}>
								<Flex
									wrap={"wrap"}
									direction={"row"}
									align={"center"}
									gap={"md"}
								>
									<Title order={2}>{session.sessionName}</Title>
									<FormattedDateText unixTimestamp={session.timestamp} />
									<Badge color={PRIMARY_COLOR}>{session.framework}</Badge>
								</Flex>
								<Text hiddenFrom={"sm"}>
									{truncateText(session.summaryShort, 500)}
								</Text>
								<Text visibleFrom={"sm"}>{session.summaryShort}</Text>
							</Flex>
						</Card>
					</Link>
				</motion.div>
			))}
		</Flex>
	);
}
