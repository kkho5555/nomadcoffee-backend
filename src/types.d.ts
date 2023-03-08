export type Resolver = (parent: any, args: any, context: any, info: any) => any;

export type Resolvers = {
    [Key: string]: {
        [Key: string]: Resolver;
    };
};
