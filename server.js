const app = require("./index");

let port = 1000;

const server = app.listen(process.env.PORT || port, () => {
  console.log(`Server now up and running on port ${port}`.yellow.bold);
});

module.exports = server;
