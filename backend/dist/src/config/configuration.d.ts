declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
};
export default _default;
