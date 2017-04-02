'use strict';

const chai = require('chai');
const expect = chai.expect;
const hapi = require('hapi');
const sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('functional test - getArtist', () => {
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

  it('looks up an artist', () => {
    return server.inject({
      method: 'GET',
      url: '/artists/rick%20astley'
    }).then((response) => {
      expect(response.statusCode).to.equal(200);

      const payload = JSON.parse(response.payload);
      const verifier = sinon.stub();

      expect(payload).to.have.property('data');
      verifier(payload.data);

      expect(verifier).to.be.calledWith({
        bio: sinon.match(/^Richard Paul Astley/),
        image: 'https://lastfm-img2.akamaized.net/i/u/300x300/ba8cda020295d4535b2c83273a55fe1e.png',
        link: 'https://www.last.fm/music/Rick+Astley',
        name: 'Rick Astley'
      });
    });
  });
});
