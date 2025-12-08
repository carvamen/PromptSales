require('dotenv').config();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.DB_NAME || "prompt_content",

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "migrations",
  changelogCollectionName: "migrations_changelog",
};