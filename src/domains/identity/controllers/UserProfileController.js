// domains/identity/controllers/UserProfileController.js
const RepositoryFactory = require('../../../infrastructure/repositories/RepositoryFactory');

class UserProfileController {
  constructor() {
    this.userRepository = RepositoryFactory.getUserRepository();
  }

  async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      const profileData = req.body;

      // Get user from repository
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Use domain logic
      user.updateProfile(profileData);

      // Save through repository
      await this.userRepository.update(user);

      return res.json({ 
        message: 'Profile updated successfully',
        user: user 
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserProfileController;