const config = {
  app: {
    port: process.env.PORT || 8080,
  },
  db: {
    url: "mongodb://127.0.0.1:27017/bookreviews",
  },
  jwt: {
    secret: "secret-key",
  },
};

module.exports = config;
