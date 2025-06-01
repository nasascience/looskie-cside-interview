import { INITIAL_ISSUES_COMMENTS_QUERY } from "@/graphql/queries/commentsInitial.query";
import { COMMENTS_PAGINATION_FRAGMENT } from "@/graphql/queries/commentsPaginationFragment.query";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Link, Spinner, Text } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import styles from "./comments.module.css";
export function IssuesComments({
	owner,
	name,
	issueNumber,
}: { owner: string; name: string; issueNumber: number }) {
	// Sets initial Data Load
	const initialQueryData = useLazyLoadQuery<any>(
		INITIAL_ISSUES_COMMENTS_QUERY,
		{ owner, name, issueNumber },
	);

	// Set up pagination on the fragment
	const { data, loadNext, isLoadingNext } = usePaginationFragment(
		COMMENTS_PAGINATION_FRAGMENT,
		initialQueryData.repository,
	);

	const comments = data?.issue?.comments?.edges ?? [];

	// If no comments found, return message
	if (!comments) return <div className="text-red-500">No comments found.</div>;

	return (
		<>
			{comments.length > 0 && (
				<Box className="max-w-3xl mx-auto p-4" position="relative">
					<Accordion
						className={styles.AccordionRoot}
						type="single"
						defaultValue={undefined}
						collapsible
					>
						<AccordionItem className={styles.AccordionItem} value="item-1">
							<AccordionTrigger className={styles.AccordionTrigger}>
								<Flex align="start" gap="2">
									<ChatBubbleIcon width="16" height="16" />
									<span className={styles.AccordionTriggerText}>
										Comments ({comments.length})
									</span>
								</Flex>
							</AccordionTrigger>

							<AccordionContent className={styles.AccordionContent}>
								{comments.map((comment) => (
									<Flex key={comment.node.id} direction="column" gap="4">
										<Flex gap="3" align="start">
											<Box>
												<img
													src={comment.node.author.avatarUrl}
													style={{
														width: "40px",
														height: "40px",
														borderRadius: "var(--radius-3)",
														objectFit: "cover",
													}}
												/>
											</Box>
											<Flex
												direction="column"
												gap="1"
												className={styles.comment}
												style={{ flex: 1 }}
											>
												<Flex justify="between" align="center">
													<Link
														href={`https://github.com/${comment.node.author.login}`}
														target="_blank"
														className="text-blue-600 hover:underline"
													>
														@{comment.node.author.login}
													</Link>
													<Text size="1" color="gray">
														{formatDistanceToNow(
															new Date(comment.node.createdAt),
															{
																addSuffix: true,
															},
														)}
													</Text>
												</Flex>
												<Text size="2">{comment.node.body}</Text>
											</Flex>
										</Flex>
									</Flex>
								))}
								<br />
								<Flex direction="column" gap="4">
									{data?.issue.comments.pageInfo.hasNextPage && (
										<Button
											onClick={() => loadNext(5)}
											disabled={isLoadingNext}
										>
											{isLoadingNext && <Spinner size="3" />}
											Load More
										</Button>
									)}
								</Flex>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Box>
			)}
		</>
	);
}
