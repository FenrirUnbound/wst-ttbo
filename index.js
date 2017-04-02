'use strict';

const getArtist = require('./handlers/getArtist');
const getTopTracks = require('./handlers/getTopTracks');
const env = require('node-env-file');
const inert = require('inert');
const path = require('path');

env(path.resolve(__dirname, './.env'), {raise: false});

function register (server, options, next) {
  server.register(inert, () => {});

  server.route({
    method: 'GET',
    path: '/status',
    handler: (request, reply) => {
      return reply({
        status: 'OK'
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/artists/{artistName}',
    handler: getArtist
  });
  server.route({
    method: 'GET',
    path: '/artists/{artistName}/tracks',
    handler: getTopTracks
  });

  server.route({
    method: 'GET',
    path: '/scripts/main.js',
    handler: {
      file: './public/main.js'
    }
  });

  server.route({
    method: 'GET',
    path: '/style/main.css',
    handler: {
      file: './public/main.css'
    }
  });

  // default route
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      file: './public/index.html'
    }
  });

  next();
}

register.attributes = {
  name: 'ttbo',
  version: '1.0.0'
};

module.exports = register;
