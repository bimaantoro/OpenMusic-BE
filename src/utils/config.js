require('dotenv').config();
const { join } = require('path');

const config = {
  app: {
    host: process.env.HOST ?? 'localhost',
    port: process.env.PORT ?? 5000,
    imagesPublicPath: join(process.cwd(), 'src', 'public', 'images'),
    generateAlbumArtUrl: (albumId) => `http://${config.app.host}:${config.app.port}/albums/${albumId}/covers`,
  },
  jwtToken: {
    accessToken: {
      key: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_AGE,
    },
    refreshToken: {
      key: process.env.REFRESH_TOKEN_KEY,
    },
  },
  rabbitMq: {
    url: process.env.RABBITMQ_SERVER,
  },
  redis: {
    url: process.env.REDIS_SERVER,
  },
};

module.exports = { config };
