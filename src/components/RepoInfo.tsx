import { useContributors } from "@/hooks/useContributors";
import { Link } from "@tanstack/react-router";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { RepoInfoQuery } from "../utils/relay/__generated__/RepoInfoQuery.graphql";

export function RepoInfo({ owner, name }: { owner: string; name: string }) {
	console.log("RepoInfo");
	const data = useLazyLoadQuery<RepoInfoQuery>(
		graphql`
		query RepoInfoQuery($owner: String!, $name: String!) {
			repository(owner: $owner, name: $name) {
				name
				description
				stargazerCount
				forkCount
				defaultBranchRef {
					name
					target {
						... on Commit {
							history {
								totalCount
							}
						}
					}
				}
				refs(refPrefix: "refs/heads/", first: 0) {
					totalCount
				}
				owner {
					login
					avatarUrl
				}
			}
		}`,
		{ owner, name },
	);

	if (!data.repository)
		return <div className="text-red-500">Repository not found.</div>;

	const { contributors, loading, error } = useContributors(owner, name);

	const repo = data.repository;

	return (
		<div className="border rounded p-4 bg-white shadow">
			<div className="flex items-center gap-3 mb-2">
				<img
					src={repo.owner.avatarUrl}
					alt={repo.owner.login}
					className="w-10 h-10 rounded-full"
				/>
				<div>
					<div className="font-bold text-lg">
						{repo.owner.login}/{repo.name}
					</div>
					<div className="text-gray-600">{repo.description}</div>
				</div>
			</div>
			<div className="flex gap-6 mt-2 text-sm">
				<span>⭐ {repo.stargazerCount} Stars</span>
				<span>🍴 {repo.forkCount} Forks</span>
				<span>🌿 {repo.refs?.totalCount} Branches</span>
				<span>
					📝 {repo.defaultBranchRef?.target?.history?.totalCount ?? 0} Commits
				</span>
			</div>
			<div className="mt-4">
				<div className="font-semibold mb-1">Contributors:</div>
				{loading && <div>Loading contributors...</div>}
				{error && <div className="text-red-500">{error}</div>}
				<div className="flex flex-wrap gap-2">
					{contributors.map((contributor) => (
						<img
							key={contributor.id}
							src={contributor.avatar_url}
							alt={contributor.login}
							title={contributor.login}
							className="w-8 h-8 rounded-full border"
						/>
					))}
				</div>
			</div>

			<div className="mt-6">
				{
					<Link
						to="/issues"
						search={{ owner, name } as any}
						className="text-blue-600 underline hover:text-blue-800"
					>
						View Issues
					</Link>
				}
			</div>
		</div>
	);
}
