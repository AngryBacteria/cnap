import {
	AppShell,
	Burger,
	Button,
	Group,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SidebarNavigation } from "../components/SidebarNavigation/SidebarNavigation.tsx";

export const Route = createRootRoute({
	component: () => {
		const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
		const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
		const computedColorScheme = useComputedColorScheme("dark");
		const { setColorScheme } = useMantineColorScheme();

		function onNavigate() {
			if (mobileOpened) {
				toggleMobile();
			}
		}

		return (
			<>
				<AppShell
					header={{ height: 60 }}
					navbar={{
						width: { base: 150, sm: 200, md: 300 },
						breakpoint: "sm",
						collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
					}}
					padding="md"
				>
					<AppShell.Header>
						<Group h="100%" px="md" justify="space-between">
							<Burger
								opened={mobileOpened}
								onClick={toggleMobile}
								hiddenFrom="sm"
								size="sm"
							/>
							<Burger
								opened={desktopOpened}
								onClick={toggleDesktop}
								visibleFrom="sm"
								size="sm"
							/>
							<Button
								size={"xs"}
								onClick={() =>
									setColorScheme(
										computedColorScheme === "light" ? "dark" : "light",
									)
								}
							>
								{computedColorScheme === "dark" ? (
									<IconMoon size={20} />
								) : (
									<IconSun size={20} />
								)}
							</Button>
						</Group>
					</AppShell.Header>
					<AppShell.Navbar p="md">
						<SidebarNavigation onNavigate={onNavigate} />
					</AppShell.Navbar>
					<AppShell.Main>
						<Outlet />
					</AppShell.Main>
				</AppShell>
				<TanStackRouterDevtools />
			</>
		);
	},
});
