import client from "../../client";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
    Mutation: {
        createAccount: async (
            _,
            {
                username,
                email,
                password,
                name,
                location = "",
                avatarURL = "",
                githubUsername = "",
            }
        ) => {
            try {
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [{ username }, { email }],
                    },
                });
                if (existingUser)
                    throw new Error("This username or email is already exist.");
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await client.user.create({
                    data: {
                        username,
                        email,
                        name,
                        location,
                        avatarURL,
                        githubUsername,
                        password: hashedPassword,
                    },
                });
                if (user.id) return { ok: true };
                else throw new Error("Failed create this account.");
            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                };
            }
        },
    },
};
export default resolvers;
