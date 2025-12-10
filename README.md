# PromptSales
PromptSales - Ecosistema de Marketing con IA

* Carlos Ávalos Mendieta 


## Índice
* [**Métricas**](#1-métricas-no-funcionales)
  * [Rendimiento](#11-rendimiento)
  * [Escalabilidad](#12-escalabilidad)  
  * [Reliability](#13-confiabilidad)
  * [Availability](#14-disponibilidad)
  * [Security](#15-seguridad)
  * [Maintainability](#16-maintainability)
  * [Interoperability](#17-interoperability)
  * [Compliance](#18-compliance)
  * [Extensibility](#19-extensibility)

* [**DDD**](#2-domain-driven-design)

**Estructura del proyecto**
```
📦 PromptSales
│
├── 📄 .eslint.cjs
├── 📄 buildspec.yml
├── 📄 package.json
├── 📄 README.md
│
├── 📂 .github
│   └── 📂 workflows
│       ├── 📄 basic-check.yml
│       ├── 📄 ci-basic.yml
│       └── 📄 deploy.yml
│
├── 📂 assets
│
├── 📂 contracts
│   └── 📂 rest
│       ├── 📄 identity-openapi.yaml
│       ├── 📄 payment-openapi.yaml
│       └── 📄 subscription-openapi.yaml
│
├── 📂 kubernetes
│   ├── 📂 api-gateway
│   │   ├── 📄 kong-config.yaml
│   │   ├── 📄 kong-deployment.yaml
│   │   ├── 📄 kong-plugins.yaml
│   │   └── 📄 kong-routes.yaml
│   │
│   ├── 📂 eks
│   │   ├── 📄 eksctl-cluster.yaml
│   │   ├── 📄 etcd-encryption.yaml
│   │   └── 📄 prompt-ads.yaml
│   │
│   ├── 📂 external-secrets
│   │   ├── 📄 external-secret-ads-sql.yaml
│   │   ├── 📄 external-secret-auth0.yaml
│   │   ├── 📄 external-secret-crm-sql.yaml
│   │   ├── 📄 external-secret-mongo.yaml
│   │   ├── 📄 secret-store.yaml
│   │   └── 📄 service-account.yaml
│   │
│   ├── 📂 ingress
│   │   └── 📄 alb-tls13.yaml
│   │
│   ├── 📂 knative
│   │   ├── 📄 kubernetes-config.yaml
│   │   ├── 📄 prompt-ads.yaml
│   │   ├── 📄 prompt-content.yaml
│   │   ├── 📄 prompt-crm.yaml
│   │   └── 📄 prompt-sales.yaml
│   │
│   ├── 📂 mongodb
│   ├── 📂 redis
│   └── 📂 sqlserver
│
├── 📂 src
│   ├── 📂 applications
│   │   ├── 📂 prompt-ads
│   │   │   ├── 📄 routes.js
│   │   │   ├── 📄 server.js
│   │   │   │
│   │   │   ├── 📂 acl
│   │   │   ├── 📂 clients
│   │   │   ├── 📂 contracts
│   │   │   ├── 📂 database
│   │   │   │   ├── 📄 redis-client.js
│   │   │   │   ├── 📄 sequelize-config.js
│   │   │   │   ├── 📄 sql-server-connection.js
│   │   │   │   ├── 📂 schema
│   │   │   │   ├── 📂 scripts
│   │   │   │   ├── 📂 migrations
│   │   │   │   └── 📂 seed
│   │   │   │
│   │   │   ├── 📂 domains
│   │   │   │   ├── 📂 controllers
│   │   │   │   ├── 📂 models
│   │   │   │   ├── 📂 repositories
│   │   │   │   └── 📂 services
│   │   │   │
│   │   │   └── 📂 tests
│   │   │
│   │   ├── 📂 prompt-content
│   │   │   ├── 📄 migrate-mongo-config.js
│   │   │   ├── 📄 S3Client.js
│   │   │   ├── 📄 routes.js
│   │   │   ├── 📄 server.js
│   │   │   │
│   │   │   ├── 📂 acl
│   │   │   ├── 📂 clients
│   │   │   ├── 📂 contracts
│   │   │   ├── 📂 database
│   │   │   │   ├── 📂 collections
│   │   │   │   ├── 📂 indexes
│   │   │   │   ├── 📂 migrations
│   │   │   │   └── 📂 scripts
│   │   │   │
│   │   │   ├── 📂 domains
│   │   │   │   ├── 📂 controllers
│   │   │   │   ├── 📂 models
│   │   │   │   ├── 📂 repositories
│   │   │   │   └── 📂 services
│   │   │   │
│   │   │   └── 📂 workers
│   │   │
│   │   ├── 📂 prompt-crm
│   │   │   ├── 📄 routes.js
│   │   │   ├── 📄 server.js
│   │   │   │
│   │   │   ├── 📂 acl
│   │   │   ├── 📂 clients
│   │   │   ├── 📂 contracts
│   │   │   ├── 📂 database
│   │   │   │   └──📂 migrations
│   │   │   │
│   │   │   └── 📂 domains
│   │   │   │   ├── 📂 controllers
│   │   │   │   ├── 📂 models
│   │   │   │   ├── 📂 repositories
│   │   │   │   └── 📂 services
│   │   │   │
│   │   └── 📂 prompt-sales
│   │   │   ├── 📄 routes.js
│   │   │   ├── 📄 server.js
│   │   │   │
│   │   │   ├── 📂 acl
│   │   │   ├── 📂 clients
│   │   │   ├── 📂 contracts
│   │   │   ├── 📂 database
│   │   │   │   └──📂 migrations
│   │   │   │
│   │   │   └── 📂 domains
│   │   │   │   ├── 📂 controllers
│   │   │   │   ├── 📂 models
│   │   │   │   ├── 📂 repositories
│   │   │   │   └── 📂 services
│   │
│   ├── 📂 gateways
│   │   ├── 📂 mcp
│   │   │
│   │   ├── 📂 messaging
│   │   │
│   │   └── 📂 webhooks
│   │
│   ├── 📂 integration
│   │   └── 📄 setup.js
│   │
│   ├── 📂 presentation
│   │   └── 📄 fetchClient.js
│   │
│   └── 📂 shared
│       ├── 📄 ACLRegistry.js
│       │
│       ├── 📂 auth
│       │   ├── 📄 middleware.js
│       │   └── 📄 oidc-setup.js
│       │
│       ├── 📂 aws
│       │   ├── 📄 dependencies.js
│       │   └── 📄 SQSService.js
│       │
│       ├── 📂 http
│       ├── 📂 jobs
│       ├── 📂 observability
│       └── 📂 security
│           ├── 📄 allowlist.js
│           ├── 📄 callbackSigner.js
│           ├── 📄 rate-limit.js
│           ├── 📄 requireScope.js
│           └── 📄 validators.js
│
├── 📂 web
│   └── 📄 vercel.json
│
└── 📂 webhooks
    └── 📂 schemas
        ├── 📄 ads.campaign.created.json
        └── 📄 crm.lead.created.json
```

# 1. Métricas no funcionales

Para todas las métricas no funcionales y la estructura general del ecosistema PromptSales, incluyendo los tres subservicios (PromptContent, PromptAds y PromptCrm), se adopta una arquitectura **Serverless** desplegada en **AWS** mediante Knative sobre **Kubernetes** (EKS), con bases de datos relacionales sobre **SQL Server** y no relacionales sobre **MongoDB**. Así como el uso de **JavaScript (Node.js)** como framework para la capa de ejecución de microservicios, asegurando así la compatibilidad con el modelo de funciones isoladas y un escalado horizontal dinámico basado en demanda.

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

[kubernetes-config.yaml](/k8s/knative/kubernetes-config.yaml)

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
[oidc-setup.js](/src/shared/auth/oidc-setup.js)

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
[middleware.js](/src/shared/auth/middleware.js)
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
[server.js](/src/apps/prompt-content/server.js)
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
[service-account.yaml](/k8s/external-secrets/service-account.yaml)
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
[secret-store.yaml](/k8s/external-secrets/secret-store.yaml)
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
[external-secret.yaml](/k8s/external-secrets/external-secret.yaml)
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
[prompt-content.yaml](/k8s/knative/prompt-content.yaml)
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
      - image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/prompt-content:154
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
[alb-tls13.yaml](/k8s/ingress/alb-tls13.yaml)
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
[sqlserver-connection.json](/k8s/sqlserver/sqlserver-connection.json)
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
[mongo-connection.json](/k8s/mongodb/mongo-connection.json)
```JSON
{
  "uri": "mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/promptsales?retryWrites=true&w=majority&tls=true",
  "options": {
    "serverSelectionTimeoutMS": 30000
  }
}
```

**ElastiCache Redis**
[elasticache-redis.yaml](/k8s/redis/elasticache-redis.yaml)
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
[etcd-encryption.yaml](/k8s/eks/etcd-encryption.yaml)
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
[etcd-encryption.yaml](/k8s/eks/etcd-encryption.yaml)
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
- **Billing & Payments** 
- **Clientes y Organizaciones** 
- **Productos y Catálogo**
- **Almacenamiento**
- **Integraciones** 
- **Analítica**
- **Agenda** 
- **Aprobaciones** 
- **Notificaciones** 
- **IA** 
- **Cache** 
- **Auditoría y Eventos** 
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
- **Audiencias** 
- **Analítica de Anuncios** 
- **Finanzas**
- **Influencers**
- **Organizaciones** 

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

## 2.3 Estructura Base de Dominios (Arquitectura por Subempresas / Bounded Contexts)
Tras la reestructuración completa del proyecto PromptSales, adoptamos un enfoque en el que cada subempresa del ecosistema funciona como un bounded context independiente, y dentro de cada uno viven sus propios dominios internos (Campaigns, Subscriptions, Leads, Templates, etc.).

Este modelo reemplaza la propuesta inicial basada en un único macro‑dominio y es más coherente con DDD aplicado a microservicios modernos, aumentando la claridad, autonomía y escalabilidad.

### Qué contiene cada Bounded Context (subempresa)
Cada subempresa ubicada en src/apps/<"subempresa">/ constituye un bounded context completo, y por tanto incluye:

1. controllers/: 
  Contienen los casos de uso expuestos al App Server (rutas HTTP).

2. contracts/: 
  Definen las interfaces del BC hacia otros servicios (REST/OpenAPI).
  Representan los contratos estables que otros microservicios consumen.

3. acl/: 
  Implementan el Anti‑Corruption Layer:
  encapsulan las llamadas a otros microservicios para evitar que modelos externos contaminen el dominio interno.

4. clients/:
  Contienen los clients HTTP preparados para consumir los contratos REST de otros servicios.
  Son usados exclusivamente por los ACL.

Este patrón se replica en cada subempresa: Ads, CRM, Content, etc.

### Estructura de Carpetas
#### Cada bounded context sigue la estructura:

```markdown
src/apps/<subempresa>/
    server.js
    routes.js

    acl/
        <NombreACL>.js

    clients/
        <NombreClient>.js

    contracts/
        <NombreContract>.js

    domains/
        controllers/
        services/
        models/
        repositories/
```

### Flujo de Datos Dentro de un Bounded Context
1. El cliente externo realiza una solicitud HTTP.
2. routes.js la dirige al controlador adecuado.
3. El controlador usa los services internos.
4. Los services pueden usar:
- repositorios internos (ORM/SP/Redis/etc.)
- ACLs (para llamar a otros BC vía HTTP)

### Server y Rutas dentro de un Bounded Contex
[server.js](src/apps/prompt-ads/server.js)
```javascript
// server.js
import express from "express";
import { requireAuth } from "../../shared/auth/middleware.js";

import { CampaignController } from "./domains/controllers/CampaignController.js";
import { buildSubscriptionACL } from "./acl/wiring/subscriptions.js";

const app = express();
app.use(express.json());

const controller = CampaignController({
    subscriptionsACL: buildSubscriptionACL()
});

app.post("/campaigns/create", requireAuth, controller.create);

export default app;
```

### Contratos REST y Versionamiento
Cada microservicio expone su API mediante:
- OpenAPI (YAML)
- versionado en contracts/rest/ dentro del microservicio correspondient
Ejemplo (para Ads):
``` swift
src/apps/prompt-ads/contracts/CampaignContract.js (client + helpers)
contracts/rest/ads-openapi.yaml        (especificación formal)
``` 

**Shared:** registra Idempotency-Key [src/shared/http/idempotency.js](src/shared/http/idempotency.js), logs [src/shared/observability/logger.js](src/shared/observability/logger.js) y trazas [src/shared/observability/tracing.js](src/shared/observability/tracing.js).

### Testing 
Todos los tests cross-domain deben probar **solo los ACL.**
Nunca se testean directamente los clients o contratos externos.
``` swift
src/apps/prompt-ads/__tests__/CampaignACL.test.js
``` 
Además, cada dominio interno puede tener tests unitarios para:
- controllers
- services
- repositorios

# 3. Diagrama de arquitectura

![Diagrama de arquitectura](assets/Diagrama-Arquitectura.svg)

**Versión en PDF:**  [Diagrama de Arquitectura](assets/Diagrama-Arquitectura.pdf)

# 4. Patrones de Arquitectura


### Anti‑Corruption Layer entre Bounded Contexts

Cuando un microservicio necesita comunicarse con otro, no lo hace directamente:
**siempre pasa por su ACL interno** para proteger el dominio de modelos externos.
Ejemplo de flujo en Ads → Subscriptions:

```swift
src/apps/prompt-ads/acl/SubscriptionACL.js       (façade seguro)
src/apps/prompt-ads/clients/SubscriptionClient.js (client HTTP especializado)
src/apps/prompt-ads/contracts/SubscriptionContract.js (contrato REST versionado)
```
La comunicación inter‑contexto:
- es solo por HTTP/REST
- usa autenticación JWT con audience por microservicio
- nunca comparte modelos internos
- cada contrato es versionado para permitir evolución independiente





# 5. Diseño de Bases de Datos

## Base de Datos PromptAds: (SQL Server)

![Base de datos](assets/PromptAdsDataBase.png)

**Versión en PDF:**  [Base de datos](assets/PromptAdsDataBase.pdf)

**Schema:** [schema](src/apps/prompt-ads/db/schema/promptads_schema.sql)

## Base de Datos PromptContent: (Mongo)

**Colecciones**  [collections](src/apps/prompt-content/db/collections/)

## Implementación del Repository Layer

**Estructura de Directorios**

El repository layer está organizado en tres directorios principales dentro de `apps/prompt-ads`. En `domains/infrastructure/repositories/` están los archivos de implementación: `CampaignRepositorySP.js` usa stored procedures de SQL Server, mientras que `SubscriptionRepositoryORM.js` implementa el patrón con Sequelize. Los tests están en `scripts/`, separados en `test-subscription-writer.js` y `test-subscription-reader.js` para ORM, y archivos similares con prefijo `test-repository-` para stored procedures. La configuración de base de datos reside en `src/db/`, con `sql-server-connection.js` para conexiones directas y `sequelize-config.js` para ORM.

**Implementación con Stored Procedures**

Para el approach de stored procedures, creamos `CampaignRepositorySP.js` que encapsula llamadas a procedimientos almacenados en SQL Server. Este archivo contiene métodos como `create()` que ejecuta `usp_Campaign_Create` y `findById()` que llama a `usp_Campaign_GetById`. La conexión usa el driver `mssql` directamente, enviando parámetros mediante `request.input()` y recibiendo resultados en `recordset`. Los tests correspondientes validan escritura y lectura por separado, ejecutándose con Node.js y mostrando resultados en consola.

**Implementación con ORM (Sequelize)**

El approach ORM utiliza `SubscriptionRepositoryORM.js` que define operaciones CRUD sobre el modelo `Subscription`. Sequelize mapea automáticamente la tabla `PASubscriptions` mediante el modelo definido en `domains/models/Subscription.js`, que especifica tipos de datos y mapeo de columnas. Los métodos `create()`, `findById()` y `findAll()` usan la API de Sequelize para generar queries SQL automáticamente. Los tests demuestran creación de múltiples registros y consultas con diferentes criterios, aprovechando la abstracción del ORM para código más expresivo.

**Configuración y Pruebas**

La configuración de conexión difiere entre approaches: para SPs usamos conexión directa configurada en `sql-server-connection.js`, mientras que para ORM configuramos Sequelize en `sequelize-config.js` con opciones específicas para SQL Server. Las pruebas se ejecutan independientemente, primero escritura para generar datos, luego lectura para validarlos, permitiendo demostrar ambas operaciones requeridas. Cada archivo de test incluye logging detallado que muestra los queries generados y los resultados obtenidos, facilitando la verificación del funcionamiento correcto.

Para el punto solicitado de cache y connection pool, la solución implementada incluye:

**Connection Pool**

Ya está implementado tanto para Stored Procedures como para ORM, con parámetros:

- **max**: conexiones máximas simultáneas
- **min**: conexiones reservadas
- **idleTimeout**: liberación de conexiones inactivas

**Cache** (previstas)

Dado que no se requiere infraestructura Redis real, se agregaron previstas de cache en los repositories:

- Comentarios que indican dónde se inicializaría Redis
- TTL sugerido
- Estrategia cache-aside
- Lugares donde se harían invalidaciones

Esto demuestra cómo se integraría un sistema de cache distribuido en una arquitectura real.
Además se deja preparado para futuras implementaciones sin romper los repositorios existentes.

# 6. API Gateway & Routing

Usamos **Kong Gateway** para el routing de APIs. Configuración en [k8s/api-gateway/](k8s/api-gateway/)

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

# 7. Cloud Provider

### Decisión
**AWS (Amazon Web Services)** como proveedor cloud principal.

### Servicios AWS Utilizados
- **EKS** (Elastic Kubernetes Service) - Orquestación de contenedores
- **RDS** (Relational Database Service) - Bases de datos SQLServer
- **ElastiCache** - Redis para caching distribuido
- **Secrets Manager** - Gestión centralizada de secrets
- **ALB** (Application Load Balancer) - Balanceo de carga
- **SNS** - Mensajería y eventos asíncronos

