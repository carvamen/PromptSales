class CampaignService {
  constructor({ repo, eventBus }) { this.repo = repo; this.eventBus = eventBus; }

  async create(cmd) {
    const c = await this.repo.create(cmd);
    await this.eventBus.publish({ type:"ads.campaign.created", data:{ id: c.id }});
    return c;
  }

  async increaseBudget(id, delta) {
    const c = await this.repo.getById(id);
    const evt = c.increaseBudget(delta);
    await this.repo.save(c);
    await this.eventBus.publish(evt);
    return c;
  }
}
module.exports = { CampaignService };