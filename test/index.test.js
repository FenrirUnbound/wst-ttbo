'use strict';

const expect = require('chai').expect;
const hapi = require('hapi');

describe('index unit test', () => {
  let main;
  let server;

  beforeEach(() => {
    main = require('../');
    server = new hapi.Server();

    server.connection({
      port: process.env.PORT || 8080
    });

    return server.register(main)
      .then(() => server.start());
  });

  afterEach(() => {
    return server.stop();
  });

  it('status responds OK', () => {
    return server.inject({
      method: 'GET',
      url: '/status'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload).to.deep.equal({
        status: 'OK'
      });
    });
  });

  it('serves html page', () => {
    return server.inject({
      method: 'GET',
      url: '/'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);
      expect(response.headers['content-type']).to.match(/^text\/html/);
      expect(response.payload).to.match(/^<!doctype html>/);
    });
  });
});
