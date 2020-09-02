module.exports = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port:'3307',
    username: 'root',
    password: 'root',
    database: 'userCrud',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};