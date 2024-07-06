const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: handler.getActivitiesByPlaylistId,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
