import { createRootRoute } from "@tanstack/react-router";

import { AppLayout } from "../components/General/AppLayout/AppLayout.tsx";

export const Route = createRootRoute({
	component: AppLayout,
});
