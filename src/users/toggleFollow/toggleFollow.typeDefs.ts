import { gql } from "apollo-server";

export default gql`
	type ToggleFollowResult {
		ok: String!
		error: String
	}
	type Mutation {
		toggleFollow(username: String!): ToggleFollowResult!
	}
`;
