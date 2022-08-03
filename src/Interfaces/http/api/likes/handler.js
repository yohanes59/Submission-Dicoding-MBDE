const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const payload = {
      threadId,
      commentId,
      owner,
    };
    const likeUseCase = this._container.getInstance(LikeUseCase.name);
    await likeUseCase.execute(payload);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = LikesHandler;
