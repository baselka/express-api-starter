import 'dotenv/config'

export const Config = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    API_PREFIX: '/api',
    API_VERSION: 'v1',
}