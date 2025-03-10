import { Card, Flex, Image, Text, Title } from "@mantine/core";
import type { Outputs } from "../../../utils/trcp.ts";
import styles from "./MemberCard.module.css";

interface Props {
	member: Outputs["general"]["getMembers"][number];
}

//TODO: animations with motion
export function MemberCard({ member }: Props) {
	return (
		<Card shadow={"md"} withBorder padding={"xs"} className={styles.memberCard}>
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={"md"}
				align={"center"}
				justify={{ base: "center", md: "flex-start" }}
				wrap={"wrap"}
			>
				<Image
					h={125}
					w={125}
					src={`https://cnap.ch/static${member.pixelPictureURL}`}
					fallbackSrc={"https://cnap.ch/static/pixelPictures/unknown.png"}
				/>
				<Flex direction={"column"}>
					<Title order={2} ta={{ base: "center", md: "left" }}>
						{member.gameName}
					</Title>
					{member.punchline && (
						<Text c={"dimmed"} ta={{ base: "center", md: "left" }}>
							{member.punchline}
						</Text>
					)}
				</Flex>
			</Flex>
		</Card>
	);
}
