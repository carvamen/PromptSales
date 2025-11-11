// src/domains/subscriptions/controllers/SubscriptionRenewalController.js
const SubscriptionContractFactory = require('../contracts/SubscriptionContractFactory');
const SubscriptionContractMapper = require('../contracts/SubscriptionContractMapper');

class SubscriptionRenewalController {
  constructor(deps) {
    this.deps = deps;
    this.logger = deps.logger || console;
  }

  async getUserSubscription(req, res) {
    try {
      const { userId } = req.params;
      const version = req.headers['api-version'] || 
                     req.query.version || 
                     SubscriptionContractFactory.getDefaultVersion();

      // Validate version
      if (!SubscriptionContractFactory.isVersionSupported(version)) {
        return res.status(400).json({
          error: 'Unsupported API version',
          supportedVersions: SubscriptionContractFactory.getSupportedVersions(),
          requestedVersion: version
        });
      }

      // Get appropriate contract version
      const contract = SubscriptionContractFactory.create(version, this.deps);
      
      // Use contract
      const subscriptionData = await contract.getUserSubscription(userId);
      
      // Optional: Transform to specific response format if needed
      const response = SubscriptionContractMapper.toDomainResponse(
        subscriptionData, 
        version
      );

      res.json({
        version,
        data: response,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Subscription retrieval failed:', error);
      
      if (error.message.includes('Unsupported version')) {
        return res.status(400).json({
          error: 'Unsupported API version',
          supportedVersions: SubscriptionContractFactory.getSupportedVersions()
        });
      }

      res.status(500).json({
        error: 'Failed to retrieve subscription',
        details: error.message
      });
    }
  }

  async getRemovedData(req, res) {
    try {
      const { userId } = req.params;
      const version = req.headers['api-version'] || req.query.version || 'v2';

      // Only v2 and v3 support removed data
      if (version === 'v1') {
        return res.status(404).json({
          error: 'Method not available in v1',
          availableFrom: 'v2'
        });
      }

      const contract = SubscriptionContractFactory.create(version, this.deps);
      const removedData = await contract.getRemovedData(userId);

      res.json({
        version,
        ...removedData
      });

    } catch (error) {
      this.logger.error('Removed data retrieval failed:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SubscriptionRenewalController;