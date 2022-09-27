// General
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Server
export const PORT = parseInt(process.env.PORT || '4000');
export const HOST = process.env.HOST || '0.0.0.0';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// JWT
export const JWT_CONFIG = {
  accessTokenSecret: process.env.JWT_AT_SECRET || '<mysupersecureaccesstoken>',
  refreshTokenSecret: process.env.JWT_RF_SECRET || '<mysupersecurerefreshtoken>',
  accessTokenExpireIn: process.env.JWT_AT_EXPIRE_IN || '5m',
  refreshTokenExpireIn: process.env.JWT_AT_EXPIRE_IN || '7d',
};
