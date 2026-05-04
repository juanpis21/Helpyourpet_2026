declare const _default: () => {
    port: number;
    node_env: string;
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    smtp: {
        user: string;
        pass: string;
    };
    cors: {
        origin: boolean;
        credentials: boolean;
    };
};
export default _default;
