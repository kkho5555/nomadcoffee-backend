import { Prisma } from ".prisma/client";
import { Resolver, Resolvers } from "@/types";

const searchUsers: Resolver = async (_, { keyword, lastId }, { client }) => {
	try {
		if (keyword.length < 2) {
			throw new Error("Input more 2 characters.");
		}
		const searchKeywords: Prisma.UserWhereInput = {
			OR: [
				{
					username: {
						startsWith: keyword.toLowerCase(),
					},
				},
				{
					email: {
						startsWith: keyword.toLowerCase(),
					},
				},
				{
					name: {
						startsWith: keyword.toLowerCase(),
					},
				},
			],
		};
		const count = await client.user.count({ where: searchKeywords });
		if (!Boolean(count)) {
			throw new Error("There is no search result.");
		}
		const users = await client.user.findMany({
			where: searchKeywords,
			take: 5,
			skip: lastId ? 1 : 0,
			...(lastId && { cursor: { id: lastId } }),
		});
		return {
			ok: true,
			count,
			users,
		};
	} catch (e) {
		return {
			ok: false,
			error: e.message,
			count: 0,
			users: null,
		};
	}
};

const resolver: Resolvers = {
	Query: {
		searchUsers,
	},
};
export default resolver;
