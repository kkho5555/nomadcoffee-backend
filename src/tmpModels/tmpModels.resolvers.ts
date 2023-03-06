import client from "../client";
export default {
    Query: {
        tmpModels: () => client.tmpModel.findMany(),
        tmpModel: (_, { id }) => client.tmpModel.findUnique({ where: { id } }),
    },
    Mutation: {
        createTmpModel: (_, { name }) =>
            client.tmpModel.create({
                data: {
                    name,
                },
            }),
        deleteTmpModel: (_, { id }) =>
            client.tmpModel.delete({ where: { id } }),
        updateTmpModel: (_, { id, name }) =>
            client.tmpModel.update({ where: { id }, data: { name } }),
    },
};
