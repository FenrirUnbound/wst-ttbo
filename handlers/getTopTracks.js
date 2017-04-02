'use strict';

const client = require('./lfmClient');

function formatTracks(tracks) {
  const result = tracks.track.map((track) => {
    return {
      listeners: parseInt(track.listeners, 10),
      name: track.name,
      playcount: parseInt(track.playcount, 10),
      rank: parseInt(track['@attr'].rank, 10),
      url: track.url
    };
  });

  return Promise.resolve(result);
}

module.exports = (req, reply) => {
  const { artistName } = req.params;
  const key = process.env.LASTFM_KEY;

  return client.getTopTracks(artistName)
  .then(formatTracks)
  .then((topTracks) => {
    return reply({
      data: topTracks
    });
  });
};
