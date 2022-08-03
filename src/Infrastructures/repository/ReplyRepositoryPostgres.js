const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {
      content, threadId, commentId, owner,
    } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDeleted = false;

    const query = {
      text: `INSERT INTO replies 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, content, owner`,
      values: [id, threadId, commentId, content, owner, date, isDeleted],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyExist(id) {
    const query = {
      text: `SELECT * FROM replies 
            WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('balasan tidak tersedia');
    }
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: `SELECT * FROM replies 
            WHERE id = $1 AND owner = $2`,
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('anda tidak dapat mengakses balasan ini');
    }
  }

  async deleteReply(id) {
    const isDeleted = true;
    const query = {
      text: `UPDATE replies 
            SET is_deleted = $1 
            WHERE id = $2 
            RETURNING id`,
      values: [isDeleted, id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('Gagal memperbarui balasan');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id, replies.date, replies.content, replies.is_deleted, users.username FROM replies
            LEFT JOIN users 
            ON users.id = replies.owner
            WHERE comment_id = $1
            ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
