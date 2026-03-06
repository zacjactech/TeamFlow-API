"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const jwtSecret = process.env.JWT_SECRET;
    if (isProduction && (!jwtSecret || jwtSecret === 'super-secret-key')) {
        console.error('FATAL: JWT_SECRET must be set to a secure value in production!');
        process.exit(1);
    }
    return {
        port: parseInt(process.env.PORT || '3000', 10),
        database: {
            url: process.env.DATABASE_URL,
        },
        jwt: {
            secret: jwtSecret || 'super-secret-key',
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
        throttle: {
            ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
            limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
        },
    };
};
//# sourceMappingURL=configuration.js.map