import { graphql } from "react-relay";

export const COMMENTS_PAGINATION_FRAGMENT = graphql`
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
  `;
