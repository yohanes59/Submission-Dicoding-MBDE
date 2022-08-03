exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'likes',
    'FK_likes.thread_id_TO_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'likes',
    'FK_likes.comment_id_TO_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'likes',
    'FK_likes.owner_TO_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'FK_likes.thread_id_TO_threads.id');
  pgm.dropConstraint('likes', 'FK_likes.comment_id_TO_comments.id');
  pgm.dropConstraint('likes', 'FK_likes.owner_TO_users.id');
  pgm.dropTable('likes');
};
