import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import styles from "./NavigationButton.module.css";

interface Props {
	to: string;
	label: string;
	icon?: ReactNode;
	onClick?: () => void;
}

export function NavigationButton({ to, label, icon, onClick }: Props) {
	return (
		<Link to={to} className={styles.navigationItem} onClick={onClick}>
			{icon && icon}
			<span>{label}</span>
		</Link>
	);
}
