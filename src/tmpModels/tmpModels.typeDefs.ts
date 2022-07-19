import { gql } from "apollo-server";

export default gql`
	type TmpModel {
		id: Int!
		name: String!
		createdAt: String!
		updatedAt: String!
	}
	type Query {
		tmpModels: [TmpModel]
	}
`;
