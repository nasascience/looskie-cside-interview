import { graphql } from "react-relay";

export const REPO_INFO_QUERY = graphql`
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
		}`;
