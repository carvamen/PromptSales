# PromptSales
PromptSales - Ecosistema de Marketing con IA

## 1. Non-Functional Metrics

### Index
- [Performance](#performance)
- [Scalability](#scalability)  
- [Reliability](#reliability)
- [Availability](#availability)
- [Security](#seguridad)
- [Maintainability](#mantenibilidad)
- [Interoperability](#interoperability)
- [Compliance](#compliance)
- [Extensibility](#extensibility)

### 1.1 Performance
*Documentar aquí métricas de performance*

### 1.2 Scalability
*Documentar aquí métricas de escalabilidad*

### 1.3 Reliability
*Documentar aquí métricas de confiabilidad*

### 1.4 Availability
*Documentar aquí métricas de disponibilidad*

### 1.5 Seguridad

#### 1.5.1 Autenticación y Autorización
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

#### 1.5.2 Cifrado TLS 1.3 en comunicación y AES-256 en reposo.

#### Bases de datos elegidas y cifrado
Usaremos: SQL Server, MongoDB y Redis.

#### Selección de cifrado por BD 
- SQL Server (RDS/EC2):
  - En reposo: AWS KMS AES-256 (Storage Encryption) + TDE AES-256 si la edición lo soporta.
  - En tránsito: TLS 1.2+ (connection string: encrypt=true; trustServerCertificate=false).

- MongoDB (Atlas / self-managed):
  - En reposo: SSE-KMS AES-256; opcional Field Level Encryption (AES-256) para PII.
  - En tránsito: TLS (connection string con tls=true).

- Redis (ElastiCache):
  - En reposo: KMS AES-256 (AtRestEncryptionEnabled: true).
  - En tránsito: TLS (TransitEncryptionEnabled: true).

**Ingress ALB (TLS 1.3)**
```yaml
# k8s/ingress/alb-tls13.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: promptsales-alb
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:111122223333:certificate/REEMPLAZAR-POR-ARN
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS13-1-2-2021-06
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
  - host: api.promptsales.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kourier
            port:
              number: 80
```

**Conexión SQL Server**
#### k8s/sqlserver/sqlserver-connection.json
```JSON
{
  "driver": "msnodesqlv8 or tedious",
  "server": "REEMPLAZAR-SQLSERVER-ENDPOINT",
  "database": "promptsales",
  "authentication": {
    "type": "default"
  },
  "options": {
    "encrypt": true,
    "trustServerCertificate": false,
    "requestTimeout": 30000
  }
}
```

#### k8s/mongodb/mongo-connection.json
**Conexión MongoDB**
```JSON
{
  "uri": "mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/promptsales?retryWrites=true&w=majority&tls=true",
  "options": {
    "serverSelectionTimeoutMS": 30000
  }
}
```

**ElastiCache Redis**
```yaml
# k8s/redis/elasticache-redis.yaml 
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  RedisReplicationGroup:
    Type: AWS::ElastiCache::ReplicationGroup
    Properties:
      ReplicationGroupId: promptsales-redis
      ReplicationGroupDescription: Redis with in-transit and at-rest encryption
      Engine: redis
      EngineVersion: '7.1'
      CacheNodeType: cache.t3.micro
      NumNodeGroups: 1
      ReplicasPerNodeGroup: 1
      TransitEncryptionEnabled: true          # TLS en tránsito
      AtRestEncryptionEnabled: true           # AES-256 en reposo (KMS)
      KmsKeyId: arn:aws:kms:us-east-1:111122223333:key/REEMPLAZAR-CMK
      AutomaticFailoverEnabled: true
      MultiAZEnabled: true
```

**EKS — etcd Encryption**
```yaml
# k8s/eks/etcd-encryption.yaml 
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
- resources:
  - secrets
  providers:
  - kms:
      name: awskms
      endpoint: unix:///var/run/kmsplugin/socket.sock
  - identity: {}
```

**TLS hacia Redis**
```javascript
// nodejs/redis-tls.js

import Redis from "ioredis";
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  tls: {}  // habilita TLS
});
```

**TLS en el ALB**
```javascript
// nodejs/express-proxy.js

import express from "express";
const app = express();
app.set("trust proxy", true);  // respeta X-Forwarded-Proto/For
```


### 1.6 Maintainability

#### Proceso de Mantenimiento

#### Mantenimiento Durante Desarrollo

#### Sistema de Tickets
- **Plataforma**: Jira Service Management ([REST API Reference](https://developer.atlassian.com/cloud/jira/service-desk/rest/))
- **Flujo estandarizado**: Creación → Clasificación → Asignación → Resolución → Cierre
- **Tipos de tickets**: Bug, Feature Request, Hotfix, Mejora, Tarea técnica

####  GitFlow Implementado
```
main          # Producción estable (tags semánticos: v1.0.0, v1.1.0)
develop       # Integración para próximo release
feature/      # Desarrollo de nuevas funcionalidades
hotfix/       # Correcciones urgentes de producción
```
**Referencia**: [Semantic Versioning 2.0.0](https://semver.org/)

####  Estrategia de Branching
```bash
feature/user-auth-v2     # Nueva funcionalidad
hotfix/critical-security # Parche urgente
```

#### Release Process
- **Frecuencia**: Cada 3 semanas mediante pipeline CI/CD automatizado
- **Versionado**: Semantic Versioning (MAJOR.MINOR.PATCH)
- **Proceso**: 
  1. Branch `release/v1.2.0` creado desde `develop`
  2. Merge a `main` con tag de versión (ej. `v1.2.0`)
  3. Despliegue automatizado a Knative con rolling updates
  4. Validación por QA y Release Manager
  5. Merge back a `develop`

#### Procedimientos Kubernetes/Knative
- **Despliegues**: Rolling updates con Knative Services
- **Rollback**: Automático si health check falla (max 2% error rate)
- **Escalado**: Configuración de minScale=1 para servicios críticos
- **Health Checks**: Verificación continua de réplicas y readiness probes

#### Procedimiento de Hot Fixes

##### Hotfix Estándar
- **Origen**: Branch `hotfix/<descripción>` desde `main`
- **Responsables**: Equipo de desarrollo + Release Manager
- **Validación**: Test rápido en ambiente staging
- **Deployment**: Pipeline con approval manual en ArgoCD
- **Merge**: A `main` (nuevo tag) y `develop` post-despliegue

##### Hotfix de Emergencia (Severidad 1)
- **Origen**: Branch `hotfix/emergency-<descripción>` desde `main`
- **Proceso**: 
  1. Build automático + test unitarios básicos
  2. Deployment directo a producción
  3. Approval posterior dentro de 24 horas
  4. Validación y merge back obligatorio
- **Trazabilidad**: Commit vinculado a ticket Jira (ej. `JIRA-123 hotfix: auth token`)

**Mantenimiento Después de Implementación**

**Niveles de Soporte**

##### L1 - Soporte Autogestionado
- **Medio**: Documentación, video-tutoriales, RAG en WhatsApp
- **Cobertura**: Respuestas automáticas a consultas frecuentes
- **Objetivo**: Resolución inmediata sin intervención humana

##### L2 - Soporte Técnico Básico
- **Medio**: Email a support@promptsales.com
- **SLA**: 
  - Respuesta inicial: 8 horas hábiles
  - Resolución completa: 4 días hábiles máximo
- **Alcance**: Configuración, uso básico, troubleshooting inicial

##### L3 - Soporte de Desarrollo
- **Medio**: Sistema de ticketing (Jira Service Management)
- **Escalación**: Desde L2 cuando se requiere intervención de desarrollo
- **SLAs por Severidad**:
  - **Severidad 1** (Crítico): Respuesta < 1 hora, Resolución < 4 horas
  - **Severidad 2** (Alto): Respuesta < 4 horas hábiles, Resolución < 24 horas
  - **Severidad 3** (Medio): Respuesta < 8 horas hábiles, Resolución < 3 días
  - **Severidad 4** (Bajo): Respuesta < 24 horas hábiles, Resolución < 1 semana
- **Cobertura**: Bugs, incidentes críticos, requerimientos de desarrollo

#### Sistema de Ticketing para L3
- **Plataforma**: Jira Service Management integrado con repositorio Git
- **Flujo**: 
  1. Creación desde portal de soporte
  2. Clasificación automática por categoría y severidad
  3. Asignación a equipo de desarrollo correspondiente
  4. Seguimiento con updates automáticos al usuario
  5. Cierre con confirmación de resolución
- **Métricas**: 
  - Tiempo promedio de resolución por severidad
  - Tickets escalados desde L2
  - Satisfacción del usuario post-soporte

#### Responsabilidades por Rol
- **Release Manager**: Aprobación final de releases y hotfixes, coordinación de despliegues
- **Dev Team**: Desarrollo, testing y resolución de tickets L3 según severidad
- **QA Team**: Validación en staging pre-release y post-hotfix
- **Support L2**: Filtro, clasificación de severidad y escalación a desarrollo

#### Indicadores de Mantenibilidad
- **Tiempo medio de resolución (MTTR)**: < 48h promedio
- **Frecuencia de hotfixes por release**: ≤ 1 por ciclo
- **Tickets reabiertos**: < 10%
- **Integridad del release (builds exitosos)**: > 95%
- **SLA cumplimiento por severidad**: > 90%

Estos indicadores se revisan al cierre de cada release para evaluar la estabilidad y mantenibilidad del ecosistema PromptSales.

### 1.7 Interoperability
*Documentar aquí métricas de interoperabilidad*

### 1.8 Compliance
*Documentar aquí métricas de cumplimiento*

### 1.9 Extensibility
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

