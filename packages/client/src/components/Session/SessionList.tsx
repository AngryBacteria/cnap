import { Badge, Card, Flex, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { PRIMARY_COLOR } from "../../main";
import { truncateText } from "../../utils/GeneralUtil";
import type { Outputs } from "../../utils/trcp";
import { FormattedDateText } from "../General/FormattedDateText";

interface Props {
	sessions: Outputs["penAndPaper"]["getSessions"];
}

export function SessionList({ sessions }: Props) {
	return (
		<>
			{sessions.map((session) => (
				<div className={"fillSpace"} key={session.id}>
					<Link
						to={"/sessions/view/$sessionId"}
						params={{ sessionId: `${session.id}` }}
						style={{
							color: "inherit",
							textDecoration: "none",
						}}
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
		</>
	);
}
