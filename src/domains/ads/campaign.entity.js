class Campaign {
  constructor({ id, name, channel, budget = 0 }) {
    if (!name || name.length < 3) throw new Error("Invalid name");
    this.id = id; this.name = name; this.channel = channel; this.budget = budget;
  }
  increaseBudget(delta) {
    if (delta <= 0) throw new Error("delta>0");
    this.budget += delta;
    return { type: "ads.campaign.budget_changed", data: { id: this.id, budget: this.budget } };
  }
}
module.exports = { Campaign };