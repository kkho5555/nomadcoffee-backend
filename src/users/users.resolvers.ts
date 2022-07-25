import { Resolvers } from "@/types";
import { loginProtector } from "@/users/users.utils";
const resolver: Resolvers = {
	Query: {
		seeProfile: (_, { username }, { client }) =>
			client.user.findUnique({
				where: {
					username,
				},
				include: {
					followers: true,
					following: true,
				},
			}),
	},
	User: {
		totalFollowing: ({ id }, __, { client }) =>
			client.user.count({
				where: {
					followers: {
						some: {
							id,
						},
					},
				},
			}),
		totalFollowers: ({ id }, __, { client }) =>
			client.user.count({
				where: {
					following: {
						some: {
							id,
						},
					},
				},
			}),
		followers: ({ username }, { lastId }, { client }) =>
			client.user.findUnique({ where: { username } }).followers({
				take: 5,
				skip: lastId ? 1 : 0,
				...(lastId && { cursor: { id: lastId } }),
			}),

		following: ({ username }, { lastId }, { client }) =>
			client.user.findUnique({ where: { username } }).following({
				take: 5,
				skip: lastId ? 1 : 0,
				...(lastId && { cursor: { id: lastId } }),
			}),

		isMe: loginProtector(({ username }, __, { loggedInUser }) => {
			return loggedInUser.username === username;
		}),

		isFollowing: loginProtector(
			({ username }, __, { loggedInUser, client }) => {
				return Boolean(
					client.user
						.findUnique({
							where: { username: loggedInUser.username },
						})
						.following({
							where: {
								username,
							},
						})
				);
			}
		),
		isFollowed: loginProtector(
			async ({ username }, __, { loggedInUser, client }) =>
				Boolean(
					await client.user
						.findUnique({
							where: { username: loggedInUser.username },
						})
						.followers({
							where: {
								username,
							},
						})
				)
		),
	},
};

export default resolver;
