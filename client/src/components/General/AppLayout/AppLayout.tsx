import { AppShell, Burger, Divider, Flex, Image, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHelmet, IconHome, IconUser } from "@tabler/icons-react";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ColorModeButton } from "../ColorModeButton/ColorModeButton.tsx";
import { NavigationButton } from "../NavigationButton/NavigationButton.tsx";

export function AppLayout() {
	const [opened, { toggle }] = useDisclosure();

	return (
		<>
			<AppShell
				header={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { desktop: true, mobile: !opened },
				}}
				padding="md"
			>
				<AppShell.Header>
					<Flex h="100%" px="md" direction="row" align="center">
						<Flex
							hiddenFrom="sm"
							justify="space-between"
							w={"100%"}
							align={"center"}
						>
							<Burger opened={opened} onClick={toggle} size="sm" />
							<Flex
								direction={"row"}
								gap={"md"}
								justify={"center"}
								align={"center"}
							>
								<Image src="/cnap_flag.png" h={30} w={"auto"} radius={"50%"} />
								<Title order={1}>CnAP</Title>
							</Flex>
						</Flex>

						<Flex visibleFrom={"sm"} justify="space-between" w={"100%"}>
							<Flex
								direction={"row"}
								gap={"md"}
								justify={"center"}
								align={"center"}
							>
								<Image src="/cnap_flag.png" h={30} w={"auto"} radius={"50%"} />
								<Title order={1}>CnAP</Title>
							</Flex>
							<Flex gap={"xl"} align={"center"}>
								<NavigationButton to={"/"} label={"Home"} icon={<IconHome />} />
								<NavigationButton
									to={"/champions"}
									label={"Champions"}
									icon={<IconHelmet />}
								/>
								<NavigationButton
									to={"/summoners"}
									label={"Summoners"}
									icon={<IconUser />}
								/>
								<ColorModeButton />
							</Flex>
						</Flex>
					</Flex>
				</AppShell.Header>

				<AppShell.Navbar>
					<Flex gap={"md"} p={"md"} direction={"column"}>
						<NavigationButton to={"/"} label={"Home"} icon={<IconHome />} />
						<NavigationButton
							to={"/champions"}
							label={"Champions"}
							icon={<IconHelmet />}
						/>
						<NavigationButton
							to={"/summoners"}
							label={"Summoners"}
							icon={<IconUser />}
						/>

						<Divider />

						<ColorModeButton withLabel={true} />
					</Flex>
				</AppShell.Navbar>

				<AppShell.Main>
					<Outlet />
				</AppShell.Main>
			</AppShell>
			<TanStackRouterDevtools />
		</>
	);
}
