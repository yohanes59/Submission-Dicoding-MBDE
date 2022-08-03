const DetailReplies = require('../DetailReplies');

describe('a DetailReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = undefined;

    // Action and Assert
    expect(() => new DetailReplies(payload)).toThrowError('DETAIL_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DetailReplies(payload)).toThrowError('DETAIL_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'ini sebuah balasan',
        is_deleted: false,
      },
      {
        id: 'comment-234',
        username: 'jondoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'ini sebuah balasan',
        is_deleted: true,
      },
    ];
    const expectedRepliesValue = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'ini sebuah balasan',
      },
      {
        id: 'comment-234',
        username: 'jondoe',
        date: '2021-08-08T07:22:33.555Z',
        content: '**balasan telah dihapus**',
      },
    ];

    // Action
    const replies = new DetailReplies(payload).constructReplies();

    // Assert
    expect(replies).toStrictEqual(expectedRepliesValue);
  });
});
