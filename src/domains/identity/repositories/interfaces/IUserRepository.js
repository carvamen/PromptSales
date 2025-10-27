// domains/identity/repositories/interfaces/IUserRepository.js
class IUserRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async save(user) { throw new Error('Not implemented'); }
  async update(user) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async exists(email) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;