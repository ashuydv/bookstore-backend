const { MongoClient } = require("mongodb");
require("dotenv").config();

let dbConnection;
let uri = process.env.MONGO_URI

module.exports = {
  connectToDB: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDB: () => dbConnection,
};
