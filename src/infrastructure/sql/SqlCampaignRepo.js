const sql = require("mssql");

class SqlCampaignRepo {
  constructor(pool) { this.pool = pool; }

  async create({ name, channel, budget=0 }) {
    const r = await this.pool.request()
      .input("name", sql.NVarChar, name)
      .input("channel", sql.NVarChar, channel)
      .input("budget", sql.Int, budget)
      .query("INSERT INTO Campaigns(name,channel,budget) OUTPUT INSERTED.id VALUES(@name,@channel,@budget)");
    return { id: r.recordset[0].id, name, channel, budget };
  }

  async getById(id) {
    const r = await this.pool.request()
      .input("id", sql.Int, id)
      .query("SELECT id,name,channel,budget FROM Campaigns WHERE id=@id");
    if (!r.recordset[0]) throw new Error("NOT_FOUND");
    const row = r.recordset[0];
    return { id: row.id, name: row.name, channel: row.channel, budget: row.budget };
  }

  async save(c) {
    await this.pool.request()
      .input("id", sql.Int, c.id)
      .input("budget", sql.Int, c.budget)
      .query("UPDATE Campaigns SET budget=@budget WHERE id=@id");
  }
}

module.exports = { SqlCampaignRepo };