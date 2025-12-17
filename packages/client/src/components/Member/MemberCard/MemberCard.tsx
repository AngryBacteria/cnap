import { Card, Flex, Image, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { Outputs } from "../../../utils/trcp.ts";
import styles from "./MemberCard.module.css";

interface Props {
	member: Outputs["general"]["getMembers"][number];
}

export function MemberCard({ member }: Props) {
	const summonerNameTag = `${member.leagueSummoners[0]?.gameName}-${member.leagueSummoners[0]?.tagLine}`;

	return (
		<Card className={styles.memberCard} shadow={"md"} withBorder padding={"xs"}>
			<Flex
				direction={{ base: "column", md: "row" }}
				justify={{ base: "center", md: "space-between" }}
				align={"center"}
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					gap={"md"}
					align={"center"}
					justify={{ base: "center", md: "flex-start" }}
					wrap={"wrap"}
				>
					{member.profilePictureBase64 && member.profilePictureMimeType ? (
						<Image
							src={`data:${member.profilePictureMimeType};base64,${member.profilePictureBase64}`}
							className={styles.memberImage}
						/>
					) : (
						<div className={styles.memberImage} />
					)}

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

				<Flex
					direction={{ base: "row", md: "column" }}
					gap={"md"}
					align={"center"}
					justify={{ base: "center", md: "flex-end" }}
				>
					{summonerNameTag && (
						<Link
							to={"/summoners/$summonerNameTag"}
							params={{ summonerNameTag: summonerNameTag }}
						>
							<Image src={"./lol_logo.svg"} h={50} w={50} />
						</Link>
					)}
				</Flex>
			</Flex>
		</Card>
	);
}
