const SubscriptionACL = require('./SubscriptionACL');
const SubscriptionContract = require('../contracts/SubscriptionContract');

describe('SubscriptionACL with versioned contract', () => {
  let identityContractMock;
  let subscriptionContractMock;
  let acl;

  beforeEach(() => {
    identityContractMock = { getUserInfo: jest.fn() };
    subscriptionContractMock = new SubscriptionContract({
      httpClient: { get: jest.fn() },
      logger: console
    });
    acl = new SubscriptionACL(identityContractMock, subscriptionContractMock);
  });

  it('should return combined user info, subscription, and version', async () => {
    const userId = 'user123';
    const fakeUserInfo = { id: userId, name: 'Alice' };
    const fakeSubscription = { plan: 'Premium', status: 'active', expiresAt: '2025-12-31' };

    identityContractMock.getUserInfo.mockResolvedValue(fakeUserInfo);
    subscriptionContractMock.http.get.mockResolvedValue(fakeSubscription);

    const result = await acl.getUserSubscriptionWithProfile(userId);

    expect(result.contractVersion).toBe('v2');
    expect(subscriptionContractMock.http.get).toHaveBeenCalledWith(
      `/subscriptions/${userId}`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-contract-version': 'v2' })
      })
    );
  });

  it('should throw versioned errors if contract fails', async () => {
    const userId = 'user123';
    identityContractMock.getUserInfo.mockResolvedValue({ id: userId, name: 'Alice' });
    subscriptionContractMock.http.get.mockRejectedValue(new Error('500 Internal Error'));

    await expect(acl.getUserSubscriptionWithProfile(userId)).rejects.toThrow('GetUserSubscription_FAILED_v2');
  });
});
