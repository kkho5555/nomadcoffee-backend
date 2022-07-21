require("dotenv").config();
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import graphqlUploadExpress = require("graphql-upload/graphqlUploadExpress.js");
import client from "@/client";
import { typeDefs, resolvers } from "@/schema";
import { getUser } from "@/users/users.utils";

const PORT = process.env.PORT;
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
	await server.start();

	const app = express();
	app
		.use(logger("tiny"))
		.use("/static", express.static("uploads"))
		.use(graphqlUploadExpress());
	server.applyMiddleware({ app });
	app.listen({ port: PORT }, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
		console.log(
			`GraphQL Playground is available at http://localhost:${PORT}/graphql`
		);
	});
}
startApolloServer();
