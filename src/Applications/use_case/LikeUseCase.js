const AddLike = require('../../Domains/likes/entities/AddLike');

class LikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addLike = new AddLike(useCasePayload);
    const { threadId, commentId, owner } = addLike;
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    const id = await this._likeRepository.verifyLikeExist(threadId, commentId, owner);
    if (id) await this._likeRepository.deleteLike(id);
    else await this._likeRepository.addLike(addLike);
  }
}

module.exports = LikeUseCase;
