import { REPO_INFO_QUERY } from "@/graphql/queries/repoInfo.query";
import { useContributors } from "@/hooks/useContributors";
import { DiscIcon } from "@radix-ui/react-icons";
import { Avatar, Box, Button, Flex, Text, Tooltip } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { useLazyLoadQuery } from "react-relay";
import type { RepoInfoQuery } from "../../utils/relay/__generated__/RepoInfoQuery.graphql";
import styles from "./repoInfo.module.css";

export function RepoInfo({ owner, name }: { owner: string; name: string }) {
	// Validates owner and name
	if (!owner || !name)
		return <div className="text-red-500">Invalid repository.</div>;

	// Fetches repository info
	const data = useLazyLoadQuery<RepoInfoQuery>(REPO_INFO_QUERY, {
		owner,
		name,
	});

	// If repository is not found, return error message
	if (!data?.repository)
		return <div className="text-red-500">Repository not found.</div>;

	// Gets all contributors from REST api due to performance
	const { contributors, loading, error } = useContributors(owner, name);

	const repo = data.repository;

	return (
		<Box className={styles.card} style={{ borderRadius: "var(--radius-2)" }}>
			<Flex gap="3" align="center" mb="2">
				<Avatar
					src={repo.owner.avatarUrl}
					alt={repo.owner.login}
					fallback={repo.owner.login.charAt(0)}
					size="2"
					radius="full"
				/>
				<Box>
					<Text as="div" size="3" weight="bold">
						{repo.owner.login}/{repo.name}
					</Text>
					<Text as="div" size="2" color="gray">
						{repo.description}
					</Text>
				</Box>
			</Flex>
			<Flex
				gap="3"
				mt="2"
				align="center"
				wrap="wrap"
				style={{ fontSize: "var(--font-size-2)" }}
			>
				<Text>⭐ {repo.stargazerCount} Stars</Text>
				<Text>🍴 {repo.forkCount} Forks</Text>
				<Text>🌿 {repo.refs?.totalCount} Branches</Text>
				<Text>
					📝 {repo.defaultBranchRef?.target?.history?.totalCount ?? 0} Commits
				</Text>
			</Flex>
			<Box mt="4">
				<Text as="div" size="2" weight="medium" mb="1">
					Contributors:
				</Text>
				{loading && <Text>Loading contributors...</Text>}
				{error && <Text color="red">{error}</Text>}
				<Flex gap="2" wrap="wrap">
					{contributors?.map((contributor) => (
						<Tooltip key={contributor.id} content={contributor.login}>
							<a
								href={`https://github.com/${contributor.login}`}
								target="_blank"
							>
								<Avatar
									src={contributor.avatar_url}
									fallback={contributor.login.charAt(0)}
									size="1"
									radius="full"
									style={{ border: "1px solid var(--gray-5)" }}
								/>
							</a>
						</Tooltip>
					))}
				</Flex>
			</Box>
			<Box mt="6">
				<Link to="/issues" search={{ owner, name } as any}>
					<Button variant="soft">
						<DiscIcon /> View Issues
					</Button>
				</Link>
			</Box>
		</Box>
	);
}
