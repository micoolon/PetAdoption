const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sqlmic7542",
  database: "pet_adoption_db",
});

function sendQuery(query) {
  return new Promise((res, rej) => {
    connection.query(query, function (error, results, fields) {
      if (error) {
        if (error.errno === 1045) {
          rej("Wrong Structure");
        }
        rej(error);
      }
      res(results);
    });
  });
}

module.exports = {
  sendQuery,
};
