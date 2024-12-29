import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';

/**
 * JWT Token Middleware to verify token from request header and decode it
 * @returns JWTTokenMiddleware
 */
export const verifyToken = () => {
  const JWTTokenMiddleware = expressjwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['RS256'],
    credentialsRequired: true,
    issuer: 'accounts.zstun.com',
    audience: 'api.zstun.com',
    requestProperty: 'auth',
    getToken: (req) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies.token) {
        return req.cookies.token;
      }
      return null;
    },
  }).unless({
    path: ['/api/account/login', '/api/account/register'],
  });

  return JWTTokenMiddleware;
};

/**
 * Generate JWT token
 * @param payload - Payload data
 * @returns JWT token string
 */
export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET_PRIVATE!, {
    expiresIn: '1h',
    issuer: 'accounts.zstun.com',
    audience: 'api.zstun.com',
    algorithm: 'RS256',
  });
};
