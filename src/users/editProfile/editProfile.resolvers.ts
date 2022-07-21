import { Resolver, Resolvers } from "./../../types.d";
import * as bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { finished } from "stream/promises";
import { loginProtector } from "@/users/users.utils";

const resolvedFn: Resolver = async (
	_,
	{
		username,
		email,
		name,
		password: newPassword,
		location,
		githubUsername,
		avatar,
	},
	{ loggedInUser, client }
) => {
	try {
		let newAvatarURL = null;
		if (avatar) {
			const { filename, createReadStream } = await avatar;

			const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
			const readStream = createReadStream();
			const writeStream = createWriteStream(
				process.cwd() + "/uploads/" + newFilename
			);
			readStream.pipe(writeStream);
			await finished(writeStream);
			newAvatarURL = `http://localhost:4000/static/${newFilename}`;
		}
		let hashedPassword = null;
		if (newPassword) {
			hashedPassword = await bcrypt.hash(newPassword, 10);
		}
		const updatedUser = await client.user.update({
			where: { id: loggedInUser.id },
			data: {
				username,
				email,
				name,
				location,
				githubUsername,
				...(hashedPassword && { password: hashedPassword }),
				...(newAvatarURL && { avatarURL: newAvatarURL }),
			},
		});
		if (updatedUser.id)
			return {
				ok: true,
			};

		throw new Error("Could not update profile.");
	} catch (e) {
		return {
			ok: false,
			error: e.message,
		};
	}
};

const resolvers: Resolvers = {
	Mutation: {
		editProfile: loginProtector(resolvedFn),
	},
};

export default resolvers;
