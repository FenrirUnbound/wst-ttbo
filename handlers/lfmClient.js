'use strict';

const requestLib = require('request');
const url = require('url');

const LASTFM_BASE = 'http://ws.audioscrobbler.com/2.0/?';

function request(options) {
  const requestOptions = Object.assign({
    json: true
  }, options);

  return new Promise((resolve, reject) => {
    requestLib(requestOptions, (err, response) => {
      if (err) {
        return reject(err);
      }

      return resolve(response);
    });
  });
}

function urlBuilder(query) {
  return url.format({
    protocol: 'http',
    host: 'ws.audioscrobbler.com',
    pathname: '2.0',
    query
  });
}

function getArtist(artist) {
  const accessKey = process.env.LASTFM_KEY;

  return request({
    method: 'GET',
    uri: urlBuilder({
      method: 'artist.getinfo',
      artist,
      format: 'json',
      api_key: accessKey
    })
  }).then(response => response.body.artist);
}

function getTopTracks(artist) {
  const accessKey = process.env.LASTFM_KEY;

  return request({
    method: 'GET',
    uri: urlBuilder({
      method: 'artist.gettoptracks',
      artist,
      format: 'json',
      api_key: accessKey
    })
  }).then(response => response.body.toptracks);
}

module.exports = {
  getArtist,
  getTopTracks
};
