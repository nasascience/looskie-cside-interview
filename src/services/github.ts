import type { IContributors } from "@/interfaces/contributors";

const GITHUB_URL = "https://api.github.com";

export async function fetchContributors(
	owner: string,
	repo: string,
): Promise<IContributors[]> {
	const url = `${GITHUB_URL}/repos/${owner}/${repo}/contributors`;
	const headers: Record<string, string> = {};
	headers.Authorization = `Bearer ${import.meta.env.VITE_GH_TOKEN}`;
	const res = await fetch(url, { headers });
	if (!res.ok)
		throw new Error(
			`Failed to fetch contributors: ${res.status} - ${res.statusText}`,
		);
	return res.json() as Promise<IContributors[]>;
}
