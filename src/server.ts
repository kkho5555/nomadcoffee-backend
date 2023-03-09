require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT || 4000;
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.authorization),
                client,
            };
        },
    });

    const app = express();
    app.use(logger("tiny")).use("/static", express.static("uploads"));

    await server.start();
    server.applyMiddleware({ app });
    app.listen({ port: PORT }, () =>
        console.log(`Server is running on http://localhost:${PORT}`)
    );
}
startApolloServer();
