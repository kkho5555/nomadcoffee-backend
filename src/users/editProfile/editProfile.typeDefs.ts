import { gql } from "apollo-server";
export default gql`
    scalar Upload
    type EditProfileResult {
        ok: Boolean!
        error: String
    }
    type Mutation {
        editProfile(
            username: String
            email: String
            password: String
            name: String
            location: String
            githubUsername: String
            avatar: Upload
        ): EditProfileResult!
    }
`;
