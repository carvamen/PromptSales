// middleware.js - Validación Stateless de JWT
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { URL } from 'url';

const issuer = process.env.AUTH0_ISSUER; // "https://promptsales-prod.auth0.com/"
const jwksUri = `${issuer}.well-known/jwks.json`; // or issuer + '/.well-known/jwks.json'
const JWKS = createRemoteJWKSet(new URL(jwksUri));

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

    const token = auth.slice(7);
    // jwtVerify validará automáticamente la firma y 'exp'
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: issuer,
      audience: process.env.AUTH0_AUDIENCE // Crítico para aislamiento de servicios
      // algorithms: ['RS256'] // jose selecciona desde JWKS 
    });

    // VALIDACIÓN ROBUSTA DE AUDIENCE (soporta string o array)
    const expectedAudience = process.env.AUTH0_AUDIENCE;
    const tokenAudience = payload.aud;
    const isValidAudience = Array.isArray(tokenAudience) 
      ? tokenAudience.includes(expectedAudience)
      : tokenAudience === expectedAudience;

    if (!isValidAudience) {
      return res.status(401).json({ error: 'Invalid token audience' });
    }

    req.user = payload;
    return next();
  } catch (err) {
    console.error('JWT validation error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}