const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  const requestPostPayload = {
    content: 'ini sebuah balasan',
  };

  describe('when POST /replies', () => {
    it('should response 201 and reply created', async () => {
      const {
        server, headers, userData, threadData, commentData,
      } = await ServerTestHelper.Comment();
      const { id: userId } = userData;
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPostPayload,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toStrictEqual(requestPostPayload.content);
      expect(responseJson.data.addedReply.owner).toStrictEqual(userId);
    });

    it('should response 401 when have not login', async () => {
      const server = await ServerTestHelper.useServer();
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-345/comments/comment-345/replies',
        payload: requestPostPayload,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const invalidRequestPayload = {};
      const {
        server, headers, threadData, commentData,
      } = await ServerTestHelper.Comment();
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: invalidRequestPayload,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const invalidRequestPayload = { content: true };
      const {
        server, headers, threadData, commentData,
      } = await ServerTestHelper.Comment();
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: invalidRequestPayload,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not exist', async () => {
      const { server, headers } = await ServerTestHelper.Auth();

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-345/comments/comment-345/replies',
        payload: requestPostPayload,
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
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-345/replies`,
        payload: requestPostPayload,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak tersedia');
    });
  });

  describe('when DELETE /replies', () => {
    it('should response 201 and reply deleted', async () => {
      const {
        server, headers, threadData, commentData, replyData,
      } = await ServerTestHelper.Reply();
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;
      const { id: replyId } = replyData;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when have not login', async () => {
      const server = await ServerTestHelper.useServer();
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-345/comments/comment-345/replies/reply-345',
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread id is invalid', async () => {
      const { server, headers } = await ServerTestHelper.Auth();

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-345/comments/comment-345/replies/reply-345',
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak tersedia');
    });

    it('should response 404 when comment id is invalid', async () => {
      const {
        server, headers, threadData,
      } = await ServerTestHelper.Thread();
      const { id: threadId } = threadData;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-345/replies/reply-345`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak tersedia');
    });

    it('should response 404 when reply id is invalid', async () => {
      const {
        server, headers, threadData, commentData,
      } = await ServerTestHelper.Comment();
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-345`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak tersedia');
    });

    it('should response 403 when delete others comment id', async () => {
      // Comment created by other user
      const { threadData, commentData, replyData } = await ServerTestHelper.Reply();
      const { id: threadId } = threadData;
      const { id: commentId } = commentData;
      const { id: replyId } = replyData;

      // current user
      const { server, headers } = await ServerTestHelper.Auth({
        username: 'jondoe',
        password: 'plainpassword',
        fullname: 'sijondoe',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak dapat mengakses balasan ini');
    });
  });
});
