import { useContributors } from "@/hooks/useContributors";
import { Link } from "@tanstack/react-router";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { RepoInfoQuery } from "../utils/relay/__generated__/RepoInfoQuery.graphql";
import { Avatar, Box, Button, Flex, Text } from "@radix-ui/themes";
import styles from "./repoInfo.module.css";
import { DiscIcon } from "@radix-ui/react-icons";

export function RepoInfo({ owner, name }: { owner: string; name: string }) {
	console.log(owner, name);
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
      <Flex gap="6" mt="2" align="center" wrap="wrap" style={{ fontSize: "var(--font-size-2)" }}>
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
          {contributors.map((contributor) => (
            <Avatar
              key={contributor.id}
              src={contributor.avatar_url}
              fallback={contributor.login.charAt(0)}
              size="1"
              radius="full"
              style={{ border: "1px solid var(--gray-5)" }}
            />
          ))}
        </Flex>
      </Box>
      <Box mt="6">
	

        <Link
          to="/issues"
          search={{ owner, name } as any}
        >
         	<Button variant="soft"><DiscIcon /> View Issues</Button>
        </Link>
      </Box>
    </Box>
	);
}
