class JobStore {
  constructor(db) { this.db = db; }

  async createJob({ domain, type, payload, callback_url }) {
    const id = this.db.generateUUID(); // tu helper
    await this.db.query(
      `INSERT INTO ai_jobs(id, domain, type, payload, status, callback_url) VALUES($1,$2,$3,$4,$5,$6)`,
      [id, domain, type, payload, 'queued', callback_url]
    );
    return { id, domain, type, payload, status: 'queued', callback_url };
  }

  async getJob(id) {
    const res = await this.db.query(`SELECT * FROM ai_jobs WHERE id=$1`, [id]);
    return res.rows[0];
  }

  async markProcessing(id) {
    await this.db.query(`UPDATE ai_jobs SET status='processing', updated_at=now(), attempts=attempts+1 WHERE id=$1`, [id]);
  }

  async markReady(id, result_location) {
    await this.db.query(`UPDATE ai_jobs SET status='ready', result_location=$2, updated_at=now() WHERE id=$1`, [id, result_location]);
  }

  async markFailed(id, error) {
    await this.db.query(`UPDATE ai_jobs SET status='failed', error=$2, updated_at=now() WHERE id=$1`, [id, error]);
  }
}

module.exports = JobStore;
