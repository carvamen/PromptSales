# PromptSales
PromptSales - Ecosistema de Marketing con IA

## Non-Functional Metrics

### Index
- [Performance](#performance)
- [Scalability](#scalability)  
- [Reliability](#reliability)
- [Availability](#availability)
- [Security](#seguridad)
- [Maintainability](#maintainability)
- [Interoperability](#interoperability)
- [Compliance](#compliance)
- [Extensibility](#extensibility)

### Performance
*Documentar aquí métricas de performance*

### Scalability
*Documentar aquí métricas de escalabilidad*

### Reliability
*Documentar aquí métricas de confiabilidad*

### Availability
*Documentar aquí métricas de disponibilidad*

### Seguridad

#### Autenticación y Autorización
**Implementación:** OpenID Connect (OIDC) utilizando Auth0 como proveedor de identidad con validación stateless de JWT

**Arquitectura sugerida:**
- Auth0 maneja la autenticación de usuarios y emite tokens JWT
- Express.js con librería `openid-client` para integración OIDC
- Validación stateless de tokens para escalado de Knative
- Flujo estándar Authorization Code con autenticación de cliente

**Estructura sugerida:**
```
apps/
├── shared/
│   ├── auth/                   # SEGURIDAD COMPARTIDA
│   │   ├── oidc-setup.js
│   │   └── middleware.js
│   └── package.json
├── prompt-content/
│   ├── server.js              # Importa desde shared/auth
│   └── package.json
├── prompt-ads/
│   ├── server.js              # Importa desde shared/auth  
│   └── package.json
└── prompt-crm/
    ├── server.js              # Importa desde shared/auth
    └── package.json
```

**Flujo de autenticación:**

```javascript
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
```

**Middleware de Validación JWT**
```javascript
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
```

**Ejemplo de Implementación del Middleware:**
```javascript
// apps/prompt-content/server.js
import { requireAuth } from '../../shared/auth/middleware.js';
import { setupOIDC } from '../../shared/auth/oidc-setup.js';

// Usar el middleware compartido
app.get('/api/protected', requireAuth, (req, res) => {
  // Lógica a implementar de promptContent
});
```

**Configuración de Audience por Servicio:**
```yaml
# Variables de Ambiente del Servicio Knative
# PromptContent Service
env:
- name: AUTH0_AUDIENCE
  value: "https://api.prompt-content.promptsales.com"
- name: AUTH0_ISSUER
  value: "https://promptsales-prod.auth0.com/"

# PromptAds Service  
env:
- name: AUTH0_AUDIENCE
  value: "https://api.prompt-ads.promptsales.com"
- name: AUTH0_ISSUER
  value: "https://promptsales-prod.auth0.com/"

# PromptCrm Service
env:
- name: AUTH0_AUDIENCE
  value: "https://api.prompt-crm.promptsales.com"
- name: AUTH0_ISSUER
  value: "https://promptsales-prod.auth0.com/"
```


#### Gestión de Secrets
**Implementación:** External Secrets Operator + AWS Secrets Manager con IAM Roles for Service Accounts (IRSA)

**Arquitectura:**
- **AWS Secrets Manager**: Almacenamiento seguro centralizado para todos los secrets
- **External Secrets Operator**: Sincroniza secrets a Kubernetes usando IRSA
- **Autenticación IRSA**: Acceso basado en identidad sin credenciales estáticas
- **Integración Knative**: Secrets inyectados como variables de ambiente

**Estructura de Directorios sugerida:**
```
k8s/
├── irsa/
│   ├── oidc-provider.yaml      # Configuración OIDC de EKS
│   └── iam-roles.yaml          # Definiciones de roles IAM
├── external-secrets/
│   ├── service-account.yaml    # Service account habilitado para IRSA
│   ├── secret-store.yaml       # Conexión a AWS Secrets Manager
│   └── external-secret.yaml    # Definiciones de secrets
└── knative/
    └── prompt-content.yaml     # Despliegue de aplicación
```

**Configuración del Service Account para IRSA:**
```yaml
# k8s/external-secrets/service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-secrets-sa
  namespace: external-secrets
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/ExternalSecretsAccessRole
```

**Configuración de AWS SecretStore con IRSA:**
```yaml
# k8s/external-secrets/secret-store.yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secret-store
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa  # Usa IRSA en lugar de credenciales estáticas
```

**External Secret para Auth0:**
```yaml
# k8s/external-secrets/external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: auth0-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secret-store
  target:
    name: auth0-secret
  data:
  - secretKey: client-id
    remoteRef:
      key: auth0/production
      property: client-id
  - secretKey: client-secret
    remoteRef:
      key: auth0/production
      property: client-secret
```

**Integración del Servicio Knative:**
```yaml
# k8s/knative/prompt-content.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: prompt-content
spec:
  template:
    spec:
      containers:
      - image: acr-promptsales.azurecr.io/prompt-content:latest
        env:
        - name: AUTH0_ISSUER
          value: "https://promptsales-prod.auth0.com/"
        - name: AUTH0_AUDIENCE
          value: "https://api.prompt-content.promptsales.com"
        - name: AUTH0_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: auth0-secret
              key: client-id
        - name: AUTH0_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth0-secret
              key: client-secret
        - name: AUTH0_REDIRECT_URI
          value: "https://prompt-content.promptsales.com/auth/callback"
```

### Maintainability
*Documentar aquí métricas de mantenibilidad*

### Interoperability
*Documentar aquí métricas de interoperabilidad*

### Compliance
*Documentar aquí métricas de cumplimiento*

### Extensibility
*Documentar aquí métricas de extensibilidad*

---
## 2. Domain Driven Design

### 2.1 Dominios globales y dominios por subempresa

#### 2.1.1 Dominios globales

#### identidad
- cubre: login, roles/permisos, organizaciones 
- objetivo: acceso seguro y mínimo necesario

#### suscripciones
- cubre: planes/tiers por subempresa y bundles
- objetivo: alta/baja, límites de uso y renovaciones

#### pagos
- cubre: cobros, facturación, prorrateo y reembolsos
- objetivo: registrar transacciones y estados de pago

#### almacenamiento
- cubre: guardar archivos y datos grandes en la nube
- objetivo: acceso rápido, versionado básico y permisos

#### integraciones
- cubre: conexiones con APIs externas 
- objetivo: credenciales, reintentos, cuotas y errores

#### analítica
- cubre: métricas unificadas, dashboards, exportes
- objetivo: funnels, ROI/ROAS y performance por cliente/campaña

#### agenda
- cubre: calendarios, recordatorios, reintentos y ventanas
- objetivo: ejecutar tareas en el tiempo correcto

#### aprobaciones
- cubre: revisión humana antes de publicar/ejecutar
- objetivo: trazabilidad de quién aprobó qué y cuándo

#### notificaciones
- cubre: avisos internos (email/SMS/push) no-marketing
- objetivo: informar estados, errores y pendientes

#### IA
- cubre: uso de modelos (prompts, costos/tokens, guardrails)
- objetivo: reutilizar y controlar servicios de IA

#### cache
- cubre: resultados temporales (Redis), aceleración de consultas
- objetivo: bajar llamadas a APIs y mejorar latencia

#### auditoría y eventos
- cubre: logs, eventos de negocio y retención
- objetivo: cumplimiento (GDPR/CCPA) y trazabilidad

#### clientes y productos
- cubre: empresas, contactos clave, portafolio y presupuestos
- objetivo: base común para contenido, ads y CRM

#### redes sociales
- cubre: páginas/perfiles, publicación, comentarios/DMs y moderación (FB/IG/TikTok/LinkedIn/X)
- objetivo: unificar permisos, webhooks, rate limits y flujo de community management

#### mensajería multicanal
- cubre: WhatsApp, SMS, Email, Webchat, Voz/IVR y Push (envío/recepción, plantillas, webhooks)
- objetivo: unificar canales, proveedores (Twilio/Sinch/WhatsApp), opt-in/opt-out, rate limits y failover de canal


####  2.1.2 Dominios por subempresa

#### PromptContent

#### contenidos
- cubre: creación y edición de piezas
- objetivo: producir materiales listos para aprobar/publicar

#### plantillas
- cubre: guías de estilo, prompts base, formatos
- objetivo: reutilizar estilos por marca/país

#### almacenamiento
- cubre: almacenamiento de piezas y assets (texto, imagen, video), versiones y permisos
- objetivo: acceso rápido y seguro; si se integra en 'contenidos', limitarlo a assets del área


#### derechos
- cubre: licencias, expiraciones y restricciones por canal/país
- objetivo: evitar publicaciones fuera de licencia


#### PromptAds

#### campañas
- cubre: objetivos, canales, calendario y KPIs
- objetivo: planificar qué se lanza y cuándo

#### anuncios 
- cubre: creación/actualización de ad sets y anuncios
- objetivo: publicar y sincronizar con las plataformas

#### audiencias
- cubre: segmentación, lookalikes y sincronización
- objetivo: dirigir anuncios al público correcto


#### redes sociales
- cubre: gestión de perfiles/canales (FB/IG/TikTok/LinkedIn/X), publicación, comentarios/DMs
- objetivo: unificar permisos, webhooks y límites por canal para campañas de Ads

#### analítica
- cubre: métricas de campañas y anuncios (ROAS, CTR, CPC, conversiones)
- objetivo: insights y paneles para optimizar inversión publicitaria

#### políticas de plataforma
- cubre: validaciones, rechazos y apelaciones
- objetivo: evitar bloqueos en Google/Meta/TikTok/etc.


#### PromptCrm

#### leads
- cubre: captura multi-fuente, normalización y enrutamiento
- objetivo: asignar rápido al mejor agente/equipo

#### contactos y cuentas
- cubre: perfiles, empresas y roles
- objetivo: historial de interacciones y contexto comercial

#### conversaciones
- cubre: chat/voz, plantillas, estados y transcripts
- objetivo: automatizar con bots y handoff a humano

#### oportunidades
- cubre: etapas, montos, probabilidades y forecast
- objetivo: priorizar y cerrar ventas

#### tareas y SLA
- cubre: pendientes, vencimientos y responsables
- objetivo: cumplir tiempos de respuesta y seguimiento

#### ventas
- cubre: pedidos, cotizaciones, contratos y estados de cierre
- objetivo: formalizar el cierre comercial y su trazabilidad

#### transacciones
- cubre: pagos asociados a ventas, estados y reembolsos
- objetivo: registrar movimiento financiero por oportunidad/pedido

