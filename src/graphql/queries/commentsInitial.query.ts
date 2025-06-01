import { graphql } from "react-relay";

export const INITIAL_ISSUES_COMMENTS_QUERY = graphql` query IssuesCommentsQuery($owner: String!, $name: String!, $issueNumber: Int!){
			repository(owner: $owner, name: $name) {
			...IssuesComments_repository @arguments(issueNumber: $issueNumber)
			}
		}
		`;
