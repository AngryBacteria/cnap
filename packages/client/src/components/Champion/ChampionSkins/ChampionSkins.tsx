import { Carousel } from "@mantine/carousel";
import { Badge, Card, Image, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import type { Outputs } from "../../../utils/trcp.ts";
import styles from "./ChampionSkins.module.css";

interface Props {
	champion: Outputs["lol"]["getChampionById"];
}
export function ChampionSkins({ champion }: Props) {
	const [opened, { open, close }] = useDisclosure(false);
	const [focusedSkin, setFocusedSkin] = useState<
		undefined | Outputs["lol"]["getChampionById"]["skins"][number]
	>();

	function openSkinModal(
		skin: Outputs["lol"]["getChampionById"]["skins"][number],
	) {
		setFocusedSkin(skin);
		open();
	}

	return (
		<>
			<Card shadow={"md"} withBorder>
				<Title order={2} mb="sm">
					Skins
				</Title>

				<Carousel
					slideSize={{ sm: "50%", lg: "33.333333%", xl: "25%" }}
					slideGap={{ base: 0, sm: "sm" }}
					withIndicators
				>
					{champion.skins.map((skin) => {
						return (
							<Carousel.Slide key={skin.id}>
								<Image
									src={skin.splashPath}
									className={styles.carouselImage}
									onClick={() => openSkinModal(skin)}
								/>
							</Carousel.Slide>
						);
					})}
				</Carousel>
			</Card>

			{focusedSkin && (
				<Modal
					opened={opened}
					onClose={close}
					title={
						focusedSkin.name === champion.name ? "Base Skin" : focusedSkin.name
					}
					fullScreen
				>
					<section className={styles.modalWrapper}>
						<img
							className={styles.modalImage}
							src={focusedSkin.splashPath}
							alt={focusedSkin.name}
						/>
						<div className={styles.textWrapper}>
							<Text ta={"center"}>{focusedSkin.description}</Text>
							<Badge>{focusedSkin.rarity.toString().replace("k", "")}</Badge>
						</div>
					</section>
				</Modal>
			)}
		</>
	);
}
