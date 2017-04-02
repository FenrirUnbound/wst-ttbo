'use strict';

const expect = require('chai').expect;
const hapi = require('hapi');

describe('functional test - getTopTracks', () => {
  let server;

  beforeEach(() => {
    const main = require('../');
    server = new hapi.Server();

    server.connection({
      port: process.env.PORT || 8080
    });

    return server.register(main)
      .then(() => server.start());
  });

  afterEach(() => server.stop());

  it('looks up the top ten trakcs', () => {
    return server.inject({
      method: 'GET',
      url: '/artists/rick%20astley/tracks'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);

      expect(payload).to.have.property('data');

      const target = payload.data[0];

      expect(target.name).to.equal('Never Gonna Give You Up');
      expect(target.playcount).to.be.above(2164610);
      expect(target.listeners).to.be.above(434920);
      expect(target.url).to.equal('https://www.last.fm/music/Rick+Astley/_/Never+Gonna+Give+You+Up');
      expect(target.rank).to.equal(1);
    });
  });
});
