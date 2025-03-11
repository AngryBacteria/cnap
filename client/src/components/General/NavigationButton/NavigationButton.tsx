import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import styles from "./NavigationButton.module.css";

interface Props {
	to: string;
	label: string;
	icon?: ReactNode;
}

export function NavigationButton({ to, label, icon }: Props) {
	return (
		<Link to={to} className={styles.navigationItem}>
			{icon && icon}
			<span>{label}</span>
		</Link>
	);
}
