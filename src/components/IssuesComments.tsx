import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import styles from "./comments.module.css";

export function IssuesComments({
	owner,
	name,
	issueNumber,
}: { owner: string; name: string; issueNumber: number }) {
	console.log("Query inputs:", { owner, name, issueNumber });

	const initialQueryData = useLazyLoadQuery<any>(
		graphql` query IssuesCommentsQuery($owner: String!, $name: String!, $issueNumber: Int!){
			repository(owner: $owner, name: $name) {
			...IssuesComments_repository @arguments(issueNumber: $issueNumber)
			}
		}
		`,
		{ owner, name, issueNumber },
	);

	// Set up pagination on the fragment
	const { data, loadNext, isLoadingNext } = usePaginationFragment(
		graphql`
    fragment IssuesComments_repository on Repository
    @refetchable(queryName: "IssuesCommentsPaginationQuery")
    @argumentDefinitions(
      issueNumber: { type: "Int!" }
      count: { type: "Int", defaultValue: 5 }
      cursor: { type: "String" }
    ) {
      issue(number: $issueNumber) {
        comments(first: $count, after: $cursor) 
        @connection(key: "IssuesComments_comments") {
          edges {
            node {
              id
              author {
                login
                avatarUrl
              }
              createdAt
              body
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  `,
		initialQueryData.repository,
	);

	//  Safely access issues
	if (!data) {
		return <div className="text-red-500">Issue not found.</div>;
	}
	console.log("data comments", data);
	const comments = data?.issue?.comments?.edges ?? [];
	console.log("comments", comments);
	if (!comments) return <div className="text-red-500">No comments found.</div>;

	return (
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
								{/* Comments */}
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
											<Text size="2" weight="bold">
												{comment.node.author.login}
											</Text>
											<Text size="1" color="gray">
												{formatDistanceToNow(new Date(comment.node.createdAt), {
													addSuffix: true,
												})}
											</Text>
										</Flex>
										<Text size="2">{comment.node.body}</Text>
									</Flex>
								</Flex>
							</Flex>
						))}

						<br />
						<Flex direction="column" gap="4">
							<Button
								onClick={() => loadNext(5)}
								disabled={
									isLoadingNext || !data?.issue.comments.pageInfo.hasNextPage
								}
							>
								Load More
							</Button>
						</Flex>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</Box>
	);
}
