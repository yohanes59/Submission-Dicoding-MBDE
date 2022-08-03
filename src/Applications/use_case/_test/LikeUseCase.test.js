const AddLike = require('../../../Domains/likes/entities/AddLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const expectedAddedLike = new AddLike({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    });
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.verifyLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    await getLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeExist).toBeCalledWith('thread-123', 'comment-123', 'user-123');
    expect(mockLikeRepository.addLike).toBeCalledWith(expectedAddedLike);
  });

  it('should orchestrating the remove like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockLikeRepository = new LikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockLikeRepository.verifyLikeExist = jest.fn()
      .mockImplementation(() => Promise.resolve('like-123'));
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    await getLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyLikeExist).toBeCalledWith('thread-123', 'comment-123', 'user-123');
    expect(mockLikeRepository.deleteLike).toBeCalledWith('like-123');
  });
});
