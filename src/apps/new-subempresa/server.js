// src/apps/prompt-content/server.js
const express = require('express');
const RepositoryFactory = require('../../infrastructure/repositories/RepositoryFactory');
const UserProfileController = require('../../domains/identity/controllers/UserProfileController');

const app = express();
app.use(express.json());

// Inject repositories
const userController = new UserProfileController();

app.patch('/users/:userId/profile', (req, res) => 
  userController.updateProfile(req, res)
);


// apps/prompt-content/server.js
import { requireAuth } from '../../shared/auth/middleware.js';
import { setupOIDC } from '../../shared/auth/oidc-setup.js';

// Usar el middleware compartido
app.get('/api/protected', requireAuth, (req, res) => {
  // Lógica a implementar de promptContent
});

module.exports = app;