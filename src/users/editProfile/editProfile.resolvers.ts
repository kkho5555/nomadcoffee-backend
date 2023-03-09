import { Resolver, Resolvers } from "../../types";
import * as bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { finished } from "stream/promises";
import { loginProtector } from "../users.utils";

const resolvedFn: Resolver = async (
    _,
    { username, email, name, password: newPassword, location, githubUsername },
    { loggedInUser, client }
) => {
    try {
        let hashedPassword = "";
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
            where: { id: loggedInUser?.id },
            data: {
                username,
                email,
                name,
                location,
                githubUsername,
                ...(newPassword && { password: hashedPassword }),
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
