const AIAsyncContractFactory = require('../contracts/AIAsyncContractFactory');

class AIACL {
  constructor(identityACL, subscriptionACL, deps, version = 'v2') {
    this.identityACL = identityACL;
    this.subscriptionACL = subscriptionACL;
    this.deps = deps;
    this.version = version;
    this.aiAsyncContract = AIAsyncContractFactory.create(version, deps);
  }

  async processAIRequest(userId, prompt, options = {}) {
    // ✅ Validar permisos del usuario usando IdentityACL
    const canAccessAI = await this.identityACL.validateUserAccess(userId, 'ai_service');
    if (!canAccessAI) {
      throw new Error('User does not have access to AI services');
    }

    // ✅ Validar límites de suscripción usando SubscriptionACL
    const subscription = await this.subscriptionACL.getUserSubscriptionWithProfile(userId);
    const canProcess = await this.checkAIRateLimit(userId, subscription);
    if (!canProcess) {
      throw new Error('AI rate limit exceeded for current subscription');
    }

    // ✅ Enriquecer datos con información de perfil
    const userProfile = await this.identityACL.getUserProfileForDisplay(userId);
    const enrichedPrompt = this.enrichPromptWithContext(prompt, userProfile);

    // ✅ Llamar al contrato versionado
    const request = await this.aiAsyncContract.processAIRequest({
      userId,
      prompt: enrichedPrompt,
      webhookUrl: options.webhookUrl,
      timeout: options.timeout || 30,
      userTier: subscription.subscription.plan,
      language: userProfile.language
    });

    // ✅ Registrar uso para analytics
    await this.recordAIUsage(userId, subscription.subscription.plan);

    return {
      ...request,
      userTier: subscription.subscription.plan,
      remainingCredits: this.calculateRemainingCredits(subscription)
    };
  }

  async getAIRequestStatus(userId, requestId) {
    // ✅ Validar que el usuario puede acceder a este request
    const canView = await this.identityACL.validateUserAccess(userId, 'ai_status');
    if (!canView) {
      throw new Error('User does not have access to AI status');
    }

    const status = await this.aiAsyncContract.getAIRequestStatus(requestId);

    // ✅ Verificar ownership del request
    if (status.userId !== userId) {
      throw new Error('User does not have permission to view this request');
    }

    return this.enrichStatusWithUserData(status, userId);
  }

  async cancelAIRequest(userId, requestId) {
    // ✅ Validar permisos de cancelación
    const canCancel = await this.identityACL.validateUserAccess(userId, 'ai_cancel');
    if (!canCancel) {
      throw new Error('User does not have access to cancel AI requests');
    }

    const status = await this.aiAsyncContract.cancelAIRequest(requestId);

    // ✅ Verificar ownership
    if (status.userId !== userId) {
      throw new Error('User does not have permission to cancel this request');
    }

    // ✅ Reembolsar créditos si es necesario
    await this.refundAICredits(userId);

    return status;
  }

  // ✅ Métodos auxiliares privados
  async checkAIRateLimit(userId, subscription) {
    const plan = subscription.subscription.plan;
    const usage = await this.deps.usageRepository.getMonthlyUsage(userId);
    
    const limits = {
      basic: 100,
      premium: 1000,
      enterprise: 10000
    };

    return usage.aiRequests < (limits[plan] || 0);
  }

  enrichPromptWithContext(prompt, userProfile) {
    return `User: ${userProfile.displayName} (${userProfile.language})
Context: ${userProfile.industry || 'general'}
    
${prompt}`;
  }

  calculateRemainingCredits(subscription) {
    const plan = subscription.subscription.plan;
    const limits = { basic: 100, premium: 1000, enterprise: 10000 };
    return limits[plan] || 0;
  }

  async enrichStatusWithUserData(status, userId) {
    const userProfile = await this.identityACL.getUserProfileForDisplay(userId);
    return {
      ...status,
      userDisplayName: userProfile.displayName,
      userLanguage: userProfile.language
    };
  }

  async recordAIUsage(userId, plan) {
    await this.deps.usageRepository.incrementAIUsage(userId, plan);
  }

  async refundAICredits(userId) {
    await this.deps.usageRepository.decrementAIUsage(userId);
  }
}

module.exports = AIACL;