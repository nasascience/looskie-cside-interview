import { graphql } from "react-relay";

export const ISSUES_INITIAL = graphql`
      query IssuesQuery($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          ...IssuesList_repository
          name
          description
        }
      }
    `;
