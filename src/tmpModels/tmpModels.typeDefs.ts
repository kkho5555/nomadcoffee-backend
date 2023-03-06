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
        tmpModel(id: Int!): TmpModel
    }
    type Mutation {
        createTmpModel(name: String!): TmpModel
        deleteTmpModel(id: Int!): TmpModel
        updateTmpModel(id: Int!): TmpModel
    }
`;
