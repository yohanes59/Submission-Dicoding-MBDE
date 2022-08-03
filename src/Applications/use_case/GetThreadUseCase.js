const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReplies = require('../../Domains/replies/entities/DetailReplies');

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);
    await this._threadRepository.verifyThreadExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    thread.comments = await Promise.all(comments.map(async (comment) => {
      const DetailedComment = new DetailComment(comment);
      const { id: commentId } = comment;
      const likeCount = await this._likeRepository.getLikeCountByCommentId(commentId);
      const replies = await this._replyRepository.getRepliesByCommentId(commentId);
      const detailedReplies = new DetailReplies(replies).constructReplies();
      return DetailedComment.constructComment(detailedReplies, likeCount);
    }));
    return thread;
  }

  _validatePayload(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadUseCase;
