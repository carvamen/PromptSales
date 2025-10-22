# PromptSales
PromptSales - Ecosistema de Marketing con IA

## Non-Functional Metrics

### Index
- [Performance](#performance)
- [Scalability](#scalability)  
- [Reliability](#reliability)
- [Availability](#availability)
- [Security](#security)
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

### Security
*Documentar aquí métricas de seguridad*

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
- cubre: creación/edición de piezas (texto, imagen, video)
- objetivo: producir materiales listos para aprobar/publicar

#### plantillas
- cubre: guías de estilo, prompts base, formatos
- objetivo: reutilizar estilos por marca/país

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

