// domains/identity/repositories/UserRepository.js
const IUserRepository = require('./interfaces/IUserRepository');
const User = require('../entities/User');

class UserRepository extends IUserRepository {
  constructor(database) {
    super();
    this.db = database;
    this.collection = this.db.collection('users');
  }

  async findById(id) {
    const userData = await this.collection.findOne({ _id: id });
    if (!userData) return null;
    
    return new User({
      id: userData._id,
      email: userData.email,
      username: userData.username,
      profile: userData.profile,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    });
  }

  async findByEmail(email) {
    const userData = await this.collection.findOne({ email });
    if (!userData) return null;
    
    return new User({
      id: userData._id,
      email: userData.email,
      username: userData.username,
      profile: userData.profile,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    });
  }

  async save(user) {
    const userData = {
      email: user.email,
      username: user.username,
      profile: user.profile,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    };

    const result = await this.collection.insertOne(userData);
    user.id = result.insertedId;
    return user;
  }

  async update(user) {
    await this.collection.updateOne(
      { _id: user.id },
      { 
        $set: {
          email: user.email,
          username: user.username,
          profile: user.profile,
          updatedAt: new Date()
        }
      }
    );
    return user;
  }
}

module.exports = UserRepository;