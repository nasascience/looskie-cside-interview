import { graphql } from "react-relay";

export const ISSUES_PAGINATION_FRAGMENT = graphql`
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
			  labels{
            	totalCount
          	}
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;
