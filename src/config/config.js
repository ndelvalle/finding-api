export default {
  PORT: process.env.PORT || 9090,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/missing',
  ENV: process.env.NODE_ENV || 'development',
  JWT: {
    KEY: process.env.JWT_KEY || '92601aa638620ae31418',
    EXPIRATION: process.env.JWT_EXPIRATION || 86400,
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION: process.env.AWS_REGION || '',
    BUCKET: process.env.AWS_BUCKET || '',
  },
};
