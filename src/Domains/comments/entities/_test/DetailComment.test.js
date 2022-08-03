const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'ini sebuah komentar',
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should called DetailComment constructComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'ini sebuah komentar',
      is_deleted: false,
    };
    const replies = [];
    const expectedCommentValue = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'ini sebuah komentar',
      replies: [],
    };

    // Action
    const comments = new DetailComment(payload).constructComment(replies);

    // Assert
    expect(comments).toStrictEqual(expectedCommentValue);
  });

  it('should called DetailComment constructComment object correctly (deleted)', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'ini sebuah komentar',
      is_deleted: true,
    };
    const replies = [];
    const expectedCommentValue = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: '**komentar telah dihapus**',
      replies: [],
    };

    // Action
    const comments = new DetailComment(payload).constructComment(replies);

    // Assert
    expect(comments).toStrictEqual(expectedCommentValue);
  });
});
