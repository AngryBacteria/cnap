import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Mantine theme
const theme = createTheme({
	primaryColor: "teal",
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 60 * 1000, // 1 hour,
			retry: 2,
		},
	},
});

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

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
