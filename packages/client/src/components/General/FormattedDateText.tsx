import { Text, Tooltip } from "@mantine/core";
import { useMemo } from "react";
import {PRIMARY_COLOR} from "../../main.tsx";

interface Props {
	unixTimestamp: number;
}

export function FormattedDateText({ unixTimestamp }: Props) {
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "numeric",
		day: "numeric",
		month: "numeric",
		year: "numeric",
		hour12: false,
	}).format(new Date(unixTimestamp));

	const formattedTimeAgo = useMemo(() => {
		const rtf = new Intl.RelativeTimeFormat("en", {
			numeric: "auto",
			style: "long",
		});

		const diffTime = Math.abs(unixTimestamp - new Date().getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return rtf.format(-diffDays, "days");
	}, [unixTimestamp]);

	return (
		<Tooltip
			label={formattedDate}
			color={PRIMARY_COLOR}
			transitionProps={{ transition: "fade-down", duration: 300 }}
		>
			<Text c="dimmed">{formattedTimeAgo}</Text>
		</Tooltip>
	);
}
