// oidc-setup.js - OIDC Client Configuration
const oidcClient = new auth0Issuer.Client({
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,  // Solo esto
  redirect_uris: [process.env.AUTH0_REDIRECT_URI],
  response_types: ['code']
});

// Login 
app.get('/auth/login', (req, res) => {
  const authUrl = getOIDCClient().authorizationUrl({
    scope: 'openid profile email'
  });
  res.redirect(authUrl);
});