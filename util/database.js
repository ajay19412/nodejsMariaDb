const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testdb",
  port: 3307
});

module.exports = pool;
