# PromptSales
PromptSales - Ecosistema de Marketing con IA

**Estructura del proyecto**
```
.
├── README.md
├── assets/
│   └── DDD-DataFlow.svg
├── contracts/
│   ├── rest/
│   │   ├── identity-openapi.yaml
│   │   ├── subscription-openapi.yaml
│   │   ├── payment-openapi.yaml
│   │   ├── ads-openapi.yaml
│   │   ├── content-openapi.yaml
│   │   └── crm-openapi.yaml
│   └── mcp/
│       ├── ads-orchestrator.json
│       ├── content-tools.json
│       └── crm-automation.json
├── webhooks/
│   ├── topics.md
│   └── schemas/
│       ├── crm.lead.created.json
│       └── ads.campaign.created.json
├── compliance/
│   ├── owasp/
│   │   ├── dast-report-latest.md
│   │   └── sast-report-latest.md
│   ├── gdpr/
│   │   ├── data-map.md
│   │   ├── retention-policy.md
│   │   └── dsr-procedure.md
│   └── payments/
│       ├── psp-list.md
│       └── webhook-signing.md
├── k8s/
│   ├── knative/
│   │   ├── prompt-content.yaml
│   │   ├── prompt-ads.yaml
│   │   └── prompt-crm.yaml
│   ├── api-gateway/           # ← NUEVO
│   │   ├── kong-deployment.yaml
│   │   ├── kong-routes.yaml
│   │   └── kong-plugins.yaml
│   ├── ingress/
│   │   └── alb-tls13.yaml
│   ├── external-secrets/
│   │   ├── service-account.yaml
│   │   ├── secret-store.yaml
│   │   └── external-secret.yaml
│   ├── eks/
│   │   └── etcd-encryption.yaml
│   ├── sqlserver/
│   │   └── sqlserver-connection.json
│   ├── mongodb/
│   │   └── mongo-connection.json
│   └── redis/
│       └── elasticache-redis.yaml
└── src/
    ├── shared/
    │   ├── auth/
    │   │   ├── oidc-setup.js          
    │   │   └── middleware.js         
    │   ├── http/
    │   │   ├── errors.js
    │   │   └── idempotency.js
    │   ├── observability/
    │   │   ├── logger.js
    │   │   └── tracing.js
    │   └── utils/
    ├── gateways/
    │   ├── rest/
    │   │   └── AdsChannelClient.js
    │   ├── mcp/
    │   │   └── AdsOrchestratorClient.js
    │   └── webhooks/
    │       ├── verifySignature.js
    │       └── receiver.js
    ├── domains/
    │   ├── identity/
    │   │   ├── contracts/
    │   │   │   └── IdentityContract.js
    │   │   └── controllers/
    │   │       ├── UserProfileController.js
    │   │       ├── AuthenticationController.js
    │   │       └── LoginController.js
    │   ├── subscriptions/
    │   │   ├── contracts/
    │   │   │   └── SubscriptionContract.js
    │   │   ├── controllers/
    │   │   │   └── SubscriptionRenewalController.js
    │   │   └── acl/
    │   │       └── SubscriptionACL.js
    │   ├── payments/
    │   │   ├── contracts/
    │   │   │   └── PaymentContract.js
    │   │   ├── controllers/
    │   │   │   ├── InvoiceController.js
    │   │   │   ├── PaymentController.js
    │   │   │   └── RefundController.js
    │   │   └── acl/
    │   │       └── PaymentACL.js
    │   ├── ads/
    │   │   ├── contracts/
    │   │   └── controllers/
    │   │       ├── CampaignController.js
    │   │       ├── AudienceController.js
    │   │       └── PolicyController.js
    │   ├── content/
    │   │   └── controllers/
    │   │       ├── ContentController.js
    │   │       └── AssetController.js
    │   ├── crm/
    │   │   └── controllers/
    │   │       ├── LeadController.js
    │   │       ├── ConversationController.js
    │   │       └── OpportunityController.js
    │   ├── analytics/
    │   ├── notifications/
    │   ├── approvals/
    │   ├── agenda/
    │   ├── integrations/
    │   ├── ia/
    │   ├── cache/
    │   ├── audit-events/
    │   ├── clients-products/
    │   ├── social/
    │   └── messaging-multicanal/
    ├── apps/
    │   ├── prompt-content/
    │   │   └── server.js
    │   ├── prompt-ads/
    │   │   └── server.js
    │   └── prompt-crm/
    │       └── server.js
    └── jest/
        └── SubscriptionTests.js


```

# 1. Métricas no funcionales

Para todas las métricas no funcionales y la estructura general del ecosistema PromptSales, incluyendo los tres subservicios (PromptContent, PromptAds y PromptCrm), se adopta una arquitectura **Serverless** desplegada en **AWS** mediante Knative sobre **Kubernetes** (EKS), con bases de datos relacionales sobre **SQL Server** y no relacionales sobre **MongoDB**. Así como el uso de **JavaScript (Node.js)** como framework para la capa de ejecución de microservicios, asegurando así la compatibilidad con el modelo de funciones isoladas y un escalado horizontal dinámico basado en demanda.


## Index
- [Performance](#rendimiento)
- [Scalability](#scalability)  
- [Reliability](#reliability)
- [Availability](#availability)
- [Security](#seguridad)
- [Maintainability](#mantenibilidad)
- [Interoperability](#interoperability)
- [Compliance](#compliance)
- [Extensibility](#extensibility)

## 1.1 Rendimiento

### Benchmark Aurora:
https://aws.amazon.com/blogs/database/benchmarking-amazon-aurora-limitless-with-pgbench/.

* **Promedio en 1 hora:** **~2,042 transacciones por segundo** con **~49 milisegundos** de latencia media; **0 fallos** reportados.
* **Al final de la hora (estado estable):** **~2,485 transacciones por segundo** con **~40 milisegundos** de latencia.

#### Cálculo de referencia

* **Unidad base (observada):** **~2,042 transacciones por segundo** (**122,520 transacciones por minuto**).

### Benchmark Redis
https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/

* Se usaron 50 clientes simultáneos y 5 millones de solicitudes
* Tiempo máximo para operaciones de cache 500 ms

### Servidores
* Objetivo: 100000 transacciones / 60 segundos = 16.667 transacciones por segundo
* Dividimos nuestro objetivo entre el TPS según el servidor
* Suponiendo que tenemos los equivalentes a estos servidores en AWS, asumimos un número de transacciones por segundo (TPS):

| Servidor      | CPU       | Memoria | TPS asumido | Instancias requeridas |
|---------------|----------|---------|--------------| ------------|
| m6i.2xlarge | 8 cores  | 32 GB   | 1000          | 17 |
| m6i.4xlarge | 16 cores | 64 GB   | 2000          | 9 |

* También se puede tener una combinación, por ejemplo 5 servidores m6i.4xlarge y 7 m6i.2xlarge para cubrir el objetivo.

## 1.2 Escalabilidad
El ecosistema PromptSales utiliza Knative sobre Kubernetes para escalar dinámicamente los servicios según demanda.

**Kubernetes Cluster:**

* Cluster con mínimo 9 nodos base m6i.4xlarge o el equivalente.
* Escalado automático hasta 90 nodos m6i.4xlarge.
* **Meta de capacidad global:** igualar/superar **166,667 transacciones/segundo** (10x de la capacidad base) manteniendo **~40–49 ms** de latencia media (referencia del benchmark).

**Knative Autoscaling Policy:**

* Escalado basado en concurrency per pod
* Promedio target = 100 req/pod
* **MaxScale por servicio (estimado):** se ajustará para alcanzar el **objetivo máximo de 166,667 TPS** una vez medido el **RPS por pod** en staging (se derivará `maxScale = ceil(TPS_obj / RPS_por_pod)`).

**Load Balancing:**

* KLB (Knative Load Balancer) distribuye el tráfico de manera uniforme
* Integración con AWS Application Load Balancer (ALB)

**Archivo de configuración Kubernetes:**

![kubernetes-config.yaml](/k8s/knative/kubernetes-config.yaml)

## 1.3 Confiabilidad

Se refiere al **monitoreo**, **detección temprana de fallos** y **recuperación automatizada**.

Nuestro sistema se basa en una arquitectura **Serverless** y **Kubernetes (Knative)** sobre **AWS**; por consistencia operativa y menor complejidad, priorizamos **servicios nativos de AWS** e integración directa con Knative.

### Monitoreo y trazabilidad

* Se va a usar **Amazon CloudWatch** de **AWS** para **métricas, logs y alarmas** (CPU, memoria vía Container Insights, latencia, códigos HTTP, colas).

### Gestión de alertas

* Se va a usar **Amazon SNS** de **AWS** para **notificaciones** a **SMS** y **email**.
* Niveles dependiendo de severidad de alerta:

  * **Críticas / P1 :** caída total, **error rate ≥ 1%** por >5 min, o **p95 > 2 s** por >5 min → **SMS + email** (on-call inmediato).
  * **Altas / P2 :** **p95 > 500 ms** por >10 min, **CPU > 80%** sostenido, **backlog** creciente en colas → **email**.
  * **Medias / P3 :** picos breves, **retries** moderados, memoria cercana al límite → **registro en dashboard** (sin notificación).

### Recuperación automatizada

* Se va a usar **Knative/Kubernetes** para **autoescalado horizontal** (HPA/Autoscaler), **múltiples réplicas**, **reinicios automáticos** y **PodDisruptionBudget** para continuar atendiendo durante mantenimientos.
* Se va a usar **RDS Multi-AZ** de **AWS** para **failover automático** de la base de datos y **copias de seguridad** con **PITR** (Point-in-Time Recovery) para restaurar el sistema a cualquier punto en los últimos 7 días con menos de 10 minutos de data loss.

### Tasa de errores permitida
La tasa de fallas permitida será del 0.1%, para calcularla usamos la siguiente formula:
* Tasa de fallas permitida = Número máximo de transacciones fallidas/Número total de transacciones * 100

Si el porcentaje de transacciones fallidas supera el límite permitido se notifica al equipo por SMS y correo electrónico para investigación inmediata.

## 1.4 Disponibilidad
Se refiere a asegurar la **disponibilidad continua** del sistema, minimizando el tiempo de inactividad.

**Para esto se toma como base lo siguiente:**

* **99.9%** de disponibilidad anual

* Supuestos y fórmula del downtime

* Ventana de medición: 24/7 (minutos totales del periodo: año, mes, semana o día).

* Fórmula general:

      Downtime (min) = (1 − Disponibilidad) × minutos_del_periodoPara 99.9% ⇒ D = 0.001 × minutos_del_periodo.

* Ejemplos de periodo:

      Año: 365×24×60 = 525 600 → D = 525.6 min (= 8 h 45 min 36 s).

* Mes:

      30 días → 43.2 min • 31 días → 44.64 min • 28 días → 40.32 min
(Si se prefiere "mes promedio" = 365/12 → 43.8 min, que es el que usamos en las tablas.)

* Semana: 

      7×24×60 = 10 080 → 10.08 min.

* Día: 
        
      24×60 = 1 440 → 1.44 min.

* Relación con fallas:
      
      N.º de fallas permisibles ≈ Downtime / MTTR (usamos MTTR ≈ 1.7 min estimado en la tabla de componentes).


**Lo cual se tiene que:**

* Para 99.9% anual:
  * Downtime anual = (1 − 0.999) × 525,600 min = 0.001 × 525,600 min = 525.6 min = 8 h 45 min 36 s

**Esto se logrará usando distintas técnicas para alcanzar 99.9%:**

* **Knative autoscaling** para mantener **múltiples réplicas** y **failover** entre pods activos.
* Base de datos con **RDS for SQL Server ** (replicación síncrona y **failover automático**).

| Servicio Crítico | Tiempo estimado de recuperación (MTTR) | Fuente / Referencia |
|------------------|----------------------------------------|---------------------|
| **Amazon RDS SQL Server (Multi-AZ)** | 60–120 segundos (1–2 min) | [AWS Docs – Failover Times](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.Failover.html) |
| **Amazon ElastiCache for Redis (Multi-AZ con Failover)** | 30–45 segundos a 2 min | [AWS Blog – Configuring ElastiCache for Redis for Higher Availability](https://aws.amazon.com/blogs/database/configuring-amazon-elasticache-for-redis-for-higher-availability/) |
| **MongoDB Replica Set / Atlas Cluster** | 30–40 segundos | [Aerospike vs MongoDB Whitepaper (2023)](https://aerospike.com/files/white-papers/aerospike-vs-mongoDB-whitepaper.pdf) |
| **Knative / EKS Pods (autoscaling y failover)** | 2–5 min (rolling update o re-deployment) | [Kubernetes Docs – Pod Disruption Budgets & Restart Behavior](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) |
| **API Gateway / Load Balancer (AWS ALB)** | < 1 min para re-enrutamiento | [AWS ALB Failover Behavior](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) |
| **Sistema Serverless (FaaS Lambda + Knative)** | < 30 seg a 1 min (en reinicio o scaling) | [Knative Docs – Autoscaling and Recovery](https://knative.dev/docs/serving/autoscaling/) |

**Cálculo del Tiempo Promedio de Recuperación (MTTR)**

| Servicio | MTTR (min) | Peso relativo | Aporte ponderado |
|-----------|-------------|----------------|------------------|
| RDS SQL Server | 1.5 | 0.30 | 0.45 |
| Redis | 1.5 | 0.20 | 0.30 |
| MongoDB | 0.7 | 0.15 | 0.105 |
| Knative/EKS | 3.5 | 0.20 | 0.70 |
| API Gateway / ALB | 1 | 0.10 | 0.10 |
| Serverless | 0.7 | 0.05 | 0.035 |
| **Total MTTR promedio estimado ≈ 1.7 min (≈ 102 s)** |  |  | **≈ 1.69 min** |

**Presupuesto de Disponibilidad (99.9 %)**

| Periodo | Downtime máximo permitido |
|----------|---------------------------|
| **Año** | 525.6 min (≈ 8 h 45 m) |
| **Mes** | 43.8 min |
| **Semana** | 10.08 min |
| **Día** | 1.44 min |

**Cálculo del Número de Fallas Permitidas**

Fallas = Downtime permitido \ MTTR promedio

525.6/1.7 = 309.176

| Periodo | Downtime máx | MTTR promedio (1.7 min) | N° fallas máx ≈ |
|----------|---------------|--------------------------|------------------|
| **Año** | 525.6 min | 1.7 min | **≈ 309 fallas/año** |
| **Mes** | 43.8 min | 1.7 min | **≈ 25 fallas/mes** |
| **Semana** | 10.08 min | 1.7 min | **≈ 6 fallas/semana** |
| **Día** | 1.44 min | 1.7 min | **≈ 0.8 fallas/día** |


Tomando en cuenta un tiempo promedio de recuperación de 1.7 minutos, se cumplirá con los parámetros establecidos mientras se tengan menos de 300 fallos al año.

## 1.5 Seguridad

### 1.5.1 Autenticación y Autorización
**Implementación:** OpenID Connect (OIDC) utilizando Auth0 como proveedor de identidad con validación stateless de JWT

**Arquitectura usada:**
- Auth0 maneja la autenticación de usuarios y emite tokens JWT
- Express.js con librería `openid-client` para integración OIDC
- Validación stateless de tokens para escalado de Knative
- Flujo estándar Authorization Code con autenticación de cliente

**Flujo de autenticación:**
![oidc-setup.js](/src/shared/auth/oidc-setup.js)

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
![middleware.js](/src/shared/auth/middleware.js)
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
![server.js](/src/apps/prompt-content/server.js)
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


### Gestión de Secrets
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
![service-account.yaml](/k8s/external-secrets/service-account.yaml)
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
![secret-store.yaml](/k8s/external-secrets/secret-store.yaml)
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
![external-secret.yaml](/k8s/external-secrets/external-secret.yaml)
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
![prompt-content.yaml](/k8s/knative/prompt-content.yaml)
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

### 1.5.2 Cifrado TLS 1.3 en comunicación y AES-256 en reposo.

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
![alb-tls13.yaml](/k8s/ingress/alb-tls13.yaml)
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
![sqlserver-connection.json](/k8s/sqlserver/sqlserver-connection.json)
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


**Conexión MongoDB**
![mongo-connection.json](/k8s/mongodb/mongo-connection.json)
```JSON
{
  "uri": "mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/promptsales?retryWrites=true&w=majority&tls=true",
  "options": {
    "serverSelectionTimeoutMS": 30000
  }
}
```

**ElastiCache Redis**
![elasticache-redis.yaml](/k8s/redis/elasticache-redis.yaml)
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
![etcd-encryption.yaml](/k8s/eks/etcd-encryption.yaml)
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
![etcd-encryption.yaml](/k8s/eks/etcd-encryption.yaml)
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

## 1.6 Maintainability

### Proceso de Mantenimiento

### Mantenimiento Durante Desarrollo

### Sistema de Tickets
- **Plataforma**: Jira Service Management
- **Flujo estandarizado**: Creación → Clasificación → Asignación → Resolución → Cierre
- **Tipos de tickets**: Bug, Feature Request, Hotfix, Mejora, Tarea técnica

###  GitFlow Implementado
```
main          # Producción estable (tags semánticos: v1.0.0, v1.1.0)
develop       # Integración para próximo release
feature/      # Desarrollo de nuevas funcionalidades
hotfix/       # Correcciones urgentes de producción
```
**Referencia**: [Semantic Versioning 2.0.0](https://semver.org/)

###  Estrategia de Branching
```bash
feature/user-auth-v2     # Nueva funcionalidad
hotfix/critical-security # Parche urgente
```

### Release Process
- **Frecuencia**: Cada 3 semanas mediante pipeline CI/CD automatizado
- **Versionado**: Semantic Versioning (MAJOR.MINOR.PATCH)
- **Proceso**: 
  1. Branch `release/v1.2.0` creado desde `develop`
  2. Merge a `main` con tag de versión (ej. `v1.2.0`)
  3. Despliegue automatizado a Knative con rolling updates
  4. Validación por QA y Release Manager
  5. Merge back a `develop`

### Procedimientos Kubernetes/Knative
- **Despliegues**: Rolling updates con Knative Services
- **Rollback**: Automático si health check falla (max 2% error rate)
- **Escalado**: Configuración de minScale=1 para servicios críticos
- **Health Checks**: Verificación continua de réplicas y readiness probes

### Procedimiento de Hot Fixes

#### Hotfix Estándar
- **Origen**: Branch `hotfix/<descripción>` desde `main`
- **Responsables**: Equipo de desarrollo + Release Manager
- **Validación**: Test rápido en ambiente staging
- **Deployment**: Pipeline con approval manual en ArgoCD
- **Merge**: A `main` (nuevo tag) y `develop` post-despliegue

#### Hotfix de Emergencia (Severidad 1)
- **Origen**: Branch `hotfix/emergency-<descripción>` desde `main`
- **Proceso**: 
  1. Build automático + test unitarios básicos
  2. Deployment directo a producción
  3. Approval posterior dentro de 24 horas
  4. Validación y merge back obligatorio
- **Trazabilidad**: Commit vinculado a ticket Jira (ej. `JIRA-123 hotfix: auth token`)

**Mantenimiento Después de Implementación**

**Niveles de Soporte**

#### L1 - Soporte Autogestionado
- **Medio**: Documentación, video-tutoriales, RAG en WhatsApp
- **Cobertura**: Respuestas automáticas a consultas frecuentes
- **Objetivo**: Resolución inmediata sin intervención humana

#### L2 - Soporte Técnico Básico
- **Medio**: Email a support@promptsales.com
- **SLA**: 
  - Respuesta inicial: 8 horas hábiles
  - Resolución completa: 4 días hábiles máximo
- **Alcance**: Configuración, uso básico, troubleshooting inicial

#### L3 - Soporte de Desarrollo
- **Medio**: Sistema de ticketing (Jira Service Management)
- **Escalación**: Desde L2 cuando se requiere intervención de desarrollo
- **SLAs por Severidad**:
  - **Severidad 1** (Crítico): Respuesta < 1 hora, Resolución < 4 horas
  - **Severidad 2** (Alto): Respuesta < 4 horas hábiles, Resolución < 24 horas
  - **Severidad 3** (Medio): Respuesta < 8 horas hábiles, Resolución < 3 días
  - **Severidad 4** (Bajo): Respuesta < 24 horas hábiles, Resolución < 1 semana
- **Cobertura**: Bugs, incidentes críticos, requerimientos de desarrollo

### Sistema de Ticketing para L3
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

### Responsabilidades por Rol
- **Release Manager**: Aprobación final de releases y hotfixes, coordinación de despliegues
- **Dev Team**: Desarrollo, testing y resolución de tickets L3 según severidad
- **QA Team**: Validación en staging pre-release y post-hotfix
- **Support L2**: Filtro, clasificación de severidad y escalación a desarrollo

### Indicadores de Mantenibilidad
- **Tiempo medio de resolución (MTTR)**: < 48h promedio
- **Frecuencia de hotfixes por release**: ≤ 1 por ciclo
- **Tickets reabiertos**: < 10%
- **Integridad del release (builds exitosos)**: > 95%
- **SLA cumplimiento por severidad**: > 90%

Estos indicadores se revisan al cierre de cada release para evaluar la estabilidad y mantenibilidad del ecosistema PromptSales.

## 1.7 Interoperability

### 1.7.1 Enfoque
**Cómo se conecta el sistema con otros (REST y MCP).**  
- **Modos:** **APIs REST** + **MCP servers** (Model Context Protocol) entre subempresas y con terceros.
- **Formato:** `application/json` (UTF-8).  
- **Auth:** OAuth2/OIDC (JWT Bearer); para M2M, Client Credentials.  
- **Seguridad:** TLS 1.3 en el borde; TLS 1.2+ hacia servicios internos.  

### 1.7.2 REST 
- **Base URLs por subempresa**
  - Content: `https://api.prompt-content.promptsales.com/v1`
  - Ads: `https://api.prompt-ads.promptsales.com/v1`
  - CRM: `https://api.prompt-crm.promptsales.com/v1`
- **Convenciones**
  - **Auth:** `Authorization: Bearer <JWT>`
  - **Paginación:** `page`, `page_size` (máx. 100)
  - **Idempotencia (POST sensibles):** `Idempotency-Key`
  - **Filtrado/orden:** parámetros en query; ordenar por `created_at`
  - **Errores:** `{ code, message, details, request_id }`
  - **Webhooks:** firma HMAC en `X-Signature` (sha256); reintentos exponenciales (7 intentos, backoff inicial 2s)

**OpenAPI**
```yaml
openapi: 3.1.0
info: { title: PromptSales Ads API, version: "v1" }
servers:
  - url: https://api.prompt-ads.promptsales.com/v1
paths:
  /campaigns:
    get:
      summary: Listar campañas
      security: [{ bearerAuth: [] }]
      parameters:
        - { name: page, in: query, schema: { type: integer, minimum: 1 } }
        - { name: page_size, in: query, schema: { type: integer, maximum: 100 } }
      responses:
        "200": { description: OK }
    post:
      summary: Crear campaña
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/CampaignCreate" }
      responses:
        "201": { description: Creada }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
  schemas:
    CampaignCreate:
      type: object
      required: [name, channel, start_date]
      properties:
        name: { type: string }
        channel: { type: string, enum: [google, meta, tiktok, mailchimp, linkedin] }
        budget: { type: number }
        start_date: { type: string, format: date }
        end_date: { type: string, format: date }
```

**Modelo de error REST:**
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests",
  "details": { "limit": 120, "window": "1m" },
  "request_id": "c5e0f9b1-..."
}
```

### 1.7.3 MCP
- **Uso:** orquestación IA/automatizaciones entre subempresas y con proveedores IA.
- **Transporte:** TLS + OAuth2 (Client Credentials); scopes por herramienta.
- **Contratos:** herramientas (**tools**) con esquemas JSON versionados en `contracts/mcp/`.
- **Límites:** `rpm`/`rps` por tenant; timeouts; size máx. de payload.

**Registro de server MCP:**
```json
{
  "server": "mcp://ads-orchestrator",
  "auth": { "type": "oauth2", "token_url": "https://auth.promptsales.com/oauth/token" },
  "tools": [
    { "name": "launch_campaign", "input_schema": { "type": "object", "properties": { "campaign_id": { "type": "string" } }, "required": ["campaign_id"] } },
    { "name": "optimize_budget", "input_schema": { "type": "object", "properties": { "campaign_id": { "type": "string" }, "target_roas": { "type": "number" } }, "required": ["campaign_id"] } }
  ],
  "rate_limits": { "rpm": 300, "burst": 600 },
  "observability": { "emit_traceparent": true, "log_level": "info" }
}
```

## 1.8 Compliance

### 1.8.1 Pagos y transparencia (terceros regulados)
**Política:** Todo pago se procesa únicamente mediante **proveedores regulados**. No almacenamos datos de tarjetas (PAN/CVV). El cumplimiento **PCI-DSS** recae en el PSP; nosotros solo guardamos **tokens**.
**Proveedores objetivo:** PayPal, Stripe y **BAC Credomatic**(para Costa Rica y región).

**Controles:**
- HTTPS (TLS 1.3) extremo a extremo.
- Webhooks firmados (HMAC-SHA256) con rotación de secretos.
- Conciliación contable periódica y trazabilidad por `payment_id`/`order_id`.

### 1.8.2 OWASP — objetivos de control
- **Web (Frontends):** **OWASP Top 10: 2021** (A01–A10) como baseline.
- **Backend (APIs):** **OWASP API Security Top 10: 2023** (API1–API10) como baseline. Objetivo adicional: **OWASP ASVS 4.0.3, nivel 2** para endpoints críticos.

**Umbrales de severidad por release:**
```
Critical: 0
High:     0
Medium:   <= 5 (máximo 5 “warnings”)
Low:      sin límite estricto, resolver por prioridad
```
**Evidencia:** reportes SAST/DAST en CI/CD (artefactos de build), pruebas de seguridad en PR y gating antes de deploy.

### 1.8.3 GDPR — datos personales y sensibles
- **Base legal y consentimiento:** registrar base legal por propósito; consentimiento explícito y **opt-in/opt-out** por canal (WhatsApp, email, SMS).
- **Minimización y retención:** recolectar solo lo necesario; políticas de retención por tipo de dato y borrado programado.
- **Derechos del interesado (DSR):** acceso, rectificación, portabilidad y supresión; SLA de respuesta **menor a 30 días**.
- **Transferencias internacionales:** usar **SCC** (Standard Contractual Clauses) con subprocesadores fuera de la UE.
- **Acuerdos con terceros:** **DPA** firmado con PSPs, CRMs, Ads y hosting.
- **Seguridad:** cifrado **TLS 1.3** en tránsito y **AES-256** en reposo; logging y auditoría centralizados (retención mínima 90 días).

### 1.8.4 Métricas de cumplimiento (SLOs)
- % releases con “0 critical / 0 high” (objetivo: **100%**).
- Tiempo medio de cierre de findings **medium**: **menor a 15 días**.
- Tiempo de respuesta a **DSR**: **<= 30 días** (P95).
- % pagos procesados por PSP regulado: **100%**.
- Cobertura de contratos **DPA** con terceros activos: **100%**.

## 1.9 Extensibility

### 1.9.1 Objetivo
Arquitectura modular por **dominios** que permita **agregar nuevas subempresas** o **módulos/microservicios** sin romper lo existente. Todos los componentes exponen **APIs REST** y/o **MCP servers** con contratos versionados.

### 1.9.2 Modos de extensión (checklist)
- **Nuevo dominio local (en una subempresa):**
  1) Crear carpeta `src/domains/<newdomain>/` con `contracts/` y `controllers/`.
  2) Definir contrato **REST** en `contracts/rest/<newdomain>-openapi.yaml` (usar plantilla de 1.9.3).
  3) (Opcional IA) Definir **MCP tool** en `contracts/mcp/<newdomain>.json` (plantilla de 1.9.4).
  4) Publicar eventos (`<subempresa>.<dominio>.<evento>`) y registrar **webhooks**.
  5) Desplegar microservicio Knative `k8s/knative/<newdomain>.yaml` (plantilla de 1.9.5).
- **Nuevo dominio global:** igual que arriba, como **servicio independiente**; colocar SDK liviano en `src/shared/` si aplica.
- **Nueva subempresa:** mínimos: OIDC, logging/trace, `healthz`, métricas, rate-limit. Exponer **REST** y, si usa IA, **MCP server**.

### 1.9.3 REST APIs (plantilla oficial para NUEVOS dominios)
**Qué es:** Plantilla para crear la **API REST** de un dominio nuevo. **No es un servicio real**; estandariza formato, auth, versionado e idempotencia.

**Dónde guardarlo**
- `contracts/rest/<newdomain>-openapi.yaml`

**Qué editar**
- Reemplazar `<newdomain>`, ajustar `servers.url`, `paths`, `schemas`.

**Cómo desplegar**
1. Validar contrato (lint).
2. Subir a repo (PR).
3. Implementar handlers en `src/domains/<newdomain>/controllers/` y mapear rutas en `src/apps/<subempresa>/server.js`.

**OpenAPI (plantilla base — `contracts/rest/newdomain-openapi.yaml`):**
```yaml
openapi: 3.1.0
info: { title: PromptSales NewDomain API, version: "v1" }
servers:
  - url: https://api.newdomain.promptsales.com/v1
paths:
  /resources:
    get:
      summary: Listar resources
      security: [{ bearerAuth: [] }]
      responses:
        "200": { description: OK }
    post:
      summary: Crear resource
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name]
              properties: { name: { type: string } }
      responses: { "201": { description: Creado } }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
```

**Convenciones obligatorias**
- **Formato:** JSON UTF-8. **Auth:** OAuth2/OIDC (Bearer JWT).
- **TLS:** 1.3 en el borde. **Versionado:** `/v1`; breaking ⇒ `/v2`.
- **Idempotencia (POST críticos):** `Idempotency-Key`.
- **Errores estándar:** `{ code, message, details, request_id }`.

### 1.9.4 MCP Servers
**Uso:** Orquestación IA/automatizaciones entre dominios y con terceros.

**Dónde guardarlo**
- `contracts/mcp/<newdomain>.json`

**Qué editar**
- `server`, `tools[].name`, `input_schema`, `auth.token_url`.

**Cómo desplegar**
- Implementar el server como microservicio Knative o módulo del existente.
- Registrar credenciales (client credentials) vía External Secrets.


**Registro de server MCP (plantilla base — `contracts/mcp/newdomain.json`):**
```json
{
  "server": "mcp://newdomain",
  "auth": { "type": "oauth2", "token_url": "https://auth.promptsales.com/oauth/token" },
  "tools": [
    {
      "name": "newdomain_action",
      "input_schema": {
        "type": "object",
        "properties": { "resource_id": { "type": "string" } },
        "required": ["resource_id"]
      }
    }
  ],
  "rate_limits": { "rpm": 300, "burst": 600 },
  "observability": { "emit_traceparent": true, "log_level": "info" }
}
```

### 1.9.5 Knative 
**Dónde guardarlo**
- `k8s/knative/<newdomain>.yaml`

**Qué editar**
- `metadata.name`, `containers.image`, `AUTH0_AUDIENCE`, etc.

**Cómo desplegar**
kubectl apply -f k8s/knative/<newdomain>.yaml
kubectl get ksvc newdomain

**Knative Service (plantilla base — `k8s/knative/newdomain.yaml`):**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: newdomain
spec:
  template:
    spec:
      containers:
      - image: 111122223333.dkr.ecr.us-east-1.amazonaws.com/newdomain:latest
        env:
        - name: AUTH0_ISSUER
          value: "https://promptsales-prod.auth0.com/"
        - name: AUTH0_AUDIENCE
          value: "https://api.newdomain.promptsales.com"
        - name: LOG_LEVEL
          value: "info"
        - name: OTEL_EXPORTER_OTLP_ENDPOINT
          value: "http://otel-collector.observability:4317"
```

### 1.9.6 Eventos y webhooks
**Dónde guardarlo**
- Tópicos: `webhooks/topics.md`
- Esquemas: `webhooks/schemas/<newdomain>.<event>.json`

**Qué editar**
- Agregar evento a `topics.md` y crear su esquema JSON.

**Cómo desplegar**
- Endpoint receptor en `src/gateways/webhooks/receiver.js` con firma HMAC.

### 1.9.7 Definition of Done (DoD) para una extensión
- OpenAPI/MCP en `contracts/` **validados** (lint + CI).
- Handlers implementados + tests unitarios y de contrato.
- YAML de Knative aplicado y `healthz` OK.
- Dashboards/alertas creados (latencia, error rate, saturación).
- Rate limits y `Idempotency-Key` en POST críticos.
- Migraciones/versionado de esquema sin downtime (rolling/blue/green).
- README con ejemplo `curl` y/o invocación MCP documentados.

# 2. Domain Driven Design

## 2.1 Dominios Globales y por Subempresa

### 2.1.1 Dominios Globales

**Dominios transversales que soportan todo el ecosistema:**

- **Identidad** 
- **Suscripciones** 
- **Pagos** 
- **Almacenamiento**
- **Integraciones** 
- **Analítica**
- **Agenda** 
- **Aprobaciones** 
- **Notificaciones** 
- **IA** 
- **Cache** 
- **Auditoría y Eventos** 
- **Clientes y Productos** 
- **Redes Sociales** 
- **Mensajería Multicanal** 

### 2.1.2 Dominios por Subempresa

#### PromptContent
**Dominios especializados en generación y gestión de contenido:**
- **Contenidos**
- **Plantillas** 
- **Almacenamiento** 
- **Derechos** 

#### PromptAds
**Dominios especializados en publicidad y campañas:**
- **Campañas**
- **Anuncios** 
- **Audiencias** 
- **Redes Sociales** 
- **Analítica** 
- **Políticas de Plataforma** 

#### PromptCRM
**Dominios especializados en gestión de relaciones con clientes:**
- **Leads**
- **Contactos y Cuentas** 
- **Conversaciones** 
- **Oportunidades** 
- **Tareas y SLA** 
- **Ventas** 
- **Transacciones**

## 2.2 Interacción y Flujo de Datos

### Reglas clave

1. Intra-dominio: los controllers solo orquestan casos de uso de su dominio.

2. Cross-dominio: un controller no llama a controllers de otros dominios. Debe usar su ACL (Anti-Corruption Layer), y este ACL invoca el Contract del otro dominio.

3. Contratos: exponen interfaces estables (REST/MCP) y modelos propios del dominio destino. El ACL hace el mapping a los modelos del dominio origen.

4. Tests: las pruebas cross-dominio se hacen sobre el ACL, mockeando los Contracts. No se prueba invocando controllers remotos.

![Ejemplo de llamadas cross-domain](assets/DDD-DataFlow.svg)

## 2.3 Estructura base de dominios

### Qué contiene cada dominio

1. controllers/: casos de uso expuestos al app server (rutas HTTP).

2. contracts/: interfaces del dominio (REST/MCP) para ser consumidas por otros dominios.

3. acl/: façade para consumir contratos de otros dominios sin filtrar modelos externos al interno.

### Carpetas

[src/domains/](src/domains)

1. src/domains/\<newdomain>/controllers/

2. src/domains/\<newdomain>/contracts/

3. src/domains/\<newdomain>/acl/ (si consume otros)

4. Rutas en src/apps/\<subempresaquecorresponde>/server.js 

[src/Apps/prompt-ads/server.js](src/apps/prompt-ads/server.js)
``` javascript
// server.js (ejemplo)
import express from "express";
import { requireAuth } from "../../shared/auth/middleware.js";
import { SubscriptionRenewalController } from "../../domains/subscriptions/controllers/SubscriptionRenewalController.js";
import { buildSubscriptionACL } from "./wiring/subscriptions.js"; // cableado de clients/mapper

const app = express();
app.use(express.json());

const renewal = SubscriptionRenewalController({ acl: buildSubscriptionACL() });
app.post("/subscriptions/renew", requireAuth, renewal.renew);

export default app;
```

5. Gateways: usa gateways/rest/* o gateways/mcp/* para crear los clients HTTP/MCP de cada contract.

6. Shared: registra Idempotency-Key [src/shared/http/idempotency.js](src/shared/http/idempotency.js), logs [src/shared/observability/logger.js](src/shared/observability/logger.js) y trazas [src/shared/observability/tracing.js](src/shared/observability/tracing.js).

7. Todos los tests deben hacerse a los acl, como el ejemplo de subscription:
![SubscriptionTests.js](/src/jest/SubscriptionTests.js)

## API Gateway & Routing

Usamos **Kong Gateway** para el routing de APIs. Configuración en `k8s/api-gateway/`

**Routing Map:**
- `/api/content/*` → PromptContent Microservice
- `/api/ads/*` → PromptAds Microservice  
- `/api/crm/*` → PromptCRM Microservice

**Features:**
- Autenticación JWT centralizada
- CORS management  
- Logging y métricas

### Variables a definir durante implementación:

#### Service URLs
- `[NAMESPACE]`: Namespace de Kubernetes donde se despliegan los microservicios
- `[PORT]`: Puerto interno de cada microservicio

#### Paths Routing  
- Rutas base a confirmar con equipo de desarrollo
- Considerar versionado (/v1/, /v2/) si aplica

### Políticas de Seguridad del API Gateway 

#### Capa 1: API Gateway (Kong)
- **JWT Validation:** Verificación básica de tokens Auth0
- **CORS Policy:** Restricción de orígenes frontend
- **Propósito:** Filtro general antes de llegar a la aplicación

#### Capa 2: Application Layer (shared/auth/)
- **Autorización:** Validación de roles y permisos específicos
- **Lógica negocio:** Reglas de acceso por dominio
- **Auditoría:** Logging detallado por operación

## Cloud Provider

### Decisión
**AWS (Amazon Web Services)** como proveedor cloud principal.

### Servicios AWS Utilizados
- **EKS** (Elastic Kubernetes Service) - Orquestación de contenedores
- **RDS** (Relational Database Service) - Bases de datos PostgreSQL
- **ElastiCache** - Redis para caching distribuido
- **Secrets Manager** - Gestión centralizada de secrets
- **ALB** (Application Load Balancer) - Balanceo de carga
- **SNS** - Mensajería y eventos asíncronos

# 3. Diagrama de arquitectura

![Diagrama de arquitectura](assets/Diagrama-Arquitectura.png)

## Patrones de Arquitectura

### Asynchronous Request-Reply
Los llamados a IA deben incluír este patrón para cumplir con los requerimientos de tiempo de respuesta. Para esto usaremos 
[AsyncIAService.js](src/domains/ia/services/AsyncIAService.js) el cual tiene las funciones para empezar los tasks y notificar sobre el profreso.

``` javascript
// src/domains/ia/services/AsyncIAService.js
const { v4: uuidv4 } = require('uuid');

class AsyncIAService {
  constructor(taskManager, sqsService, snsService, lambdaService) {
    this.taskManager = taskManager;
    this.sqsService = sqsService;
    this.snsService = snsService;
    this.lambdaService = lambdaService;
  }

  async submitTask(operation, input, userId) {
    const task = await this.taskManager.createTask({
      id: uuidv4(),
      userId,
      operation,
      input,
      estimatedCompletionTime: this.calculateEstimatedTime(operation, input)
    });

    // Encolar en SQS para procesamiento asíncrono
    await this.sqsService.enqueue(process.env.IA_TASKS_QUEUE_URL, {
      taskId: task.id,
      operation,
      input,
      userId
    });

    return task;
  }

  async processTask(taskId, operation, input, userId) {
    const task = await this.taskManager.getTask(taskId, userId);
    
    try {
      task.markAsProcessing();
      await this.taskManager.updateTask(task);

      // Opción 1: Invocar Lambda function para procesamiento pesado
      if (this.shouldUseLambda(operation)) {
        const result = await this.invokeIALambda(operation, input, taskId);
        task.markAsCompleted(result);
      
      // Opción 2: Procesamiento directo (solo para operaciones rápidas)
      } else {
        const result = await this.executeIAOperation(operation, input, (progress) => {
          task.updateProgress(progress);
          this.taskManager.updateTask(task);
        });
        task.markAsCompleted(result);
      }

      await this.taskManager.updateTask(task);

      // Publicar notificación en SNS para webhooks
      await this.publishTaskCompletionNotification(task);

    } catch (error) {
      task.markAsFailed(error.message);
      await this.taskManager.updateTask(task);
      throw error;
    }
  }

  async invokeIALambda(operation, input, taskId) {
    const lambdaFunctionName = this.getLambdaFunctionName(operation);
    
    const result = await this.lambdaService.invoke({
      FunctionName: lambdaFunctionName,
      InvocationType: 'RequestResponse', // O 'Event' para asíncrono
      Payload: JSON.stringify({
        taskId,
        operation,
        input,
        callbackUrl: `${process.env.API_BASE_URL}/api/v1/ia/tasks/${taskId}/callback`
      })
    });

    return JSON.parse(result.Payload);
  }

  async publishTaskCompletionNotification(task) {
    await this.snsService.publish({
      TopicArn: process.env.IA_TASKS_TOPIC_ARN,
      Message: JSON.stringify({
        eventType: 'ia.task.completed',
        taskId: task.id,
        userId: task.userId,
        operation: task.operation,
        completedAt: task.completedAt,
        resultUrl: `${process.env.API_BASE_URL}/api/v1/ia/tasks/${task.id}/result`
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'ia.task.completed'
        },
        userId: {
          DataType: 'String',
          StringValue: task.userId
        }
      }
    });
  }

  calculateEstimatedTime(operation, input) {
    const estimates = {
      'content-generation': 30000, // 30 segundos
      'image-processing': 60000,   // 1 minuto
      'data-analysis': 120000      // 2 minutos
    };
    
    return new Date(Date.now() + (estimates[operation] || 30000));
  }

  shouldUseLambda(operation) {
    const lambdaOperations = ['content-generation', 'image-processing', 'data-analysis'];
    return lambdaOperations.includes(operation);
  }

  getLambdaFunctionName(operation) {
    const functionMap = {
      'content-generation': process.env.CONTENT_GENERATION_LAMBDA,
      'image-processing': process.env.IMAGE_PROCESSING_LAMBDA,
      'data-analysis': process.env.DATA_ANALYSIS_LAMBDA
    };
    
    return functionMap[operation];
  }

  async cancelTask(taskId, userId) {
    const task = await this.taskManager.getTask(taskId, userId);
    
    if (task.status === 'pending' || task.status === 'processing') {
      task.markAsFailed('Task cancelled by user');
      await this.taskManager.updateTask(task);
      
      // Publicar evento de cancelación
      await this.snsService.publish({
        TopicArn: process.env.IA_TASKS_TOPIC_ARN,
        Message: JSON.stringify({
          eventType: 'ia.task.cancelled',
          taskId: task.id,
          userId: task.userId
        })
      });
    }
  }
}

module.exports = AsyncIAService;
```

El [AsyncIAController.js](src/domains/ia/controllers/AsyncIAController.js) tiene las funciones y hace los llamados mientras que el [IAACL.js](src/domains/ia/acl/IAACL.js) expone los métodos para llamados cross-domain.

Los llamados desde otros dominios deben hacerse de la siguiente manera

``` javascript
// src/domains/content/controllers/ContentController.js
class ContentController {
  constructor(deps) {
    // ✅ Solo recibe ACLs
    this.iaACL = deps.iaACL;
    this.subscriptionACL = deps.subscriptionACLForContent;
  }

  async generateAIContent(req, res) {
    const { prompt, style, length } = req.body;
    const userId = req.user.id;

    try {
      // ✅ Usar ACL para operaciones de IA
      const taskResponse = await this.iaACL.submitAsyncTask(
        'content-generation', 
        { prompt, style, length },
        userId
      );

      res.status(202).json({
        success: true,
        data: {
          taskId: taskResponse.taskId,
          statusUrl: taskResponse.statusUrl,
          estimatedCompletionTime: taskResponse.estimatedCompletionTime
        },
        message: 'Content generation started'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async checkContentGenerationStatus(req, res) {
    const { taskId } = req.params;
    const userId = req.user.id;

    try {
      const status = await this.iaACL.getTaskStatus(taskId, userId);
      
      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

Se llama a la función submitAsyncTask del ACL para iniciar un request y al getTaskStatus para revisar el progreso.

### Anti-Corruption Layer

#### ACL File

Debe haber un ACL por dominio, el ACL debe tener un constructor que permita Dependency Injection de los contractos para llamadas del mismo dominio y ACL para llamadas de otros dominios. Además se exponen los métodos y se hace internamente el llamado a los contratos.
[SubscriptionACL.js](src/domains/subscriptions/acl/SubscriptionACL.js)
``` javascript
const SubscriptionContractFactory = require('../contracts/SubscriptionContractFactory');

class SubscriptionACL {
  constructor(identityACL, deps, version = 'v2') {
    this.identityACL = identityACL; // ✅ Recibe IdentityACL, no el contract
    this.deps = deps;
    this.version = version;
    this.subscriptionContract = SubscriptionContractFactory.create(version, deps);
  }

  async getUserSubscriptionWithProfile(userId) {
    // ✅ Usa IdentityACL en lugar del contract directo
    const userInfo = await this.identityACL.getUserInfo(userId);
    const subscription = await this.subscriptionContract.getUserSubscription(userId);

    return {
      user: userInfo,
      subscription,
      contractVersion: this.version
    };
  }

  async canUserPerformAction(userId, action) {
    // ✅ Combina validaciones de ambos ACLs
    const [hasAccess, subscription] = await Promise.all([
      this.identityACL.validateUserAccess(userId, 'subscription'),
      this.subscriptionContract.getUserSubscription(userId)
    ]);

    return hasAccess && subscription.status === 'active';
  }

  async getSubscriptionForBilling(userId) {
    const userProfile = await this.identityACL.getUserProfileForDisplay(userId);
    const subscription = await this.subscriptionContract.getUserSubscription(userId);

    return {
      billingContact: {
        name: userProfile.displayName,
        email: userProfile.email
      },
      subscription: {
        plan: subscription.plan,
        amount: this.calculateBillingAmount(subscription.plan),
        nextBillingDate: subscription.expiresAt
      }
    };
  }

  calculateBillingAmount(plan) {
    const prices = { basic: 10, premium: 25, enterprise: 100 };
    return prices[plan] || 0;
  }
}

module.exports = SubscriptionACL;
```

#### Manejo de versiones de contratos
Todos los contratos deben extender el [BaseVersionedContract.js](src/shared/contracts/BaseVersionedContract.js), esto para asegurar versionamiento y logging. Los constructores deben incluir la versión del contrato como en el siguiente ejemplo:
``` javascript
const BaseVersionedContract = require('../../../../../shared/contracts/BaseVersionedContract');

class SubscriptionContractV1 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v1');
  }
}
```

#### Ejemplos de uso
Los controladores se pueden llamar desde otros controladores del mismo dominio de las siguientes maneras:
``` javascript
//Creamos el factory del contrato
const SubscriptionContractFactory = require('./domains/subscriptions/contracts/SubscriptionContractFactory'); 

// Pedimos la versión específica
const contractV2 = SubscriptionContractFactory.create('v2', deps);
const subscription = await contractV2.getUserSubscription(userId);

// O pedimos la versión default
const defaultContract = SubscriptionContractFactory.create(SubscriptionContractFactory.getDefaultVersion(), deps);

// Creamos una versión específica según el header de un request
const version = req.headers['api-version'] || 'v2';
const contract = SubscriptionContractFactory.create(version, deps);
``` 

#### Agregar versiones de un contrato
1- Creamos un archivo de la siguiente manera:

``` javascript
const BaseVersionedContract = require('../../../../../shared/contracts/BaseVersionedContract');

class SubscriptionContractV4 extends BaseVersionedContract {
  constructor(deps) {
    super(deps, 'v4');
  }

  async getUserSubscription(userId) {
    return this.safeRequest('GetUserSubscription', async () => {
      const response = await this.http.get(`/v4/subscriptions/${userId}`, {
        headers: this.getHeaders()
      });
      
      // New V4 response format
      return {
        plan: response.plan,
        status: response.status,
        expiresAt: response.expiresAt,
        // NEW: Add usage metrics
        usage: response.usageMetrics,
        // NEW: Add billing info
        billing: response.billingDetails
      };
    });
  }

  // NEW: Add method only available in V4
  async getUsageAnalytics(userId) {
    return this.safeRequest('GetUsageAnalytics', async () => {
      const response = await this.http.get(`/v4/subscriptions/${userId}/analytics`);
      return response;
    });
  }
}

module.exports = SubscriptionContractV4;
``` 

2- Actualizamos el [SubscriptionContractFactory.js](src/domains/subscriptions/contracts/SubscriptionContractFactory.js):
``` javascript
const SubscriptionContractV4 = require('./versions/v4/SubscriptionContractV4');

class SubscriptionContractFactory {
  static create(version, deps) {
    const versionMap = {
      'v1': SubscriptionContractV1,
      'v2': SubscriptionContractV2,
      'v3': SubscriptionContractV3,
      'v4': SubscriptionContractV4  // ADD THIS LINE
    };

    const ContractClass = versionMap[version];
    if (!ContractClass) {
      throw new Error(`Unsupported contract version: ${version}`);
    }

    return new ContractClass(deps);
  }

  static getSupportedVersions() {
    return ['v1', 'v2', 'v3', 'v4'];  // UPDATE THIS
  }

  // Optional: Update default version
  static getDefaultVersion() {
    return 'v3';  // Or keep as v2
  }
}
``` 

3- Actualizamos el [SubscriptionContractMapper.js](src/domains/subscriptions/contracts/SubscriptionContractMapper.js) si cambió el formato del response
``` javascript
//Agregar método
static mapToV4Format(response) {
  return {
    plan: response.plan,
    status: response.status,
    expiresAt: response.expiresAt,
    usage: response.usage || {},  // Handle missing usage
    billing: response.billing || {} // Handle missing billing
  };
}
```

#### Llamados desde otros dominios
El controller de un dominio externo debe pasar la versión que usara del contrato cuando crea el ACL. Los dominios externos NO deben tener acceso al factory.
[PaymentController.js](src/domains/payments/controllers/PaymentController.js)
``` javascript
class PaymentController {
  constructor(deps) {
    // ✅ Solo recibe ACLs, ningún contract directo
    this.subscriptionACL = deps.subscriptionACL;
  }

  async processPayment(userId, amount) {
    // ✅ Usa métodos de alto nivel del ACL
    const billingInfo = await this.subscriptionACL.getSubscriptionForBilling(userId);
    const canPay = await this.subscriptionACL.canUserPerformAction(userId, 'make_payment');

    if (!canPay) {
      throw new Error('Usuario no puede realizar pagos');
    }

    return await this.chargeUser(
      billingInfo.billingContact.email,
      billingInfo.subscription.amount
    );
  }
}
```

#### Registro de ACL
Si se agregan ACLs se deben agregar al registro centralizado
src/shared/acl/ACLRegistry.js
[ACLRegistry.js](src/shared/acl/ACLRegistry.js)
``` javascript
const IdentityACL = require('../../domains/identity/acl/IdentityACL');
const SubscriptionACL = require('../../domains/subscriptions/acl/SubscriptionACL');

class ACLRegistry {
  static init(deps) {
    // ✅ Crear IdentityACL primero
    const identityACL = new IdentityACL(deps.identityContract);
    
    return {
      identityACL,
      
      // ✅ Diferentes ACLs de subscription para cada dominio
      subscriptionACLForPayments: new SubscriptionACL(identityACL, deps, 'v2'),
      subscriptionACLForCRM: new SubscriptionACL(identityACL, deps, 'v3'),
      subscriptionACLForAnalytics: new SubscriptionACL(identityACL, deps, 'v2')
    };
  }
}
```

### Circuit Breaker
Esto debe ir en los proxys

### Publisher Subscriber / Producer Consumer / Event Driven

### Throttling middleware
Esta configuración se implementa desde el archivo de Terraform para limitar el API Gateway según las especificaciones del caso.
``` javascript
# infrastructure/aws/api-gateway-scaling.tf
resource "aws_api_gateway_rest_api" "main" {
  name        = "async-ia-api-100k"
  description = "API Gateway optimizado para 100K RPM"
  
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_account" "main" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

# IAM Role para CloudWatch Logs
resource "aws_iam_role" "cloudwatch" {
  name = "api-gateway-cloudwatch-global"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "cloudwatch-logs"
  role = aws_iam_role.cloudwatch.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

# Stage configuration para alta escalabilidad
resource "aws_api_gateway_stage" "production" {
  stage_name    = "production"
  rest_api_id   = aws_api_gateway_rest_api.main.id
  deployment_id = aws_api_gateway_deployment.main.id

  # Configuración para 100K RPM
  cache_cluster_enabled = true
  cache_cluster_size    = "1.6"  # 1.6GB cache para reducir latencia

  # Throttling settings a nivel de stage
  dynamic "access_log_settings" {
    for_each = var.enable_access_logs ? [1] : []
    content {
      destination_arn = aws_cloudwatch_log_group.api_gateway.arn
      format          = jsonencode({
        requestId        = "$context.requestId"
        ip               = "$context.identity.sourceIp"
        caller           = "$context.identity.caller"
        user             = "$context.identity.user"
        requestTime      = "$context.requestTime"
        httpMethod       = "$context.httpMethod"
        resourcePath     = "$context.resourcePath"
        status           = "$context.status"
        protocol         = "$context.protocol"
        responseLength   = "$context.responseLength"
        integrationLatency = "$context.integration.latency"
      })
    }
  }

  # X-Ray tracing para debugging
  xray_tracing_enabled = true

  lifecycle {
    ignore_changes = [deployment_id]
  }
}

# Method Settings optimizados para 100K RPM
resource "aws_api_gateway_method_settings" "high_traffic_optimized" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.production.stage_name
  method_path = "*/*"

  settings {
    # Throttling settings para 100K RPM (~1666 RPS)
    throttling_burst_limit = 5000     # Burst alto para picos
    throttling_rate_limit  = 1666.0   # 100,000 requests por minuto
    
    # Caching settings
    caching_enabled = true
    cache_ttl_in_seconds = 300        # 5 minutos cache para respuestas
    cache_data_encrypted = true
    
    # Logging y métricas
    metrics_enabled        = true
    logging_level          = "INFO"
    data_trace_enabled     = true
    require_authorization_for_cache_control = true
    
    # Timeouts optimizados
    throttling_rate_limit  = 1666.0
  }
}

# Configuración específica para endpoints de IA
resource "aws_api_gateway_method_settings" "ia_endpoints" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.production.stage_name
  method_path = "ia-tasks/POST"

  settings {
    # Throttling más agresivo para IA (operaciones costosas)
    throttling_burst_limit = 1000
    throttling_rate_limit  = 500      # 30K RPM para IA
    
    caching_enabled = false  # No cachear operaciones async
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

resource "aws_api_gateway_method_settings" "status_endpoints" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.production.stage_name
  method_path = "ia-tasks/GET"

  settings {
    # Status checks pueden ser más frecuentes
    throttling_burst_limit = 10000
    throttling_rate_limit  = 1666     # 100K RPM compartido
    
    caching_enabled = true
    cache_ttl_in_seconds = 10         # Cache corto para status
    metrics_enabled = true
  }
}

# Usage Plans para diferentes niveles
resource "aws_api_gateway_usage_plan" "enterprise_100k" {
  name        = "enterprise-100k"
  description = "Plan enterprise para 100K RPM"

  api_stages {
    api_id = aws_api_gateway_rest_api.main.id
    stage  = aws_api_gateway_stage.production.stage_name
  }

  # Throttling a nivel de usage plan
  throttle_settings {
    burst_limit = 10000
    rate_limit  = 1666.0
  }

  # Quota mensual muy alto
  quota_settings {
    limit  = 50000000  # 50 millones requests/mes
    offset = 0
    period = "MONTH"
  }
}

resource "aws_api_gateway_usage_plan" "premium_10k" {
  name        = "premium-10k"
  description = "Plan premium para 10K RPM"

  api_stages {
    api_id = aws_api_gateway_rest_api.main.id
    stage  = aws_api_gateway_stage.production.stage_name
  }

  throttle_settings {
    burst_limit = 1000
    rate_limit  = 166.0  # 10K RPM
  }

  quota_settings {
    limit  = 5000000  # 5 millones requests/mes
    period = "MONTH"
  }
}

resource "aws_api_gateway_usage_plan" "free_1k" {
  name        = "free-1k"
  description = "Plan free para 1K RPM"

  api_stages {
    api_id = aws_api_gateway_rest_api.main.id
    stage  = aws_api_gateway_stage.production.stage_name
  }

  throttle_settings {
    burst_limit = 100
    rate_limit  = 16.6  # 1K RPM
  }

  quota_settings {
    limit  = 50000  # 50K requests/mes
    period = "MONTH"
  }
}

# API Gateway Deployment con configuración optimizada
resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = ""

  # Triggers para forzar deployment cuando cambian los recursos
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_rest_api.main.body,
      aws_api_gateway_method_settings.high_traffic_optimized.id,
      aws_api_gateway_method_settings.ia_endpoints.id,
      aws_api_gateway_method_settings.status_endpoints.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# CloudWatch Log Group para access logs
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${aws_api_gateway_rest_api.main.name}"
  retention_in_days = 30

  tags = {
    Environment = "production"
    Service     = "api-gateway"
  }
}

# CloudWatch Alarms para monitoreo de 100K RPM
resource "aws_cloudwatch_metric_alarm" "high_4xx_rate" {
  alarm_name          = "${aws_api_gateway_rest_api.main.name}-high-4xx-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4XXError"
  namespace           = "AWS/ApiGateway"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1000"  # 1000 errores 4xx por minuto
  alarm_description   = "Monitor high 4XX error rate for API Gateway"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ApiName = aws_api_gateway_rest_api.main.name
    Stage   = aws_api_gateway_stage.production.stage_name
  }
}

resource "aws_cloudwatch_metric_alarm" "high_throttling" {
  alarm_name          = "${aws_api_gateway_rest_api.main.name}-high-throttling"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/ApiGateway"
  period              = "60"
  statistic           = "Sum"
  threshold           = "5000"  # 5000 requests throttled por minuto
  alarm_description   = "Monitor high throttling rate"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ApiName = aws_api_gateway_rest_api.main.name
    Stage   = aws_api_gateway_stage.production.stage_name
  }
}

resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "${aws_api_gateway_rest_api.main.name}-high-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "Latency"
  namespace           = "AWS/ApiGateway"
  period              = "60"
  statistic           = "Average"
  threshold           = "2000"  # 2 segundos de latencia promedio
  alarm_description   = "Monitor high API latency"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ApiName = aws_api_gateway_rest_api.main.name
    Stage   = aws_api_gateway_stage.production.stage_name
  }
}

# SNS Topic para alertas
resource "aws_sns_topic" "alerts" {
  name = "api-gateway-alerts"
}

# WAF Web ACL para protección adicional
resource "aws_wafv2_web_acl" "api_gateway" {
  name  = "api-gateway-protection-100k"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "RateLimitRule"
    priority = 2

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 2000  # IP-based rate limiting
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "api-gateway-waf"
    sampled_requests_enabled   = true
  }
}

# Asociar WAF con API Gateway
resource "aws_wafv2_web_acl_association" "api_gateway" {
  resource_arn = aws_api_gateway_stage.production.arn
  web_acl_arn  = aws_wafv2_web_acl.api_gateway.arn
}

# Variables
variable "enable_access_logs" {
  description = "Enable API Gateway access logs"
  type        = bool
  default     = true
}

# Outputs
output "api_gateway_url" {
  value = "${aws_api_gateway_stage.production.invoke_url}/"
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.main.id
}

output "usage_plan_ids" {
  value = {
    enterprise = aws_api_gateway_usage_plan.enterprise_100k.id
    premium    = aws_api_gateway_usage_plan.premium_10k.id
    free       = aws_api_gateway_usage_plan.free_1k.id
  }
}
``` 



# 4. Estrategia de Versionado

Se utiliza **Semantic Versioning (SemVer)** para mantener claridad en los cambios, compatibilidad entre módulos y trazabilidad en los despliegues del ecosistema **PromptSales**.

## 4.1 Principios

`MAJOR.MINOR.PATCH`

- **MAJOR:** Cambios incompatibles con versiones anteriores.
- **MINOR:** Nuevas funcionalidades compatibles.
- **PATCH:** Correcciones o mejoras internas menores.

Ejemplo: `v2.3.5`

## 4.2 Alcance y Aplicación

- Cada **subplataforma** (PromptContent, PromptAds, PromptCRM) mantiene su **propia versión** siguiendo SemVer.
- **Componentes compartidos** (`src/shared/`, contratos REST/MCP) heredan la versión del módulo principal.
- **Imágenes Docker, Knative y K8s** incluyen la etiqueta:
    
    `app.kubernetes.io/version: vX.Y.Z`
    
- **Pipelines CI/CD** distribuyen automáticamente la versión a artefactos y rutas de despliegue.

## 4.3 Publicación

Herramienta: **semantic-release**

- `feat!:` o `BREAKING CHANGE:` → **MAJOR**
- `feat:` → **MINOR**
- `fix:` → **PATCH**

Cada release genera:

1. **Tag Git** (`vX.Y.Z`)
2. **Imagen Docker** (`:vX.Y.Z`, `:latest`)
3. **Actualización de datos** (`info.version`, `vN.yaml/json`, etc.)

## 4.4 Registro y Trazabilidad

- Cambios documentados en **`CHANGELOG.md`** de cada subplataforma.
- Generado automáticamente durante la publicación.
- Historial disponible en **tags del repositorio** y **pipelines CI/CD**.

## 5. Frontend Deployment (Vercel)

### Decisión de Uso
Utilizaremos **Vercel** exclusivamente para el despliegue del portal web unificado (frontend), manteniendo toda la lógica de negocio y APIs en nuestra infraestructura AWS.

### ¿Por qué Vercel?
- **Despliegue optimizado** para Next.js con integración nativa
- **CDN global** para assets estáticos del portal web
- **SSL automático** y gestión de dominios
- **CI/CD integrado** con GitHub para el frontend

### ¿Por qué NO Supabase?
No utilizaremos Supabase porque nuestra arquitectura ya incluye:
- ✅ **Auth0** para autenticación enterprise-grade
- ✅ **AWS RDS** para bases de datos relacionales
- ✅ **MongoDB Atlas** para datos no relacionales  
- ✅ **Redis ElastiCache** para caching
- ✅ **AWS Secrets Manager** para gestión de secrets

Supabase no proporciona capacidades adicionales que justifiquen la complejidad de integración.
