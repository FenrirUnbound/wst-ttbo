'use strict';

const client = require('./lfmClient');

function pruneBioEnding(bio) {
  const lastPeriod = bio.lastIndexOf('. ');

  return bio.substring(0, lastPeriod);
}

function searchForImage(images) {
  const compare = {
    extralarge: 10,
    large: 9,
    mega: 8,
    medium: 7,
    small: 5
  };

  // sort from most desired to least
  images.sort((a, b) => {
    const valA = compare[a.size] || 1;
    const valB = compare[b.size] || 1;

    return valA - valB;
  });

  // return best image
  return images[images.length - 1]["#text"];
}

module.exports = (req, reply) => {
  const { artistName } = req.params;

  return client.getArtist(artistName)
  .then((artistInfo) => {
    return reply({
      data: {
        bio: pruneBioEnding(artistInfo.bio.summary),
        link: artistInfo.url,
        name: artistInfo.name,
        image: searchForImage(artistInfo.image)
      }
    });
  });
};
