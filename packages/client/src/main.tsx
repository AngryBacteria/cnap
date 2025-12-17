import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Global styles
import "./assets/main.css";

export const PRIMARY_COLOR = "red";

// Mantine theme
const theme = createTheme({
	primaryColor: PRIMARY_COLOR,
});

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./utils/trcp.ts";

// Create a new router instance
const router = createRouter({ routeTree, defaultPendingMinMs: 0 });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
	<StrictMode>
		<MantineProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</MantineProvider>
	</StrictMode>,
);
