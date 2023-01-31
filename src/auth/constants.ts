export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'customer-service-token',
  expiration: process.env.JWT_EXPIRATION || '10h',
};
