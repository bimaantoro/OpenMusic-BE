const UserAlbumLikesHandler = require('./handler');
const routes = require('./routes');

const userAlbumLikes = {
  name: 'user_album_likes',
  version: '1.0.0',
  register: async (server, { userAlbumLikesService, albumsService }) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(
      userAlbumLikesService,
      albumsService,
    );
    server.route(routes(userAlbumLikesHandler));
  },
};

module.exports = userAlbumLikes;
