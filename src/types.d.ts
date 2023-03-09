import { PrismaClient, User } from "@prisma/client";

type Context = {
    loggedInUser: User | null;
    client: PrismaClient;
};

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export type Resolvers = {
    [Key: string]: {
        [Key: string]: Resolver;
    };
};
