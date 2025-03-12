import { Card, Flex, Image, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Outputs } from "../../../utils/trcp.ts";
import styles from "./MemberCard.module.css";

interface Props {
	member: Outputs["general"]["getMembers"][number];
}

export function MemberCard({ member }: Props) {
	const memberPuuid = member.leagueSummoners[0]?.puuid;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.25 }}
			className={styles.memberCard}
		>
			<Card
				className={styles.memberCard}
				shadow={"md"}
				withBorder
				padding={"xs"}
			>
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
						<Image
							src={`https://cnap.ch/static${member.profilePictureURL}`}
							fallbackSrc={"https://cnap.ch/static/profilePictures/unknown.png"}
							className={styles.memberImage}
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

					<Flex
						direction={{ base: "row", md: "column" }}
						gap={"md"}
						align={"center"}
						justify={{ base: "center", md: "flex-end" }}
					>
						{memberPuuid && (
							<Link
								to={"/summoners/$summonerPuuid"}
								params={{ summonerPuuid: memberPuuid }}
							>
								<Image src={"./lol_logo.svg"} h={50} w={50} />
							</Link>
						)}
					</Flex>
				</Flex>
			</Card>
		</motion.div>
	);
}
