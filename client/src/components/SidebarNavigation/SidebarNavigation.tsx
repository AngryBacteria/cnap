import { Divider } from "@mantine/core";
import { IconHelmet, IconHome, IconUser } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import styles from "./SidebarNavigation.module.css";

interface Props {
	onNavigate: () => void;
}

export function SidebarNavigation({ onNavigate }: Props) {
	return (
		<section className={styles.navigationItems}>
			<Link to={"/"} className={styles.navigationItem} onClick={onNavigate}>
				<IconHome />
				<span>Home</span>
			</Link>

			<Divider />

			<Link
				to={"/champions"}
				className={styles.navigationItem}
				onClick={onNavigate}
			>
				<IconHelmet />
				<span>Champions</span>
			</Link>

			<Link
				to={"/summoners"}
				className={styles.navigationItem}
				onClick={onNavigate}
			>
				<IconUser />
				<span>Summoners</span>
			</Link>
		</section>
	);
}
