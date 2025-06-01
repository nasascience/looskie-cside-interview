import { ISSUES_INITIAL } from "@/graphql/queries/issuesInitial.query";
import { ISSUES_PAGINATION_FRAGMENT } from "@/graphql/queries/issuesPaginationFragment.query";
import type { IssuesQuery } from "@/utils/relay/__generated__/IssuesQuery.graphql";
import { BookmarkIcon, HomeIcon } from "@radix-ui/react-icons";
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
import { Suspense } from "react";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { IssuesComments } from "../Comments/Comments";

export function IssuesList({ owner, name }: { owner: string; name: string }) {
	// Sets initial Data Load
	const initialQueryData = useLazyLoadQuery<IssuesQuery>(ISSUES_INITIAL, {
		owner,
		name,
	});

	// Validates initial data
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

	// Set up pagination on the fragment
	const { data, loadNext, isLoadingNext } = usePaginationFragment<
		IssuesQuery,
		any
	>(ISSUES_PAGINATION_FRAGMENT, initialQueryData.repository);

	// Obtain all issues from the data
	const issues = data?.issues.edges ?? [];

	return (
		<>
			<Box className="max-w-3xl mx-auto p-4">
				<Flex justify="end">
					<Link href="/">
						<HomeIcon className="w-5 h-5 mr-5" />
					</Link>
				</Flex>

				<Heading as="h1" size="5" mb="4" align="center">
					GitHub Issues for {owner}/{initialQueryData?.repository?.name}
				</Heading>

				{issues.length === 0 ? (
					<Flex justify="center" align="center">
						<Text>No issues found.</Text>
					</Flex>
				) : (
					<Flex direction="column" gap="4">
						{issues.map((issue) => (
							<Card key={`${issue.node?.id}`} variant="surface">
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

									<Flex justify="between" gap="3" align="start">
										{issue.node?.author && (
											<Flex align="center" gap="2">
												<Text size="1">
													Opened by:&nbsp;
													<Link
														href={`https://github.com/${issue.node.author.login}`}
														target="_blank"
													>
														@{issue.node.author.login}
													</Link>
													&nbsp;
													{formatDistanceToNow(new Date(issue.node.createdAt), {
														addSuffix: true,
													})}
												</Text>
												<Flex align="center" gap="1">
													<BookmarkIcon className="w-4 h-4" />
													<Text size="1">{issue.node.labels.totalCount}</Text>
												</Flex>
											</Flex>
										)}
										{issue.node?.state === "CLOSED" && (
											<Badge color="gray" variant="soft">
												Closed
											</Badge>
										)}
									</Flex>
								</Flex>
								<Suspense
									fallback={
										<div className="flex items-center justify-center min-h-[30px]">
											<Spinner size="2" />
										</div>
									}
								>
									<IssuesComments
										owner={owner}
										name={name}
										issueNumber={issue.node.number}
									/>
								</Suspense>
							</Card>
						))}
					</Flex>
				)}

				<br />

				<Flex direction="column" gap="4">
					{data?.issues?.pageInfo.hasNextPage && (
						<Button
							onClick={() => loadNext(10)}
							disabled={isLoadingNext || !data?.issues?.pageInfo.hasNextPage}
						>
							Load More
						</Button>
					)}
				</Flex>

				{isLoadingNext && <Spinner className="spinner" size="3" />}
			</Box>
		</>
	);
}
