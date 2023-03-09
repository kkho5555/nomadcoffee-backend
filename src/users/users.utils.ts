import { Resolver } from "../types";
import * as jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (authorization: string) => {
    try {
        if (!authorization) {
            return null;
        }

        const verifiedToken = jwt.verify(authorization, process.env.SECRET_KEY);
        if (
            typeof verifiedToken === "object" &&
            verifiedToken.hasOwnProperty("id")
        ) {
            const user = await client.user.findUnique({
                where: { id: verifiedToken["id"] },
            });
            return user;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

type ProtectedResolver = (resolvedFn: Resolver) => Resolver;
export const loginProtector: ProtectedResolver = (ourResolver: Resolver) => {
    return function (root, args, context, info) {
        if (!context.loggedInUser) {
            return {
                ok: false,
                error: "You need to login to perform this action.",
            };
        }
        return ourResolver(root, args, context, info);
    };
};
