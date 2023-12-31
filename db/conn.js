const {MongoClient} = require("mongodb");
const Db = process.env.MONGO_URI;
console.log(Db)
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;

module.exports = {
    connectToServer: callback => {
        client.connect((err, db) => {
            if (db) {
                _db = db.db("stepik");
                console.log("Successfully connected to MongoDB.");
            }
            return callback(err);
        });
    },

    getDb: () => {
        return _db;
    },
};