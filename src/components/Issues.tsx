import type { IssuesQuery } from "@/utils/relay/__generated__/IssuesQuery.graphql";
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Link,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { IssuesComments } from "./IssuesComments";
import styles from "./issues.module.css";

export function IssuesList({ owner, name }: { owner: string; name: string }) {
	console.log(owner, name);

	const initialQueryData = useLazyLoadQuery<IssuesQuery>(
		graphql`
      query IssuesQuery($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          ...IssuesList_repository
          name
          description
        }
      }
    `,
		{ owner, name },
	);

	if (!initialQueryData.repository) {
		return (
			<Box className="max-w-3xl mx-auto p-4">
				<Heading as="h1" size="5" mb="4" align="center">
					GitHub Issues
				</Heading>
				<Text color="red">
					Repository not found for {owner}/{name}.
				</Text>
			</Box>
		);
	}

	//Set up pagination on the fragment
	const { data, loadNext, isLoadingNext } = usePaginationFragment<any, any>(
		graphql`
      fragment IssuesList_repository on Repository
      @refetchable(queryName: "IssuesListPaginationQuery")
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
      ) {
        issues(
          first: $count
          after: $cursor
          orderBy: { field: CREATED_AT, direction: DESC }
        ) @connection(key: "IssuesList_issues") {
          edges {
            node {
              id
              number
              title
              createdAt
              state
              author {
                login
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
		initialQueryData.repository,
	);

	//  Safely access issues
	if (!data) {
		return <div className="text-red-500">Repository not found.</div>;
	}

	console.log("data issues", data);
	const issues = data.issues.edges ?? [];

	if (!issues) return <div className="text-red-500">No issues found.</div>;

	console.log("issues", issues);
	// 5. Render the UI
	return (
		<Box className="max-w-3xl mx-auto p-4">
			<Heading as="h1" size="5" mb="4" align="center">
				GitHub Issues for {owner}/{initialQueryData?.repository?.name}
			</Heading>

			{issues.length === 0 ? (
				<Text>No issues found.</Text>
			) : (
				<Flex direction="column" gap="4">
					{issues.map((issue) => (
						<Card key={issue.node?.number} variant="surface">
							<Flex direction="column" gap="2">
								<Flex justify="between" align="center">
									<Flex gap="2" align="center">
										<Badge
											color={issue.node?.state === "OPEN" ? "green" : "red"}
										>
											#{issue.node?.number}
										</Badge>
										<Text weight="bold">{issue.node?.title}</Text>
									</Flex>
								</Flex>

								<Flex justify="between" gap="2" align="start">
									{issue.node?.author && (
										<Text size="1">
											Opened by:{" "}
											<Link
												href={`https://github.com/${issue.node.author.login}`}
												target="_blank"
												className="text-blue-600 hover:underline"
											>
												@{issue.node.author.login}
											</Link>{" "}
											{formatDistanceToNow(new Date(issue.node.createdAt), {
												addSuffix: true,
											})}
										</Text>
									)}

									{issue.node?.state === "CLOSED" && (
										<Badge color="gray" variant="soft">
											Closed
										</Badge>
									)}
								</Flex>
							</Flex>

							<IssuesComments
								owner={owner}
								name={name}
								issueNumber={issue.node.number}
							/>
						</Card>
					))}
				</Flex>
			)}

			<br />
			<Flex direction="column" gap="4">
				<Button
					onClick={() => loadNext(10)}
					disabled={isLoadingNext || !data?.issues?.pageInfo.hasNextPage}
				>
					{" "}
					Load More
				</Button>
			</Flex>
			{isLoadingNext && <Spinner className={styles.spinner} size="3" />}
		</Box>
	);
}
