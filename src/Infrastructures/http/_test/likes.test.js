const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe('when PUT /likes', () => {
    it('should response 200 and like', async () => {
      const {
        server, headers, userData, threadData, commentData,
      } = await ServerTestHelper.Comment();
      const { id: userId } = userData;
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      const likes = await LikesTableTestHelper.findLike(threadId, commentId, userId);
      expect(likes).toHaveLength(1);
    });

    it('should response 200 and unlike', async () => {
      const {
        server, headers, userData, threadData, commentData,
      } = await ServerTestHelper.Like();
      const { id: userId } = userData;
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      const likes = await LikesTableTestHelper.findLike(threadId, commentId, userId);
      expect(likes).toHaveLength(0);
    });

    it('should response 401 when have not login', async () => {
      const server = await ServerTestHelper.useServer();
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-345/comments/comment-345/likes',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not exist', async () => {
      const { server, headers } = await ServerTestHelper.Auth();

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-345/comments/comment-345/likes',
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak tersedia');
    });

    it('should response 404 when comment not exist', async () => {
      const { server, headers, threadData } = await ServerTestHelper.Thread();
      const { id: threadId } = threadData;

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/comment-345/likes`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak tersedia');
    });
  });
});
