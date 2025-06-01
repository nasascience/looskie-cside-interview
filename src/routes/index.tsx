import { createFileRoute } from "@tanstack/react-router";
import { RepoSearchForm } from "../components/RepoSearchForm/RepoSearchForm";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-xl mx-auto mt-10">
			<RepoSearchForm />
		</div>
	);
}
