const { MongoClient } = require('mongodb');

// ============================================
// CONFIGURACIÓN DE CONEXIÓN
// ============================================
const MONGO_URL = "mongodb://mongouser:mongo123@localhost:30017/promptcontent?authSource=admin";
const DATABASE_NAME = "promptcontent";

async function createDatabaseAndCollections() {
    let client;
    
    try {
        // Conectar a MongoDB
        client = new MongoClient(MONGO_URL);
        await client.connect();
        const db = client.db(DATABASE_NAME);
        
        console.log("Conectado a MongoDB");
        console.log(`Base de datos: ${DATABASE_NAME}`);
        console.log("-".repeat(60));
        
        // ============================================
        // 1. COLECCIÓN: PCUsers
        // ============================================
        try {
            await db.createCollection("PCUsers", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["userId", "email", "name", "role", "createdAt", "authMethod"],
                        properties: {
                            userId: { bsonType: "string" },
                            email: { bsonType: "string" },
                            name: { bsonType: "string" },
                            role: { bsonType: "string", enum: ["admin", "marketer", "agent", "client"] },
                            passwordHash: { bsonType: "string" },
                            authMethod: { bsonType: "string", enum: ["local", "oauth_google", "oauth_microsoft", "sso"] },
                            lastPasswordChange: { bsonType: "date" },
                            twoFactorEnabled: { bsonType: "bool" },
                            createdAt: { bsonType: "date" },
                            lastLogin: { bsonType: "date" },
                            status: { bsonType: "string", enum: ["active", "inactive", "suspended"] }
                        }
                    }
                }
            });
            console.log("Colección 'PCUsers' creada");
        } catch (error) {
            console.log("Colección 'PCUsers' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCUsers").createIndex({ "userId": 1 }, { unique: true });
        await db.collection("PCUsers").createIndex({ "email": 1 }, { unique: true });
        await db.collection("PCUsers").createIndex({ "role": 1 });
        console.log("  → Índices creados para 'PCUsers'");
        
        // ============================================
        // 2. COLECCIÓN: PCExternal_Services
        // ============================================
        try {
            await db.createCollection("PCExternal_Services", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["serviceId", "name", "baseUrl", "configuration", "authMethod", "createdAt"],
                        properties: {
                            serviceId: { bsonType: "string" },
                            name: { bsonType: "string" },
                            baseUrl: { bsonType: "string" },
                            authMethod: { bsonType: "string" },
                            encryptedCredentials: { bsonType: "string" },
                            secretKey: { bsonType: "string" },
                            apiKey: { bsonType: "string" },
                            status: { bsonType: "string", enum: ["active", "inactive", "testing"] },
                            lastTestedAt: { bsonType: "date" },
                            createdAt: { bsonType: "date" },
                            updatedAt: { bsonType: "date" },
                            configuration: { bsonType: "object" }
                        }
                    }
                }
            });
            console.log("Colección 'PCExternal_Services' creada");
        } catch (error) {
            console.log("Colección 'PCExternal_Services' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCExternal_Services").createIndex({ "serviceId": 1 }, { unique: true });
        await db.collection("PCExternal_Services").createIndex({ "name": 1 });
        console.log("  → Índices creados para 'PCExternal_Services'");

        // ============================================
        // 3. COLECCIÓN: PCApi_Call_Logs
        // ============================================
        try {
            await db.createCollection("PCApi_Call_Logs", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["logId", "serviceId", "timestamp", "request", "response", "statusCode", "userId", "platform", "ipAddress"],
                        properties: {
                            logId: { bsonType: "string" },
                            serviceId: { bsonType: "string" },
                            endpoint: { bsonType: "string" },
                            method: { bsonType: "string" },
                            request: { bsonType: "object" },
                            response: { bsonType: "object" },
                            statusCode: { bsonType: "int" },
                            responseTime: { bsonType: "int" },
                            result: { bsonType: "string" },
                            userId: { bsonType: "string" },
                            platform: { bsonType: "string" },
                            ipAddress: { bsonType: "string" },
                            processType: { bsonType: "string" },
                            timestamp: { bsonType: "date" },
                            processedAt: { bsonType: "date" },
                            errorDetails: { bsonType: "string" }
                        }
                    }
                }
            });
            console.log("Colección 'PCApi_Call_Logs' creada");
        } catch (error) {
            console.log("Colección 'PCApi_Call_Logs' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCApi_Call_Logs").createIndex({ "logId": 1 }, { unique: true });
        await db.collection("PCApi_Call_Logs").createIndex({ "serviceId": 1 });
        await db.collection("PCApi_Call_Logs").createIndex({ "timestamp": -1 });
        await db.collection("PCApi_Call_Logs").createIndex({ "userId": 1 });
        console.log("  → Índices creados para 'PCApi_Call_Logs'");

        // ============================================
        // 4. COLECCIÓN: PCAi_Models_Catalog
        // ============================================
        try {
            await db.createCollection("PCAi_Models_Catalog", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["modelId", "name", "provider", "modelEndpoint", "version", "createdAt"],
                        properties: {
                            modelId: { bsonType: "string" },
                            name: { bsonType: "string" },
                            description: { bsonType: "string" },
                            provider: { 
                                bsonType: "string", 
                                enum: ["openai", "anthropic", "google", "huggingface", "aws_bedrock", "azure_openai", "custom"] 
                            },
                            baseModel: { bsonType: "string" },
                            modelEndpoint: { bsonType: "string" },
                            isFineTuned: { bsonType: "bool" },
                            fineTunedModelId: { bsonType: "string" },
                            fineTunedAt: { bsonType: "date" },
                            status: { bsonType: "string", enum: ["active", "inactive", "testing"] },
                            createdAt: { bsonType: "date" },
                            updatedAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCAi_Models_Catalog' creada");
        } catch (error) {
            console.log("Colección 'PCAi_Models_Catalog' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCAi_Models_Catalog").createIndex({ "modelId": 1 }, { unique: true });
        await db.collection("PCAi_Models_Catalog").createIndex({ "name": 1 });
        console.log("  → Índices creados para 'PCAi_Models_Catalog'");

        // ============================================
        // 5. COLECCIÓN: PCAi_Model_Logs
        // ============================================
        try {
            await db.createCollection("PCAi_Model_Logs", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["logId", "modelId", "timestamp", "input", "output", "userId", "status", "ipAddress"],
                        properties: {
                            logId: { bsonType: "string" },
                            modelId: { bsonType: "string" },
                            versionId: { bsonType: "string" },
                            input: { bsonType: "string" },
                            output: { bsonType: "object" },
                            parameters: { bsonType: "object" },
                            userId: { bsonType: "string" },
                            ipAddress: { bsonType: "string" },
                            processType: { bsonType: "string" },
                            timestamp: { bsonType: "date" },
                            processingTime: { bsonType: "int" },
                            status: { bsonType: "string" },
                            mcpServerUsed: { bsonType: "bool" },
                            mcpServerName: { bsonType: "string" }
                        }
                    }
                }
            });
            console.log("Colección 'PCAi_Model_Logs' creada");
        } catch (error) {
            console.log("Colección 'PCAi_Model_Logs' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCAi_Model_Logs").createIndex({ "logId": 1 }, { unique: true });
        await db.collection("PCAi_Model_Logs").createIndex({ "modelId": 1 });
        await db.collection("PCAi_Model_Logs").createIndex({ "timestamp": -1 });
        console.log("  → Índices creados para 'PCAi_Model_Logs'");

        // ============================================
        // 6. COLECCIÓN: PCContent_Types
        // ============================================
        try {
            await db.createCollection("PCContent_Types", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["contentTypeId", "name", "createdAt"],
                        properties: {
                            contentTypeId: { bsonType: "string" },
                            name: { bsonType: "string", enum: ["text", "image", "video", "audio", "carousel", "story"] },
                            description: { bsonType: "string" },
                            supportedPlatforms: { bsonType: "array" },
                            createdAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCContent_Types' creada");
        } catch (error) {
            console.log("Colección 'PCContent_Types' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCContent_Types").createIndex({ "contentTypeId": 1 }, { unique: true });
        await db.collection("PCContent_Types").createIndex({ "name": 1 });
        console.log("  → Índices creados para 'PCContent_Types'");

        // ============================================
        // 7. COLECCIÓN: PCmedia
        // ============================================
        try {
            await db.createCollection("PCmedia", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["clientId", "requestDescription", "hashtags", "deliveryStatus", "format"],
                        properties: {
                            mediaId: { bsonType: "string" },
                            mediaUrl: { bsonType: "string" },
                            fileName: { bsonType: "string" },
                            format: { bsonType: "string" },
                            size: { bsonType: "int" },
                            description: { bsonType: "string" },
                            hashtags: { bsonType: "array" },
                            category: { bsonType: "string", enum: ["social", "ads", "web", "other"] },
                            platform: { bsonType: "string", enum: ["Youtube", "Instagram", "Facebook", "Tiktok", "other"] },
                            vectorEmbedding: { bsonType: "array" },
                            userId: { bsonType: "string" },
                            clientId: { bsonType: "string" },
                            requestId: { bsonType: "string" },
                            requestDescription: { bsonType: "string" },
                            campaignId: { bsonType: "string" },
                            adId: { bsonType: "string" },
                            strategyId: { bsonType: "string" },
                            deliveryStatus: { bsonType: "string", enum: ["Pending", "Delivered", "Processing"] },
                            createdAt: { bsonType: "date" },
                            updatedAt: { bsonType: "date" },
                            usageCount: { bsonType: "int" },
                            rights: { bsonType: "string" }
                        }
                    }
                }
            });
            console.log("Colección 'PCmedia' creada");
        } catch (error) {
            console.log("Colección 'PCmedia' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCmedia").createIndex({ "mediaId": 1 }, { unique: true });
        await db.collection("PCmedia").createIndex({ "hashtags": 1 });
        await db.collection("PCmedia").createIndex({ "description": "text" });
        await db.collection("PCmedia").createIndex({ "createdAt": -1 });
        await db.collection("PCmedia").createIndex({ "clientId": 1 });
        await db.collection("PCmedia").createIndex({ "campaignId": 1 });
        console.log("  → Índices creados para 'PCmedia'");

        // ============================================
        // 8. COLECCIÓN: PCContent_Requests
        // ============================================
        try {
            await db.createCollection("PCContent_Requests", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["requestId", "clientId", "contentType", "createdAt", "status", "ipAddress", "httpMethod", "requestHeaders", "requestBody"],
                        properties: {
                            requestId: { bsonType: "string" },
                            clientId: { bsonType: "string" },
                            contentType: { bsonType: "string" },
                            description: { bsonType: "string" },
                            targetAudience: { bsonType: "string" },
                            campaignDescription: { bsonType: "string" },
                            httpMethod: { bsonType: "string", enum: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
                            requestHeaders: { bsonType: "object" },
                            requestBody: { bsonType: "object" },
                            ipAddress: { bsonType: "string" },
                            generatedContent: {
                                bsonType: "array",
                                description: "Contenido generado como resultado",
                                items: {
                                    bsonType: "object",
                                    properties: {
                                        contentId: { bsonType: "string" },
                                        contentType: { bsonType: "string" },
                                        url: { bsonType: "string" },
                                        metadata: { bsonType: "object" }
                                    }
                                }
                            },
                            status: { bsonType: "string", enum: ["pending", "processing", "completed", "failed"] },
                            createdAt: { bsonType: "date" },
                            completedAt: { bsonType: "date" },
                            processingTime: { bsonType: "int" }
                        }
                    }
                }
            });
            console.log("✓ Colección 'PCContent_Requests' creada");
        } catch (error) {
            console.log("Colección 'PCContent_Requests' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCContent_Requests").createIndex({ "requestId": 1 }, { unique: true });
        await db.collection("PCContent_Requests").createIndex({ "clientId": 1 });
        await db.collection("PCContent_Requests").createIndex({ "createdAt": -1 });
        await db.collection("PCContent_Requests").createIndex({ "status": 1 });
        await db.collection("PCContent_Requests").createIndex({ "contentType": 1 });
        await db.collection("PCContent_Requests").createIndex({ "ipAddress": 1 });
        console.log("  → Índices creados para 'PCContent_Requests'");

        // ============================================
        // 9. COLECCIÓN: PCClients
        // ============================================
        try {
            await db.createCollection("PCClients", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["clientId", "email", "name", "createdAt", "status"],
                        properties: {
                            clientId: { bsonType: "string" },
                            email: { bsonType: "string" },
                            name: { bsonType: "string" },
                            company: { bsonType: "string" },
                            phone: { bsonType: "string" },
                            createdAt: { bsonType: "date" },
                            updatedAt: { bsonType: "date" },
                            status: { bsonType: "string", enum: ["active", "inactive", "suspended"] },
                            subscriptions: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    properties: {
                                        subscriptionId: { bsonType: "string" },
                                        planId: { bsonType: "string" },
                                        planName: { bsonType: "string" },
                                        status: { bsonType: "string", enum: ["active", "paused", "cancelled"] },
                                        startDate: { bsonType: "date" },
                                        endDate: { bsonType: "date" },
                                        renewalDate: { bsonType: "date" },
                                        paymentStatus: { bsonType: "string", enum: ["paid", "pending", "failed"] },
                                        usageTracking: {
                                            bsonType: "object",
                                            description: "Rastreo de uso por feature",
                                            additionalProperties: {
                                                bsonType: "object",
                                                properties: {
                                                    used: { bsonType: "int" },
                                                    limit: { bsonType: "int" },
                                                    resetDate: { bsonType: "date" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            console.log("Colección 'PCClients' creada");
        } catch (error) {
            console.log("Colección 'PCClients' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCClients").createIndex({ "clientId": 1 }, { unique: true });
        await db.collection("PCClients").createIndex({ "email": 1 }, { unique: true });
        await db.collection("PCClients").createIndex({ "status": 1 });
        console.log("  → Índices creados para 'PCClients'");

        // ============================================
        // 10. COLECCIÓN: PCSubscription_Plans
        // ============================================
        try {
            await db.createCollection("PCSubscription_Plans", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["planId", "name", "price", "createdAt"],
                        properties: {
                            planId: { bsonType: "string" },
                            name: { bsonType: "string" },
                            description: { bsonType: "string" },
                            price: { bsonType: "double" },
                            currency: { bsonType: "string" },
                            billingCycle: { bsonType: "string", enum: ["monthly", "quarterly", "annual"] },
                            status: { bsonType: "string", enum: ["active", "discontinued"] },
                            features: {
                                bsonType: "array",
                                description: "Features incluidas en este plan con sus límites",
                                items: {
                                    bsonType: "object",
                                    required: ["featureId", "limit"],
                                    properties: {
                                        featureId: { bsonType: "string" },
                                        featureName: { bsonType: "string" },
                                        limit: { bsonType: "int", description: "-1 para ilimitado" }
                                    }
                                }
                            },
                            createdAt: { bsonType: "date" },
                            updatedAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCSubscription_Plans' creada");
        } catch (error) {
            console.log("Colección 'PCSubscription_Plans' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCSubscription_Plans").createIndex({ "planId": 1 }, { unique: true });
        await db.collection("PCSubscription_Plans").createIndex({ "name": 1 });
        await db.collection("PCSubscription_Plans").createIndex({ "status": 1 });
        console.log("  → Índices creados para 'PCSubscription_Plans'");

        // ============================================
        // 11. COLECCIÓN: PCFeatures
        // ============================================
        try {
            await db.createCollection("PCFeatures", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["featureId", "name", "createdAt"],
                        properties: {
                            featureId: { bsonType: "string" },
                            name: { bsonType: "string" },
                            description: { bsonType: "string" },
                            createdAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCFeatures' creada");
        } catch (error) {
            console.log("Colección 'PCFeatures' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCFeatures").createIndex({ "featureId": 1 }, { unique: true });
        console.log("  → Índices creados para 'PCFeatures'");

        // ============================================
        // 12. COLECCIÓN: PCPayment_Methods
        // ============================================
        try {
            await db.create_collection("PCPayment_Methods", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["methodId", "name", "type", "createdAt"],
                        properties: {
                            methodId: { bsonType: "string" },
                            name: { bsonType: "string", enum: ["credit_card", "debit_card", "paypal", "wire_transfer"] },
                            type: { bsonType: "string" },
                            description: { bsonType: "string" },
                            isActive: { bsonType: "bool" },
                            createdAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCPayment_Methods' creada");
        } catch (error) {
            console.log("Colección 'PCPayment_Methods' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCPayment_Methods").createIndex({ "methodId": 1 }, { unique: true });
        console.log("  → Índices creados para 'PCPayment_Methods'");

        // ============================================
        // 13. COLECCIÓN: PCPayment_Schedules
        // ============================================
        try {
            await db.createCollection("PCPayment_Schedules", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["scheduleId", "subscriptionId", "amount", "dueDate"],
                        properties: {
                            scheduleId: { bsonType: "string" },
                            subscriptionId: { bsonType: "string" },
                            amount: { bsonType: "double" },
                            currency: { bsonType: "string" },
                            dueDate: { bsonType: "date" },
                            status: { bsonType: "string", enum: ["pending", "paid", "overdue", "cancelled"] },
                            paymentMethodId: { bsonType: "string" },
                            createdAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCPayment_Schedules' creada");
        } catch (error) {
            console.log("Colección 'PCPayment_Schedules' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCPayment_Schedules").createIndex({ "scheduleId": 1 }, { unique: true });
        await db.collection("PCPayment_Schedules").createIndex({ "subscriptionId": 1 });
        await db.collection("PCPayment_Schedules").createIndex({ "dueDate": 1 });
        console.log("  → Índices creados para 'PCPayment_Schedules'");

        // ============================================
        // 14. COLECCIÓN: PCPayment_Transactions
        // ============================================
        try {
            await db.createCollection("PCPayment_Transactions", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["transactionId", "subscriptionId", "clientId", "amount", "timestamp"],
                        properties: {
                            transactionId: { bsonType: "string" },
                            subscriptionId: { bsonType: "string" },
                            clientId: { bsonType: "string" },
                            amount: { bsonType: "double" },
                            currency: { bsonType: "string" },
                            paymentMethodId: { bsonType: "string" },
                            status: { bsonType: "string", enum: ["success", "failed", "pending", "refunded"] },
                            externalTransactionId: { bsonType: "string" },
                            details: { bsonType: "object" },
                            timestamp: { bsonType: "date" },
                            processedAt: { bsonType: "date" },
                            errorMessage: { bsonType: "string" }
                        }
                    }
                }
            });
            console.log("Colección 'PCPayment_Transactions' creada");
        } catch (error) {
            console.log("Colección 'PCPayment_Transactions' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCPayment_Transactions").createIndex({ "transactionId": 1 }, { unique: true });
        await db.collection("PCPayment_Transactions").createIndex({ "subscriptionId": 1 });
        await db.collection("PCPayment_Transactions").createIndex({ "clientId": 1 });
        await db.collection("PCPayment_Transactions").createIndex({ "timestamp": -1 });
        console.log("  → Índices creados para 'PCPayment_Transactions'");

        // ============================================
        // 15. COLECCIÓN: PCCampaigns
        // ============================================
        try {
            await db.createCollection("PCCampaigns", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["campaignId", "name", "description", "createdAt"],
                        properties: {
                            campaignId: { bsonType: "string" },
                            name: { bsonType: "string" },
                            description: { bsonType: "string" },
                            targetAudience: { bsonType: "string" },
                            campaignMessage: { bsonType: "string" },
                            contentVersions: { bsonType: "array" },
                            usedImages: { bsonType: "array" },
                            status: { bsonType: "string", enum: ["draft", "active", "completed", "archived"] },
                            startDate: { bsonType: "date" },
                            endDate: { bsonType: "date" },
                            createdAt: { bsonType: "date" },
                            updatedAt: { bsonType: "date" }
                        }
                    }
                }
            });
            console.log("Colección 'PCCampaigns' creada");
        } catch (error) {
            console.log("Colección 'PCCampaigns' ya existe");
        }
        
        // ÍNDICES
        await db.collection("PCCampaigns").createIndex({ "campaignId": 1 }, { unique: true });
        await db.collection("PCCampaigns").createIndex({ "createdAt": -1 });
        await db.collection("PCCampaigns").createIndex({ "status": 1 });
        console.log("  → Índices creados para 'PCCampaigns'");

        // ============================================
        // RESUMEN FINAL
        // ============================================
        console.log("-".repeat(60));
        console.log(`Base de datos '${DATABASE_NAME}' configurada exitosamente`);
        console.log(`Total de colecciones creadas: 15`);
        
        // Listar todas las colecciones
        const collections = await db.listCollections().toArray();
        console.log("\nColecciones disponibles:");
        collections.forEach((col, i) => {
            console.log(`  ${i + 1}. ${col.name}`);
        });
        
        console.log("\n¡Script completado exitosamente!");
        
    } catch (error) {
        console.error(`\nError: ${error}`);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log("\nConexión cerrada");
        }
    }
}

// Ejecutar el script
console.log("=".repeat(60));
console.log("CREACIÓN DE BASE DE DATOS - PROMPTCONTENT");
console.log("=".repeat(60));

createDatabaseAndCollections().catch(console.error);