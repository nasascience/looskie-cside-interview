import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { RepoInfo } from "../components/RepoInfo";
import { RepoSearchForm } from "../components/RepoSearchForm";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [repo, setRepo] = useState<{ owner: string; name: string } | null>(
		null,
	);

	console.log("RouteComponent");
	// Handle Form Search
	// const handleSearch = (input: string) => {
	// 	// Obtains values from the search input and set the state
	// 	const [owner, name] = input.split("/");
	// 	if (owner && name) setRepo({ owner, name });
	// };

	const handleSearch = useCallback((input: string) => {
		const [owner, name] = input.split("/");
		setRepo((prev) => {
			// Only update if values actually changed
			if (prev?.owner === owner && prev?.name === name) return prev;
			return owner && name ? { owner, name } : null;
		});
	}, []);
	return (
		<div className="max-w-xl mx-auto mt-10">
			<RepoSearchForm onSearch={handleSearch} />
			{repo && <RepoInfo owner={repo.owner} name={repo.name} />}
		</div>
	);
}
