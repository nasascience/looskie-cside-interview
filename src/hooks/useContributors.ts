import type { IContributors } from "@/interfaces/contributors";
import { fetchContributors } from "@/services/github";
import { useEffect, useState } from "react";

export function useContributors(owner: string, repo: string) {
	const [contributors, setContributors] = useState<IContributors[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Gets contributors
	useEffect(() => {
		setLoading(true);
		setError(null);
		fetchContributors(owner, repo)
			.then(setContributors)
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, [owner, repo]);

	return { contributors, loading, error };
}
