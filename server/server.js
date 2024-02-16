const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../config.env` });
const app = require('./app.js');
process.on('unhandledRejection', handleFatalError);
process.on('uncaughtException', handleFatalError);

const port = process.env?.PORT ?? 8000;

const server = app.listen(port, () => {
  console.log(
    `\x1b[0;32mServer up and running on port ${port}!\nEnvironment: ${process.env.NODE_ENV.toUpperCase()}\x1b[0m`
  );
});

module.exports = server;
require('./socket.js');

function handleFatalError(err) {
  console.log(`\x1b[0;31mFATAL ERROR: ${err.message}\n${err.stack}\x1b[0m]`);
  server.close(() => process.exit(0));
}
