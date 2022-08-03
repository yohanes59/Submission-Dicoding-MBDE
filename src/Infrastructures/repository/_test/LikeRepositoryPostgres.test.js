const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist register like and return registered like correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const addLike = new AddLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const addedLike = await likeRepositoryPostgres.addLike(addLike);
      expect(addedLike).toStrictEqual('like-123');
      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('verifyLikeExist function', () => {
    it('should throw null when thread, comment, and user not exist', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.verifyLikeExist('thread-345', 'comment-345', 'user-345'))
        .resolves.toStrictEqual(null);
    });

    it('should throw id when thread, comment, and user exist', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({
        id: 'like-123', threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.verifyLikeExist('thread-123', 'comment-123', 'user-123'))
        .resolves.toStrictEqual('like-123');
    });
  });

  describe('deleteLike function', () => {
    it('should throw InvariantError when something wrong', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.deleteLike('like-123'))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when query run correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({
        id: 'like-123', threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.deleteLike('like-123'))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should throw 0 when like in comment not exist', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.getLikeCountByCommentId('comment-345'))
        .resolves.toStrictEqual(0);
    });

    it('should return like count when like in comment exist', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await LikesTableTestHelper.addLike({
        id: 'like-123', threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      await expect(likeRepositoryPostgres.getLikeCountByCommentId('comment-123'))
        .resolves.toStrictEqual(1);
    });
  });
});
