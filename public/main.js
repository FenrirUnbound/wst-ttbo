'use strict';

const app = angular.module('ttbo', []);

function getTopTracks($http, artist) {
  return $http({
    method: 'GET',
    url: `/artists/${artist}/tracks`
  }).then((response) => {
    return response.data.data;
  });
}

function getArtistInfo($http, artist) {
  return $http({
    method: 'GET',
    url: `/artists/${artist}`
  }).then((response) => {
    return response.data.data;
  });
}

app.controller('AppController', ['$scope', '$http', function ($scope, $http) {
  const searchQuery = {
    text: ''
  };
  $scope.searchText = searchQuery;
  $scope.tracks = {
    display: false,
    listings: [],
    maxPlayCount: 1
  };
  $scope.artistInfo = {
    name: '',
    bio: '',
    picture: '',
    display: false
  };

  $scope.search = () => {
    const searchText = searchQuery.text;

    return Promise.all([
      getTopTracks($http, searchText),
      getArtistInfo($http, searchText)
    ]).then(([ topTracks, artistInfo ]) => {
      // process artist info
      $scope.artistInfo.name = artistInfo.name;
      $scope.artistInfo.bio = artistInfo.bio;
      $scope.artistInfo.link = artistInfo.link;
      $scope.artistInfo.picture = artistInfo.image;
      $scope.artistInfo.display = true;

      // process top trakcs
      $scope.tracks.listings = topTracks.slice(0, 10);
      console.log($scope.tracks.listings)
      try {
        $scope.tracks.maxPlayCount = parseInt($scope.tracks.listings[0].playcount, 10) || 1;
      } catch(e) {
        $scope.tracks.maxPlayCount = 1;
      }

      // todo: this on the backend
      $scope.tracks.listings.forEach((track, index) => {
        $scope.tracks.listings[index].popularity = parseInt($scope.tracks.listings[index].playcount, 10) / $scope.tracks.maxPlayCount * 100;
      });
      $scope.tracks.display = true;
    }).catch((err) => {
      console.error('Error with one of the fetches');
      console.error(err);
    });
  };
}]);
