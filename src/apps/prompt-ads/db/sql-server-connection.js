const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Server=localhost;Database=promptads;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server};",

    // PREVISTAS DE CONNECTION POOL 
    pool: {
        max: 10,              // máx conexiones simultáneas
        min: 0,               // mín conexiones vivas
        idleTimeoutMillis: 30000 // cerrar conexiones inactivas
    }
};

let pool;

const getPool = async () => {
    try {
        if (!pool) {
            console.log("⏳ Creando pool de conexiones a SQL Server...");

            // AQUÍ SE CREA EL POOL REAL
            pool = new sql.ConnectionPool(config);

            // CONECTAR EL POOL
            pool = await pool.connect();

            console.log("✅ Pool de conexiones inicializado");
        }

        return pool;

    } catch (err) {
        console.error("❌ Error creando pool de conexión:", err.message);
        throw err;
    }
};

// Cerrar el pool al finalizar la app
process.on("SIGINT", async () => {
    if (pool) {
        await pool.close();
        console.log("🔌 Pool de conexión cerrado correctamente");
    }
    process.exit(0);
});

module.exports = {
    sql,
    getPool
};
