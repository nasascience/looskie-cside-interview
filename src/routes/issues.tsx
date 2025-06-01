import { IssuesList } from "@/components/Issues/Issues";
import type { IIssuesSearch } from "@/interfaces/issuesSearch";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/issues")({
	component: IssuesListRoute,
});

function IssuesListRoute() {
	// Extracts the owner and name from the search parameters
	const { owner, name } = useSearch({ strict: false }) as IIssuesSearch;

	return <IssuesList owner={owner} name={name} />;
}
