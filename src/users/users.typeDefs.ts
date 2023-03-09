import { gql } from "apollo-server";

export default gql`
    type User {
        username: String!
        email: String!
        name: String!
        location: String
        avatarURL: String
        githubUsername: String
        createdAt: String!
        updatedAt: String!
    }
`;
