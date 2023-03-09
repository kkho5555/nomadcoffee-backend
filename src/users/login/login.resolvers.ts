import { Resolvers } from "../../types";
require("dotenv").config();
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "";
const resolvers: Resolvers = {
    Mutation: {
        login: async (_, { email, password }, { client }) => {
            try {
                const user = await client.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    throw new Error("Could not find user.");
                }
                const isPasswordAuthed = await bcrypt.compare(
                    password,
                    user.password
                );
                if (isPasswordAuthed) {
                    const token = jwt.sign({ id: user.id }, SECRET_KEY);
                    return {
                        ok: true,
                        token,
                    };
                } else {
                    throw Error("Invalid password.");
                }
            } catch (e) {
                return {
                    ok: false,
                    error: e.message,
                };
            }
        },
    },
};

export default resolvers;
