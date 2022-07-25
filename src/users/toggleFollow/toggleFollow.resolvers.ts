import { loginProtector } from "../users.utils";
import { Resolvers, Resolver } from "../../types";

const toggleFollow: Resolver = async (
	_,
	{ username },
	{ loggedInUser, client }
) => {
	try {
		const ok = await client.user.findUnique({ where: { username } });
		if (!ok) {
			throw new Error("That user does not exist.");
		}

		if (loggedInUser.username === username) {
			throw new Error("You cannot follow yourself.");
		}

		const isFollow = Boolean(
			await client.user.findFirst({
				where: {
					username,
					followers: {
						some: { id: loggedInUser.id },
					},
				},
			})
		);
		if (isFollow) {
			await client.user.update({
				where: {
					id: loggedInUser.id,
				},
				data: {
					following: {
						disconnect: {
							username,
						},
					},
				},
			});
		} else {
			await client.user.update({
				where: {
					id: loggedInUser.id,
				},
				data: {
					following: {
						connect: {
							username,
						},
					},
				},
			});
		}
		return {
			ok: true,
		};
	} catch (e) {
		return {
			ok: false,
			error: e.message,
		};
	}
};
const resolver: Resolvers = {
	Mutation: {
		toggleFollow: loginProtector(toggleFollow),
	},
};
export default resolver;
