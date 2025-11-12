class ContentController {
  constructor(deps) {
    // ✅ Solo recibe ACLs, ningún contract directo
    this.aiACL = deps.aiACLForContent;
  }

  async generateContent(req, res, next) {
    try {
      const userId = req.user.id;
      const { topic, style, length } = req.body;

      const prompt = `Write a ${length} content about ${topic} in ${style} style.`;

      // ✅ Usar métodos de alto nivel del ACL
      const aiRequest = await this.aiACL.processAIRequest(userId, prompt, {
        webhookUrl: `${process.env.APP_URL}/webhooks/content/generated`,
        timeout: 60
      });

      res.status(202).json({
        message: 'Content generation started',
        requestId: aiRequest.requestId,
        statusUrl: aiRequest.statusUrl,
        remainingCredits: aiRequest.remainingCredits
      });
    } catch (error) {
      if (error.message.includes('does not have access')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('rate limit')) {
        return res.status(429).json({ 
          error: error.message,
          upgradeUrl: '/billing/upgrade'
        });
      }
      next(error);
    }
  }
}

module.exports = ContentController;