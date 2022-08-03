const AddLike = require('../AddLike');

describe('a AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { threadId: 'thread-123' };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = { threadId: 'thread-123', commentId: [], owner: [] };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const { threadId, commentId, owner } = new AddLike(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
