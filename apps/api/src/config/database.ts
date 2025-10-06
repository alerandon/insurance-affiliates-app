export const getDbUri = (): string => {
  const DB_USER = process.env.API_DB_USER || 'user';
  const DB_PASSWORD = process.env.API_DB_PASSWORD || 'password';
  const DB_HOST = process.env.API_DB_HOST || 'mongodb';
  const DB_PORT = process.env.API_DB_PORT || '27017';
  const DB_NAME = process.env.API_DB_NAME || 'myguardcare-affiliates-app';

  const CONN_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

  return CONN_URI;
};
