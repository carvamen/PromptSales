const fs = require('fs').promises;
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGO_URL = "mongodb://mongouser:mongo123@localhost:30017/promptcontent?authSource=admin";
const DATABASE_NAME = "promptcontent";

async function createDatabaseAndCollections() {
    let client;
    
    try {
        client = new MongoClient(MONGO_URL);
        await client.connect();
        const db = client.db(DATABASE_NAME);
        
        console.log("Conectado a MongoDB");
        console.log(`Base de datos: ${DATABASE_NAME}`);
        console.log("-".repeat(60));
        
        // Crear colecciones desde archivos
        await createCollectionsFromFiles(db);
        
        // Crear índices desde archivos
        await createIndexesFromFiles(db);
        
        console.log("-".repeat(60));
        console.log(`Base de datos '${DATABASE_NAME}' configurada exitosamente`);
        
        const collections = await db.listCollections().toArray();
        console.log(`Total de colecciones: ${collections.length}`);
        
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log("Conexión cerrada");
        }
    }
}

async function createCollectionsFromFiles(db) {
    const collectionsPath = path.join(__dirname, '../db/collections');
    
    try {
        const files = await fs.readdir(collectionsPath);
        
        for (const file of files) {
            if (file.endsWith('.collection.json')) {
                const collectionName = file.replace('.collection.json', '');
                const schemaPath = path.join(collectionsPath, file);
                const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
                
                try {
                    await db.createCollection(collectionName, schema);
                    console.log(`✅ ${collectionName} creada`);
                } catch (error) {
                    console.log(`ℹ️  ${collectionName} ya existe`);
                }
            }
        }
    } catch (error) {
        console.log('No se encontraron archivos de colecciones');
    }
}

async function createIndexesFromFiles(db) {
    const indexesPath = path.join(__dirname, '../db/indexes');
    
    try {
        const files = await fs.readdir(indexesPath);
        
        for (const file of files) {
            if (file.endsWith('.indexes.json')) {
                const collectionName = file.replace('.indexes.json', '');
                const indexPath = path.join(indexesPath, file);
                const indexes = JSON.parse(await fs.readFile(indexPath, 'utf8'));
                
                for (const index of indexes) {
                    await db.collection(collectionName).createIndex(index.key, {
                        unique: index.unique,
                        name: index.name
                    });
                }
                console.log(`✅ Índices de ${collectionName} creados`);
            }
        }
    } catch (error) {
        console.log('No se encontraron archivos de índices');
    }
}

// Ejecutar
console.log("=".repeat(60));
console.log("CREACIÓN DE BASE DE DATOS - PROMPTCONTENT");
console.log("=".repeat(60));

createDatabaseAndCollections().catch(console.error);