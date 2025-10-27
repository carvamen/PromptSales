const SubscriptionACL = require('./SubscriptionACL');

describe('SubscriptionACL', () => {
  let identityContractMock;
  let subscriptionContractMock;
  let acl;

  beforeEach(() => {
    identityContractMock = {
      getUserInfo: jest.fn()
    };
    subscriptionContractMock = {
      getUserSubscription: jest.fn()
    };

    acl = new SubscriptionACL(identityContractMock, subscriptionContractMock);
  });

  it('should return combined user info and subscription', async () => {
    // Arrange
    const userId = 'user123';
    const fakeUserInfo = { id: userId, name: 'Alice' };
    const fakeSubscription = { plan: 'Premium', expires: '2025-12-31' };

    identityContractMock.getUserInfo.mockResolvedValue(fakeUserInfo);
    subscriptionContractMock.getUserSubscription.mockResolvedValue(fakeSubscription);

    // Act
    const result = await acl.getUserSubscriptionWithProfile(userId);

    // Assert
    expect(result).toEqual({
      user: fakeUserInfo,
      subscription: fakeSubscription
    });

    // Ensure the mocks were called correctly
    expect(identityContractMock.getUserInfo).toHaveBeenCalledWith(userId);
    expect(subscriptionContractMock.getUserSubscription).toHaveBeenCalledWith(userId);
  });

  it('should propagate errors from identityContract', async () => {
    const userId = 'user123';
    identityContractMock.getUserInfo.mockRejectedValue(new Error('Identity service failed'));

    await expect(acl.getUserSubscriptionWithProfile(userId))
      .rejects
      .toThrow('Identity service failed');
  });

  it('should propagate errors from subscriptionContract', async () => {
    const userId = 'user123';
    identityContractMock.getUserInfo.mockResolvedValue({ id: userId, name: 'Alice' });
    subscriptionContractMock.getUserSubscription.mockRejectedValue(new Error('Subscription service failed'));

    await expect(acl.getUserSubscriptionWithProfile(userId))
      .rejects
      .toThrow('Subscription service failed');
  });
});
