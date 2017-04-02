'use strict';

const hapi = require('hapi');
const main = require('../');
const server = new hapi.Server();

server.connection({
  host: 'localhost',
  port: process.env.PORT || 8080
});

server.register(main, (err) => {
  if (err) {
    console.error(err);
  }

  server.start((startErr) => {
    if (startErr) {
      console.error(startErr);
    }

    console.log(`Server running at ${server.info.uri}`);
  });
});
