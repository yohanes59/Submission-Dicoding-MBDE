exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
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
    'comments',
    'FK_comments.thread_id_TO_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'comments',
    'FK_comments.owner_TO_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'FK_comments.thread_id_TO_threads.id');
  pgm.dropConstraint('comments', 'FK_comments.owner_TO_users.id');
  pgm.dropTable('comments');
};
