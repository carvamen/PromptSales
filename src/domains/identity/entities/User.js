// domains/identity/entities/User.js
class User {
  constructor({ id, email, username, profile, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.profile = profile;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updateProfile(profileData) {
    this.profile = { ...this.profile, ...profileData };
    this.updatedAt = new Date();
  }

  // Domain logic methods
  canAccessResource(resource) {
    return this.profile.roles.includes(resource.requiredRole);
  }
}

module.exports = User;