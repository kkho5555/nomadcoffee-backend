import { gql } from "apollo-server";

export default gql`
	type User {
		username: String!
		email: String!
		name: String
		location: String
		avatarURL: String
		githubUsername: String
		followers(lastId: Int): [User]
		following(lastId: Int): [User]
		isMe: Boolean
		isFollowing: Boolean
		isFollowed: Boolean
		totalFollowing: Int!
		totalFollowers: Int!
		createdAt: String!
		updatedAt: String!
	}
	type Query {
		seeProfile(username: String!): User
	}
`;
