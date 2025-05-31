import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { RepoInfo } from "../components/RepoInfo";
import { RepoSearchForm } from "../components/RepoSearchForm";
import type { IIssuesSearch } from "@/interfaces/issuesSearch";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-xl mx-auto mt-10">
			<RepoSearchForm  />
		</div>
	);
}
