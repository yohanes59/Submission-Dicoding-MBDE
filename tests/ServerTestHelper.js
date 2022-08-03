/* istanbul ignore file */
const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const ServerTestHelper = {
  async useServer() {
    return createServer(container);
  },

  async Auth(data) {
    const userPayload = {
      username: data?.username || 'dicoding',
      password: data?.password || 'secret',
      fullname: data?.fullname || 'Dicoding Indonesia',
    };
    const server = await createServer(container);

    const userResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });
    const userResponseJson = JSON.parse(userResponse.payload);
    const userData = userResponseJson.data.addedUser;

    const authPayload = {
      username: userPayload.username,
      password: userPayload.password,
    };

    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: authPayload,
    });

    const authResponseJson = JSON.parse(authResponse.payload);
    const headers = { Authorization: `Bearer ${authResponseJson.data.accessToken}` };
    return { server, headers, userData };
  },

  async Thread() {
    const userData = {};
    const serverData = await this.Auth(userData);

    const { server, headers } = serverData;
    const threadPayload = { title: 'ini sebuah thread', body: 'ini sebuah body thread' };

    const thread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: threadPayload,
      headers,
    });

    const threadResponse = JSON.parse(thread.payload);
    const responseThread = threadResponse.data.addedThread;
    return { ...serverData, threadData: responseThread };
  },

  async Comment() {
    const { threadData, userData } = {};
    const serverData = await this.Thread({ threadData, userData });

    const {
      server,
      headers,
      threadData: responseThread,
    } = serverData;
    const { id: threadId } = responseThread;
    const commentPayload = { content: 'ini sebuah komentar' };

    const comment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: commentPayload,
      headers,
    });

    const commentResponse = JSON.parse(comment.payload);
    const responseComment = commentResponse.data.addedComment;
    return { ...serverData, commentData: responseComment };
  },

  async Reply() {
    const { threadData, userData, commentData } = {};
    const serverData = await this.Comment({ threadData, commentData, userData });

    const {
      server,
      headers,
      threadData: responseThread,
      commentData: responseComment,
    } = serverData;
    const { id: threadId } = responseThread;
    const { id: commentId } = responseComment;
    const replyPayload = { content: 'ini sebuah balasan' };

    const reply = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: replyPayload,
      headers,
    });

    const replyResponse = JSON.parse(reply.payload);
    const responseReply = replyResponse.data.addedReply;
    return { ...serverData, replyData: responseReply };
  },

  async Like() {
    const { threadData, userData, commentData } = {};
    const serverData = await this.Comment({
      threadData,
      commentData,
      userData,
    });

    const {
      server, headers, threadData: resThreadData, commentData: resCommentData,
    } = serverData;
    const { id: threadId } = resThreadData;
    const { id: commentId } = resCommentData;
    await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers,
    });
    return serverData;
  },
};

module.exports = ServerTestHelper;
