const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Server=localhost;Database=promptads;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server};"
};

let pool;

const getPool = async () => {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server');
        } catch (err) {
            console.error('❌ Error de conexión a SQL Server:', err.message);
            throw err;
        }
    }
    return pool;
};

// Cerrar conexión al terminar
process.on('SIGINT', async () => {
    if (pool) {
        await pool.close();
        console.log('Conexión a SQL Server cerrada');
    }
    process.exit(0);
});

module.exports = {
    sql,
    getPool
};