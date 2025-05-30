import { IssuesList } from "@/components/Issues";
import type { IIssuesSearch } from "@/interfaces/issuesSearch";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/issues")({
	component: IssuesListRoute,
});

function IssuesListRoute() {
	const { owner, name } = useSearch({ strict: false }) as IIssuesSearch;

	console.log(owner, name);
	return <IssuesList owner={owner} name={name} />;
}
