exports.up = (pgm) => {
  pgm.createTable('replies', {
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
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'replies',
    'FK_replies.thread_id_TO_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'replies',
    'FK_replies.comment_id_TO_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'replies',
    'FK_replies.owner_TO_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'FK_replies.thread_id_TO_threads.id');
  pgm.dropConstraint('replies', 'FK_replies.comment_id_TO_comments.id');
  pgm.dropConstraint('replies', 'FK_replies.owner_TO_users.id');
  pgm.dropTable('replies');
};
