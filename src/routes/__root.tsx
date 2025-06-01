import { Theme } from "@radix-ui/themes";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RelayEnvironmentProvider } from "react-relay";
import relayEnvironment from "../utils/relay/environment";

export const Route = createRootRouteWithContext<{
	relayEnvironment: typeof relayEnvironment;
}>()({
	component: () => (
		<RelayEnvironmentProvider environment={relayEnvironment}>
			<Theme appearance="dark">
				<Outlet />
				<TanStackRouterDevtools />
				<img
					className="bgImage"
					src="https://media.daily.dev/image/upload/v1694596741/Glow_o9ehvn.svg"
					alt="Gradient background"
				></img>
			</Theme>
		</RelayEnvironmentProvider>
	),
});
