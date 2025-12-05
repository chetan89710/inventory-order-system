module.exports = {
    development: {
        username: "postgres",
        password: "postgres",
        database: "inventory_db",
        host: "localhost",
        port: 5432,
        dialect: "postgres"
    },
    test: {
        username: "postgres",
        password: "postgres",
        database: "inventory_db_test",
        host: "localhost",
        port: 5432,
        dialect: "postgres"
    },
    production: {
        username: "postgres",
        password: "postgres",
        database: "inventory_db_prod",
        host: "localhost",
        port: 5432,
        dialect: "postgres"
    }
};
